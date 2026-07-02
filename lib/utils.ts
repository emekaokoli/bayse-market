import type {
  OrderLevel,
  AugmentedOrderLevel,
  AugmentedOrderBook,
  OrderBookStats,
} from "./types";

export function formatPrice(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

export function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function computeOrderBookStats(
  bids: OrderLevel[],
  asks: OrderLevel[]
): OrderBookStats {
  const bestBid = bids.length > 0 ? bids[0].price : 0;
  const bestAsk = asks.length > 0 ? asks[0].price : 0;
  const spread = bestAsk - bestBid;
  const midpoint = (bestBid + bestAsk) / 2;
  const spreadPct = midpoint > 0 ? (spread / midpoint) * 100 : 0;

  return { bestBid, bestAsk, spread, spreadPct, midpoint };
}

export function augmentOrderLevels(
  levels: OrderLevel[],
  maxCumulative: number
): AugmentedOrderLevel[] {
  let cumulative = 0;
  return levels.map((level) => {
    cumulative += level.size;
    return {
      ...level,
      cumulativeSize: cumulative,
      depthPct: maxCumulative > 0 ? (cumulative / maxCumulative) * 100 : 0,
    };
  });
}

export function augmentOrderBook(raw: {
  bids: OrderLevel[];
  asks: OrderLevel[];
}): AugmentedOrderBook {
  const sortedBids = [...raw.bids].sort((a, b) => b.price - a.price);
  const sortedAsks = [...raw.asks].sort((a, b) => a.price - b.price);

  let bidCum = 0;
  const augBids = sortedBids.map((l) => {
    bidCum += l.size;
    return { ...l, cumulativeSize: bidCum, depthPct: 0 };
  });

  let askCum = 0;
  const augAsks = sortedAsks.map((l) => {
    askCum += l.size;
    return { ...l, cumulativeSize: askCum, depthPct: 0 };
  });

  const maxCumulative = Math.max(bidCum, askCum, 1);

  for (const b of augBids) b.depthPct = (b.cumulativeSize / maxCumulative) * 100;
  for (const a of augAsks) a.depthPct = (a.cumulativeSize / maxCumulative) * 100;

  const stats = computeOrderBookStats(sortedBids, sortedAsks);

  return { bids: augBids, asks: augAsks, stats, maxCumulative };
}
