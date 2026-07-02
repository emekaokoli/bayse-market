"use client";
import { useState } from "react";

const SUMMARY_TEXT =
  "The Headies Award for Next Rated is an award presented at The Headies for outstanding artistes who have dropped bangers throughout the year. The event has seen a lot of superstars emerge from different backgrounds etc etc. If Wizkid wins a Grammy on the day of the event, then this market is resolved as Yes. The outcome of this event will be verified and based on the data provided by Grammy. The Headies Award for Next Rated is an award presented at The Headies for outstanding artistes who have dropped bangers throughout the year.";

export default function MarketRules() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-background p-6 space-y-3">
      <h3 className="text-sm font-bold text-primary">Market Summary & Rules</h3>
      <p
        className={`text-xs text-[#64748B] leading-relaxed ${expanded ? "" : "line-clamp-4"
          }`}
      >
        {SUMMARY_TEXT.split(/(Yes)/).map((part, i) =>
          part === "Yes" ? (
            <span key={i} className="text-[#0066FF] font-bold">
              Yes
            </span>
          ) : (
            <span key={i} className="font-normal font-sans tracking-[-1%] justify-center">{part}</span>
          )
        )}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center rounded-full border border-[#0066FF] bg-white px-3 py-1.5 text-xs font-bold text-[#0066FF] hover:bg-background/10 transition-colors cursor-pointer"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}