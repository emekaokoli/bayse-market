"use client";

import Footer from "@/components/layout/Footer";
import JoinCTA from "@/components/layout/JoinCTA";
import Navbar from "@/components/layout/Navbar";
import BuySellPanel from "@/components/market/BuySellPanel";
import MarketHeader from "@/components/market/MarketHeader";
import MarketRules from "@/components/market/MarketRules";
import OrderBook from "@/components/market/OrderBook";
import PriceChart from "@/components/market/PriceChart";
import RelatedMarkets from "@/components/market/RelatedMarkets";
import Timeline from "@/components/market/Timeline";
import { useParams } from "next/navigation";
import { useEvent, useTicker } from "@/hooks/useMarketData";

export default function MarketPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, loading: eventLoading, error: eventError, refetch: refetchEvent } = useEvent(slug);

  const yesMarket = event?.markets.find((m) => m.outcome === "Yes") ?? null;
  const noMarket = event?.markets.find((m) => m.outcome === "No") ?? null;
  const rawMarketId = event?.markets[0]?.id ?? null;          // market UUID (ticker/trades)
  const yesOutcomeId = yesMarket?.outcomeId ?? null;            // outcome UUID (orderbook)
  const noOutcomeId = noMarket?.outcomeId ?? null;              // outcome UUID (orderbook)
  const eventId = event?.id ?? null;                           // event UUID (price-history)

  const { data: ticker, loading: tickerLoading, error: tickerError, refetch: refetchTicker } = useTicker(rawMarketId);

  const headerError = eventError || tickerError;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-500/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <MarketHeader
            event={event}
            lastPrice={ticker?.lastPrice ?? null}
            volume24h={ticker?.volume24h ?? null}
            priceChangePct24h={ticker?.priceChangePct24h ?? null}
            loading={eventLoading || tickerLoading}
            error={headerError}
            onRetry={() => { refetchEvent(); refetchTicker(); }}
          />
          <PriceChart eventId={eventId} />
          <OrderBook yesMarketId={yesOutcomeId} noMarketId={noOutcomeId} />
          <MarketRules />
          <Timeline />
          <RelatedMarkets />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <BuySellPanel />
          </div>
        </div>
      </main>

      <JoinCTA />
      <Footer />
    </div>
  );
}
