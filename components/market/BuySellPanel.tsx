"use client";

import { ArrowUpDown, RefreshCw } from "lucide-react";
import { useState } from "react";

type OrderType = "Buy" | "Sell";
type Outcome = "Yes" | "No";

const SHARES_OWNED = 100;
const PRICE_PER_SHARE = 44.12; // mock market price, drives the ₦1,500 receive figure at 34 shares

export default function BuySellPanel() {
  const [orderType, setOrderType] = useState<OrderType>("Sell");
  const [outcome, setOutcome] = useState<Outcome>("Yes");
  const [sharesToTrade, setSharesToTrade] = useState(34);

  const receiveAmount = sharesToTrade * PRICE_PER_SHARE;
  const costAmount = sharesToTrade * PRICE_PER_SHARE;

  const accentColor = outcome === "Yes" ? "#0066FF" : "#EF4444";
  const accentBg = outcome === "Yes" ? "bg-blue-50" : "bg-red-50";
  const accentText = outcome === "Yes" ? "text-[#0066FF]" : "text-[#EF4444]";

  const percentOptions = [25, 50, 70, 100];
  const amountOptions = ["₦1k", "₦5k", "₦10k", "Max"];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-4">
      {/* Top row: Buy/Sell segment + Set your Price */}
      <div className="flex items-center gap-2">
        <div className="bg-[#F1F5F9] p-1 rounded-xl grid grid-cols-2 text-center text-xs font-bold flex-1">
          {(["Buy", "Sell"] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`py-2 rounded-lg transition-all cursor-pointer ${orderType === t
                  ? "bg-[#0066FF] text-white shadow-sm"
                  : "text-[#64748B] hover:text-foreground"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#94A3B8] bg-[#F1F5F9] px-3 py-2.5 rounded-xl cursor-pointer">
          Set your Price <ArrowUpDown size={12} />
        </button>
      </div>

      {/* Position pill with flip icon */}
      <button
        onClick={() => setOutcome(outcome === "Yes" ? "No" : "Yes")}
        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg w-fit ${accentBg} ${accentText} cursor-pointer`}
      >
        {orderType} {outcome} <RefreshCw size={12} />
      </button>

      {/* Shares owned (Sell only) */}
      {orderType === "Sell" && (
        <div className="text-center">
          <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full inline-block">
            You Have: {SHARES_OWNED} Shares
          </span>
        </div>
      )}

      {/* Big number */}
      <div className="text-center">
        <div className="text-5xl font-extrabold font-sans" style={{ color: "#1E293B" }}>
          {sharesToTrade}
        </div>
      </div>

      {/* Receive / Cost line */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold">
        <span className={accentText}>
          {orderType === "Sell" ? "You'll Receive" : "You'll Pay"}
        </span>
        <span className="bg-emerald-50 text-[#10B981] px-3 py-1 rounded-full">
          ₦{(orderType === "Sell" ? receiveAmount : costAmount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Shortcut row: percent for Sell, currency for Buy */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold text-center">
        {orderType === "Sell"
          ? percentOptions.map((p) => (
            <button
              key={p}
              onClick={() => setSharesToTrade(Math.round((p / 100) * SHARES_OWNED))}
              className="py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#334155] hover:border-slate-400 transition-colors cursor-pointer"
            >
              {p === 100 ? "Max" : `${p}%`}
            </button>
          ))
          : amountOptions.map((val) => (
            <button
              key={val}
              className="py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#334155] hover:border-slate-400 transition-colors cursor-pointer"
            >
              {val}
            </button>
          ))}
      </div>

      {/* Primary action */}
      <button
        className="w-full text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-transform active:scale-[0.99] cursor-pointer"
        style={{ backgroundColor: accentColor }}
      >
        Review
      </button>
    </div>
  );
}