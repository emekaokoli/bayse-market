import type {
  ApiResult,
  Event,
  Ticker,
  OrderBook,
  Trade,
  PricePoint,
  Timeframe,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_BAYSE_API_BASE || "/api/bayse";
const API_KEY = process.env.NEXT_PUBLIC_BAYSE_API_KEY || "";

async function fetchApi<T>(path: string): Promise<ApiResult<T>> {
  if (!API_KEY) {
    return { data: null, error: "No API key configured" };
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "X-Public-Key": API_KEY },
    });
    const data = await res.json();
    const httpStatus = data._httpStatus ?? res.status;
    if (httpStatus >= 400) {
      return { data: null, error: data.message || `HTTP ${httpStatus}` };
    }
    const { _httpStatus, ...clean } = data;
    return { data: clean as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Fetch failed" };
  }
}

const TIMEFRAME_MAP: Record<Timeframe, string> = {
  "1H": "12H",
  "1D": "24H",
  "1W": "1W",
  "All": "1Y",
};

// ── Mock data ──────────────────────────────────────────────

const MOCK_EVENT: Event = {
  id: "evt_01",
  slug: "will-woldl-win-a-grammy-award",
  title: "Will Wiz Khalifa Win A Grammy Award?",
  description:
    "This market resolves to 'Yes' if Wiz Khalifa wins a Grammy Award in any category at the upcoming ceremony. If the ceremony is cancelled or Wiz Khalifa is not nominated, this market resolves to 'No'.",
  imageUrl: "",
  status: "trading",
  category: "Entertainment",
  markets: [
    { id: "mkt_yes", eventId: "evt_01", outcome: "Yes", outcomeId: "mkt_yes" },
    { id: "mkt_no", eventId: "evt_01", outcome: "No", outcomeId: "mkt_no" },
  ],
  createdAt: "2025-01-15T00:00:00Z",
};

const MOCK_TICKER_YES: Ticker = {
  marketId: "mkt_yes",
  lastPrice: 0.34,
  bestBid: 0.33,
  bestAsk: 0.35,
  volume24h: 12400,
  priceChangePct24h: 2.5,
};

const MOCK_TICKER_NO: Ticker = {
  marketId: "mkt_no",
  lastPrice: 0.66,
  bestBid: 0.65,
  bestAsk: 0.67,
  volume24h: 8700,
  priceChangePct24h: -1.8,
};

function generateMockOrderBook(seed?: number): OrderBook {
  const baseBid = 0.33;
  const baseAsk = 0.35;
  const shift = seed === 1 ? 0.32 : 0;
  const bids = Array.from({ length: 12 }, (_, i) => ({
    price: +((baseBid + shift) - i * 0.01).toFixed(2),
    size: Math.floor(100 + Math.random() * 400),
  }));
  const asks = Array.from({ length: 12 }, (_, i) => ({
    price: +((baseAsk + shift) + i * 0.01).toFixed(2),
    size: Math.floor(100 + Math.random() * 400),
  }));
  return { bids, asks };
}

function generateMockTrades(): Trade[] {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    id: `trd_${i}`,
    price: +(0.30 + Math.random() * 0.10).toFixed(2),
    size: Math.floor(10 + Math.random() * 90),
    side: Math.random() > 0.5 ? "buy" : "sell",
    timestamp: new Date(now - i * 30000).toISOString(),
    outcome: Math.random() > 0.5 ? "YES" : "NO",
  }));
}

function generateMockPriceHistory(): PricePoint[] {
  const now = Date.now();
  const points: PricePoint[] = [];
  let price = 0.28;
  for (let i = 48; i >= 0; i--) {
    price += (Math.random() - 0.45) * 0.02;
    price = Math.max(0.10, Math.min(0.90, price));
    points.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      price: +price.toFixed(2),
    });
  }
  return points;
}

const MOCK_ORDERBOOK_YES = generateMockOrderBook();
const MOCK_ORDERBOOK_NO = generateMockOrderBook(1);
const MOCK_TRADES = generateMockTrades();
const MOCK_PRICE_HISTORY = generateMockPriceHistory();

// ── Normalization helpers ──────────────────────────────────

function normalizeEvent(raw: any): Event {
  const normalLabel = (label: string) => {
    const upper = label?.toUpperCase();
    if (upper === "YES") return "Yes";
    if (upper === "NO") return "No";
    return label ?? "";
  };
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.rules ?? "",
    imageUrl: raw.imageUrl ?? "",
    status: raw.status,
    category: raw.category,
    createdAt: raw.openingDate ?? new Date().toISOString(),
    markets: (raw.markets ?? []).flatMap((m: any) => [
      {
        id: m.id,
        eventId: raw.id,
        outcome: normalLabel(m.outcome1Label),
        outcomeId: m.outcome1Id,
        outcome1Id: m.outcome1Id,
        outcome1Label: m.outcome1Label,
        outcome2Id: m.outcome2Id,
        outcome2Label: m.outcome2Label,
        outcome1Price: m.outcome1Price,
        outcome2Price: m.outcome2Price,
        title: m.title,
        status: m.status,
      },
      {
        id: m.id,
        eventId: raw.id,
        outcome: normalLabel(m.outcome2Label),
        outcomeId: m.outcome2Id,
      },
    ]),
  };
}

function normalizeTicker(raw: any): Ticker {
  return {
    marketId: raw.marketId,
    lastPrice: raw.lastPrice,
    bestBid: raw.bestBid,
    bestAsk: raw.bestAsk,
    volume24h: raw.volume24h,
    priceChangePct24h:
      raw.lastPrice > 0
        ? +(((raw.priceChange24h ?? 0) / raw.lastPrice) * 100).toFixed(2)
        : 0,
  };
}

/**
 * Fetches the order book for a single outcome.
 * The API returns an array of books (one per requested outcomeId).
 * We return the single book object for the given outcomeId.
 *
 * @param outcomeId - UUID of the outcome (from Market.outcome1Id or Market.outcome2Id)
 */
function normalizeOrderBook(raw: any): OrderBook {
  return {
    bids: (raw.bids ?? []).map((b: any) => ({
      price: b.price,
      size: b.quantity,
      total: b.total,
    })),
    asks: (raw.asks ?? []).map((a: any) => ({
      price: a.price,
      size: a.quantity,
      total: a.total,
    })),
    outcomeId: raw.outcomeId,
    timestamp: raw.timestamp,
    lastTradedPrice: raw.lastTradedPrice,
    lastTradedSide: raw.lastTradedSide,
  };
}

function normalizeTrades(rawTrades: any[]): Trade[] {
  return (rawTrades ?? []).map((t: any) => ({
    id: t.id,
    price: t.takerPrice ?? t.price ?? 0,
    size: t.size,
    side: t.takerSide === "BUY" ? "buy" : "sell",
    timestamp: t.createdAt,
  }));
}

function normalizePriceHistory(raw: any): PricePoint[] {
  const allPoints: PricePoint[] = [];
  for (const market of raw?.markets ?? []) {
    for (const point of market.priceHistory ?? []) {
      allPoints.push({
        timestamp: new Date(point.e).toISOString(),
        price: point.p,
      });
    }
  }
  allPoints.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  return allPoints;
}

// ── Public API functions ───────────────────────────────────

function isRealUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function getEventBySlug(slug: string): Promise<ApiResult<Event>> {
  const result = await fetchApi<any>(
    `/v1/pm/events/slug/${slug}?currency=NGN`
  );
  if (result.data) {
    return { data: normalizeEvent(result.data), error: null };
  }
  return { data: MOCK_EVENT, error: null };
}

export async function getTicker(marketId: string): Promise<ApiResult<Ticker>> {
  if (!isRealUuid(marketId)) {
    if (marketId === MOCK_TICKER_YES.marketId)
      return { data: MOCK_TICKER_YES, error: null };
    if (marketId === MOCK_TICKER_NO.marketId)
      return { data: MOCK_TICKER_NO, error: null };
    return { data: null, error: "Invalid marketId" };
  }
  const result = await fetchApi<any>(
    `/v1/pm/markets/${marketId}/ticker?outcome=YES`
  );
  if (result.data) {
    return { data: normalizeTicker(result.data), error: null };
  }
  return result;
}

/**
 * Fetches the order book for a single outcome.
 * The API returns an array of books (one per requested outcomeId).
 * We return the single book object for the given outcomeId.
 *
 * @param outcomeId - UUID of the outcome (from Market.outcome1Id or Market.outcome2Id)
 */
export async function getOrderBook(
  outcomeId: string
): Promise<ApiResult<OrderBook>> {
  if (!isRealUuid(outcomeId)) {
    if (outcomeId === "mkt_yes" || outcomeId === "mkt_01")
      return { data: MOCK_ORDERBOOK_YES, error: null };
    if (outcomeId === "mkt_no")
      return { data: MOCK_ORDERBOOK_NO, error: null };
    return { data: null, error: "Invalid outcomeId" };
  }
  const result = await fetchApi<any>(
    `/v1/pm/books?outcomeId[]=${outcomeId}&depth=12&currency=NGN`
  );
  if (result.data && Array.isArray(result.data) && result.data.length > 0) {
    return { data: normalizeOrderBook(result.data[0]), error: null };
  }
  return result as ApiResult<OrderBook>;
}

export async function getTrades(marketId: string): Promise<ApiResult<Trade[]>> {
  if (!isRealUuid(marketId)) {
    if (marketId === "mkt_01" || marketId === "mkt_yes") {
      return { data: MOCK_TRADES, error: null };
    }
    return { data: null, error: "Invalid marketId" };
  }
  const result = await fetchApi<any>(
    `/v1/pm/trades?marketId=${marketId}&page=1&size=20`
  );
  if (result.data) {
    return { data: normalizeTrades(result.data.data ?? []), error: null };
  }
  return result;
}

export async function getPriceHistory(
  eventId: string,
  timeframe: Timeframe
): Promise<ApiResult<PricePoint[]>> {
  if (!isRealUuid(eventId)) {
    if (eventId === "evt_01") {
      return { data: MOCK_PRICE_HISTORY, error: null };
    }
    return { data: null, error: "Invalid eventId" };
  }
  const timePeriod = TIMEFRAME_MAP[timeframe];
  const result = await fetchApi<any>(
    `/v1/pm/events/${eventId}/price-history?timePeriod=${timePeriod}&outcome=YES`
  );
  if (result.data) {
    return { data: normalizePriceHistory(result.data), error: null };
  }
  return result;
}
