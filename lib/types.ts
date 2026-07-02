export type Timeframe = "1H" | "1D" | "1W" | "All";

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: string;
  category?: string;
  markets: Market[];
  createdAt: string;
}

export interface Market {
  id: string;
  eventId: string;
  outcome: string;
  outcomeId?: string;
  outcome1Id?: string;
  outcome1Label?: string;
  outcome2Id?: string;
  outcome2Label?: string;
  outcome1Price?: number;
  outcome2Price?: number;
  feePercentage?: number;
  title?: string;
  status?: string;
}

export interface Ticker {
  marketId: string;
  lastPrice: number;
  bestBid: number;
  bestAsk: number;
  volume24h: number;
  priceChangePct24h: number;
  outcome?: string;
  midPrice?: number;
  spread?: number;
  high24h?: number;
  low24h?: number;
  priceChange24h?: number;
  tradeCount24h?: number;
  timestamp?: string;
}

export interface OrderLevel {
  price: number;
  size: number;
  total?: number;
}

export interface OrderBook {
  bids: OrderLevel[];
  asks: OrderLevel[];
  outcomeId?: string;
  timestamp?: string;
  lastTradedPrice?: number;
  lastTradedSide?: string;
}

export interface AugmentedOrderLevel extends OrderLevel {
  cumulativeSize: number;
  depthPct: number;
}

export interface OrderBookStats {
  bestBid: number;
  bestAsk: number;
  spread: number;
  spreadPct: number;
  midpoint: number;
}

export interface AugmentedOrderBook {
  bids: AugmentedOrderLevel[];
  asks: AugmentedOrderLevel[];
  stats: OrderBookStats;
  maxCumulative: number;
}

export interface Trade {
  id: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  timestamp: string;
  outcome?: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}
