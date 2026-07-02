"use client";

import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1 max-w-4xl">
        <div className="flex items-center gap-2 text-[#0066FF] font-bold text-2xl tracking-tight">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0066FF] text-white text-lg">b</span>
          <span>bayse</span>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search markets..."
            className="w-full bg-[#F1F5F9] border-none rounded-full pl-10 pr-4 py-2 text-sm text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-medium">
        <div className="text-right">
          <div className="text-[#64748B] font-normal scale-90 origin-right">Portfolio</div>
          <div className="text-[#10B981] font-semibold">₦500k</div>
        </div>
        <div className="text-right border-r border-[#E2E8F0] pr-6">
          <div className="text-[#64748B] font-normal scale-90 origin-right">Cash</div>
          <div className="text-[#10B981] font-semibold">₦150k</div>
        </div>
        <button className="bg-[#0066FF] hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-500/10">
          Deposit
        </button>

        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer hover:bg-[#E2E8F0]">
            🔔
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E2E8F0] cursor-pointer">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
