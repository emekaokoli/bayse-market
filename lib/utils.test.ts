import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatVolume,
  computeOrderBookStats,
  augmentOrderLevels,
  augmentOrderBook,
} from "./utils";

describe("formatPrice", () => {
  it("formats with default 2 decimals", () => {
    expect(formatPrice(0.345)).toBe("0.34");
  });

  it("formats with custom decimals", () => {
    expect(formatPrice(0.3, 4)).toBe("0.3000");
  });
});

describe("formatVolume", () => {
  it("returns raw number for < 1000", () => {
    expect(formatVolume(999)).toBe("999");
  });

  it("formats thousands as K", () => {
    expect(formatVolume(1500)).toBe("1.5K");
  });

  it("formats millions as M", () => {
    expect(formatVolume(2_500_000)).toBe("2.5M");
  });
});

describe("computeOrderBookStats", () => {
  const bids = [{ price: 0.35, size: 100 }, { price: 0.34, size: 200 }];
  const asks = [{ price: 0.36, size: 150 }, { price: 0.37, size: 250 }];

  it("computes best bid and ask", () => {
    const stats = computeOrderBookStats(bids, asks);
    expect(stats.bestBid).toBe(0.35);
    expect(stats.bestAsk).toBe(0.36);
  });

  it("computes spread", () => {
    const stats = computeOrderBookStats(bids, asks);
    expect(stats.spread).toBeCloseTo(0.01, 5);
  });

  it("computes midpoint", () => {
    const stats = computeOrderBookStats(bids, asks);
    expect(stats.midpoint).toBe(0.355);
  });

  it("computes spread percentage", () => {
    const stats = computeOrderBookStats(bids, asks);
    expect(stats.spreadPct).toBeCloseTo(2.817, 1);
  });

  it("handles empty arrays", () => {
    const stats = computeOrderBookStats([], []);
    expect(stats.bestBid).toBe(0);
    expect(stats.bestAsk).toBe(0);
    expect(stats.spread).toBe(0);
    expect(stats.midpoint).toBe(0);
  });
});

describe("augmentOrderLevels", () => {
  it("adds cumulative size and depth percentage", () => {
    const levels = [
      { price: 0.35, size: 100 },
      { price: 0.34, size: 200 },
    ];
    const result = augmentOrderLevels(levels, 300);
    expect(result[0].cumulativeSize).toBe(100);
    expect(result[0].depthPct).toBeCloseTo(33.33, 1);
    expect(result[1].cumulativeSize).toBe(300);
    expect(result[1].depthPct).toBe(100);
  });

  it("handles empty input", () => {
    expect(augmentOrderLevels([], 100)).toEqual([]);
  });
});

describe("augmentOrderBook", () => {
  it("sorts bids descending and asks ascending", () => {
    const raw = {
      bids: [{ price: 0.34, size: 200 }, { price: 0.35, size: 100 }],
      asks: [{ price: 0.37, size: 250 }, { price: 0.36, size: 150 }],
    };
    const book = augmentOrderBook(raw);
    expect(book.bids[0].price).toBe(0.35);
    expect(book.bids[1].price).toBe(0.34);
    expect(book.asks[0].price).toBe(0.36);
    expect(book.asks[1].price).toBe(0.37);
  });

  it("computes stats", () => {
    const raw = {
      bids: [{ price: 0.35, size: 100 }],
      asks: [{ price: 0.36, size: 150 }],
    };
    const book = augmentOrderBook(raw);
    expect(book.stats.bestBid).toBe(0.35);
    expect(book.stats.bestAsk).toBe(0.36);
    expect(book.stats.midpoint).toBe(0.355);
  });
});
