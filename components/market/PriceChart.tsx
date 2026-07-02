"use client";

import { usePriceHistory } from "@/hooks/useMarketData";
import type { Timeframe } from "@/lib/types";
import { BarChart3, Clock, Droplet, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Resolution = "ALL" | "1M" | "1W" | "1D" | "12H";

const RESOLUTIONS: Resolution[] = ["ALL", "1M", "1W", "1D", "12H"];

function resolutionToTimeframe(res: Resolution): Timeframe {
  switch (res) {
    case "ALL": return "All";
    case "1M": return "1W";
    case "1W": return "1W";
    case "1D": return "1D";
    case "12H": return "1H";
  }
}

export default function PriceChart({
  eventId,
  volume: volumeProp,
  resolvedDate: resolvedDateProp,
}: {
  eventId: string | null;
  volume?: string;
  resolvedDate?: string;
}) {
  const [resolution, setResolution] = useState<Resolution>("1W");
  const timeframe = resolutionToTimeframe(resolution);

  const { data, loading, error, refetch } = usePriceHistory(eventId, timeframe);

  const chartData = (data ?? []).map((p) => ({
    time: new Date(p.timestamp).getTime(),
    chance: +(p.price * 100).toFixed(1),
  }));

  const lastPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const firstPoint = chartData.length > 0 ? chartData[0] : null;
  const chance = lastPoint?.chance ?? 51;
  const changeToday =
    firstPoint && lastPoint
      ? +((lastPoint.chance - firstPoint.chance) / firstPoint.chance * 100).toFixed(1)
      : -2;
  const isDown = changeToday < 0;

  const trades = chartData.length;
  const volume = volumeProp ?? "₦200K";
  const resolvedDate = resolvedDateProp ?? "31st Oct, 2025";

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 relative shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0066FF]">{chance}%</span>
            <span
              className={`text-xs font-semibold ${
                isDown ? "text-[#EF4444]" : "text-[#16A34A]"
              }`}
            >
              {isDown ? "↓" : "↑"} {Math.abs(changeToday)}% today
            </span>
          </div>
          <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5 uppercase tracking-wider">
            Chance
          </div>
          <Image
            src="/watermark.png"
            alt=""
            width={123.19}
            height={30.16}
            className="absolute top-6 right-2 pointer-events-none select-none z-10"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse w-full h-40 bg-[#F1F5F9] rounded-lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="h-48 flex flex-col items-center justify-center space-y-2">
          <p className="text-xs text-[#EF4444] font-medium">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && (
        <div className="relative my-4">
         

          <div className="flex">
            <div className="flex-1 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#0066FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 60]}
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    tickLine={false}
                    axisLine={false}
                    orientation="right"
                    tickFormatter={(v: number) => `${v}%`}
                    ticks={[0, 25, 50]}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                    labelFormatter={(ts) => new Date(ts).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="chance"
                    stroke="#0066FF"
                    strokeWidth={2}
                    fill="url(#chartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-48 pl-3 text-[11px] text-[#94A3B8] font-medium">
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between text-[11px] text-[#94A3B8] px-1 font-medium border-b border-[#F1F5F9] pb-4">
        <span>Nov 1</span>
        <span>Nov 7</span>
        <span>Nov 14</span>
        <span>Nov 28</span>
      </div>

      {/* Resolution selector */}
      <div className="flex justify-center mt-4">
        <div className="inline-flex gap-1 p-1 border border-[#E2E8F0] rounded-lg">
          {RESOLUTIONS.map((res) => (
            <button
              key={res}
              onClick={() => setResolution(res)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                resolution === res
                  ? "bg-[#0F172A] text-white"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between mt-4 bg-[#F8FAFC] rounded-xl px-4 py-3 text-[12px] text-[#64748B] font-medium">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={14} className="text-[#94A3B8]" />
          {trades} Trades
        </div>
        <div className="w-px h-4 bg-[#E2E8F0]" />
        <div className="flex items-center gap-1.5">
          <Droplet size={14} className="text-[#94A3B8]" />
          {volume}
        </div>
        <div className="w-px h-4 bg-[#E2E8F0]" />
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-[#94A3B8]" />
          {resolvedDate}
        </div>
      </div>
    </div>
  );
}
