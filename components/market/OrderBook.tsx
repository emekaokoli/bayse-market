"use client";

import { useOrderBook } from "@/hooks/useMarketData";
import { ChevronUp, HelpCircle, RefreshCw, Rows3 } from "lucide-react";
import { useState } from "react";

type Tab = "Yes Offers" | "No Offers";

function formatNaira(n: number) {
  return `₦${n.toLocaleString()}`;
}

function OrderRowLine({
  price,
  shares,
  side,
  maxAmount,
  badge,
}: {
  price: number;
  shares: number;
  side: "ask" | "bid";
  maxAmount: number;
  badge?: string;
}) {
  const amount = price * shares;
  const widthPct = Math.max(4, (amount / maxAmount) * 100);
  const isAsk = side === "ask";
  const barColor = isAsk ? "bg-red-100" : "bg-emerald-100";
  const textColor = isAsk ? "text-[#EF4444]" : "text-[#10B981]";
  const badgeColor = isAsk ? "bg-red-500" : "bg-emerald-500";

  return (
    <div className="relative grid grid-cols-3 items-center py-2.5 px-2 text-[11px]">
      <div
        className={`absolute inset-y-0 left-0 ${barColor} rounded`}
        style={{ width: `${widthPct}%` }}
      />
      <div className="relative flex items-center gap-1.5 z-10">
        {badge && (
          <span
            className={`text-[9px] ${badgeColor} text-white px-1.5 py-0.5 rounded font-black uppercase`}
          >
            {badge}
          </span>
        )}
        <span className={`font-bold ${textColor}`}>{formatNaira(price)}</span>
      </div>
      <div className="relative text-center text-[#334155] z-10">
        {shares.toLocaleString()}
      </div>
      <div className="relative text-right font-bold text-foreground z-10">
        {formatNaira(amount)}
      </div>
    </div>
  );
}

export default function OrderBook({
  yesMarketId,
  noMarketId,
}: {
  yesMarketId: string | null;
  noMarketId: string | null;
}) {
  const [tab, setTab] = useState<Tab>("Yes Offers");
  const marketId = tab === "Yes Offers" ? yesMarketId : noMarketId;

  const { data: raw, loading, error, refetch } = useOrderBook(marketId);

  const sortedBids = raw?.bids
    ? [...raw.bids]?.sort((a, b) => b.price - a.price)
    : [];
  const sortedAsks = raw?.asks
    ? [...raw.asks]?.sort((a, b) => a.price - b.price)
    : [];

  const allAmounts = [
    ...sortedAsks.map((r) => r.price * r.size),
    ...sortedBids.map((r) => r.price * r.size),
  ];
  const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : 1;

  const bestBid = sortedBids.length > 0 ? sortedBids[0].price : 0;
  const bestAsk = sortedAsks.length > 0 ? sortedAsks[0].price : 0;
  const spread = bestAsk - bestBid;
  const hasData = sortedBids.length > 0 && sortedAsks.length > 0;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
          Order Book
          <HelpCircle className="w-3.5 h-3.5 text-[#0066FF]" />
        </span>
        <ChevronUp className="w-4 h-4 text-[#64748B]" />
      </div>

      <div className="p-5">
        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          {(["Yes Offers", "No Offers"] as Tab[])?.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                tab === t
                  ? "border-[#0066FF] text-[#0066FF] bg-blue-50"
                  : "border-[#E2E8F0] text-[#64748B] hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Row-density toggle */}
        <button className="mb-4 p-1.5 border border-[#E2E8F0] rounded-md text-[#64748B] hover:text-foreground cursor-pointer">
          <Rows3 className="w-3.5 h-3.5" />
        </button>

        {/* Loading */}
        {loading && (
          <div className="space-y-2 py-4">
            {Array.from({ length: 5 })?.map((_, i) => (
              <div key={i} className="h-7 rounded animate-pulse bg-[#F1F5F9]" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-6 space-y-2">
            <p className="text-xs text-[#EF4444] font-medium">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && !hasData && (
          <div className="text-center py-10">
            <p className="text-xs text-[#94A3B8] font-medium">No orders available</p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && hasData && (
          <div className="w-full text-left font-medium">
            <div className="grid grid-cols-3 text-[#94A3B8] pb-2 font-bold uppercase tracking-wider text-[10px]">
              <div>Their Price</div>
              <div className="text-center">Shares</div>
              <div className="text-right">Total Amount</div>
            </div>

            <div className="divide-y divide-slate-100">
              {sortedAsks.map((row, idx) => (
                <OrderRowLine
                  key={`ask-${idx}`}
                  price={row.price}
                  shares={row.size}
                  side="ask"
                  maxAmount={maxAmount}
                  badge={idx === sortedAsks.length - 1 ? "Asks" : undefined}
                />
              ))}

              <div className="py-2 flex justify-between items-center text-[10px] font-bold px-2 my-1">
                <span className="text-[#64748B]">
                  Last Traded Price:{" "}
                  <span className="text-[#0066FF]">{formatNaira(bestAsk)}</span>
                </span>
                <span className="text-[#64748B]">
                  Spread: <span className="text-foreground">{formatNaira(spread)}</span>
                </span>
              </div>

              {sortedBids.map((row, idx) => (
                <OrderRowLine
                  key={`bid-${idx}`}
                  price={row.price}
                  shares={row.size}
                  side="bid"
                  maxAmount={maxAmount}
                  badge={idx === 0 ? "Bids" : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
