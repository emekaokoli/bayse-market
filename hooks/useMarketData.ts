"use client";

import useSWR from "swr";
import {
  getEventBySlug,
  getTicker,
  getOrderBook,
  getTrades,
  getPriceHistory,
} from "@/lib/api";
import type {
  ApiResult,
  Event,
  Ticker,
  OrderBook,
  Trade,
  PricePoint,
  Timeframe,
} from "@/lib/types";

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

async function swrFetcher<T>(
  fn: () => Promise<ApiResult<T>>
): Promise<T> {
  const result = await fn();
  if (result.data !== null) return result.data;
  throw new Error(result.error ?? "Unknown error");
}

export function useEvent(slug: string): UseDataResult<Event> {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `event-${slug}` : null,
    () => swrFetcher(() => getEventBySlug(slug)),
    { revalidateOnFocus: false }
  );
  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch: () => mutate() };
}

export function useTicker(marketId: string | null): UseDataResult<Ticker> {
  const { data, error, isLoading, mutate } = useSWR(
    marketId ? `ticker-${marketId}` : null,
    () => swrFetcher(() => getTicker(marketId!)),
    { refreshInterval: 5000, revalidateOnFocus: false }
  );
  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch: () => mutate() };
}

export function useOrderBook(marketId: string | null): UseDataResult<OrderBook> {
  const { data, error, isLoading, mutate } = useSWR(
    marketId ? `orderbook-${marketId}` : null,
    () => swrFetcher(() => getOrderBook(marketId!)),
    { refreshInterval: 2000, revalidateOnFocus: false }
  );
  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch: () => mutate() };
}

export function useTrades(marketId: string | null): UseDataResult<Trade[]> {
  const { data, error, isLoading, mutate } = useSWR(
    marketId ? `trades-${marketId}` : null,
    () => swrFetcher(() => getTrades(marketId!)),
    { refreshInterval: 5000, revalidateOnFocus: false }
  );
  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch: () => mutate() };
}

export function usePriceHistory(
  eventId: string | null,
  timeframe: Timeframe
): UseDataResult<PricePoint[]> {
  const { data, error, isLoading, mutate } = useSWR(
    eventId ? `price-history-${eventId}-${timeframe}` : null,
    () => swrFetcher(() => getPriceHistory(eventId!, timeframe)),
    { refreshInterval: 30000, revalidateOnFocus: false }
  );
  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch: () => mutate() };
}
