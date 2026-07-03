"use client";

import type { Event } from "@/lib/types";
import { Bookmark, ChevronLeft, RefreshCw, Share2 } from "lucide-react";
import Image from "next/image";
import YesNoToggle from '../yesno';

interface MarketHeaderProps {
  event: Event | null;
  lastPrice: number | null;
  volume24h: number | null;
  priceChangePct24h: number | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function MarketHeader({
  event,
  loading,
  error,
  onRetry,
}: MarketHeaderProps) {
  if (error) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-[#EF4444] font-medium">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] border border-[#0066FF] rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-foreground transition-colors cursor-pointer">
        <ChevronLeft className="w-3.5 h-3.5" />
        Markets
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div>
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#E2E8F0] shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80"
                alt="Market"
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <div className="mt-2">
              <YesNoToggle />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight max-w-xl">
              {loading ? (
                <span className="inline-block h-6 w-80 rounded animate-pulse bg-[#E2E8F0]" />
              ) : (
                event?.title ?? "—"
              )}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
         
          <button className="p-2 text-[#64748B] hover:text-foreground hover:bg-slate-100 rounded-lg transition-colors border border-[#E2E8F0] bg-white cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#64748B] hover:text-foreground hover:bg-slate-100 rounded-lg transition-colors border border-[#E2E8F0] bg-white cursor-pointer">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
