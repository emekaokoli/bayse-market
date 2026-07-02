"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";

type Step = {
  label: string;
  date: string;
  completed: boolean;
};

const steps: Step[] = [
  { label: "Market Open", date: "18th of June, 2026", completed: true },
  { label: "Market Close", date: "28th of July, 2026", completed: false },
  { label: "Payout", date: "4-12 Hours After close", completed: false },
];

export default function Timeline() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm p-5">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <span className="text-sm font-bold text-foreground">Timeline & Payout</span>
        <ChevronUp className="w-4 h-4 text-[#64748B]" />
      </div>

      <div className="p-5">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <Image
                  src={step.completed ? "/icon-checked-green.png" : "/icon-checked-grey.png"}
                  alt={step.label}
                  width={24}
                  height={24}
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-7 ${step.completed ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                      }`}
                  />
                )}
              </div>
              <div className={isLast ? "" : "pb-5"}>
                <h4 className="text-xs font-bold text-foreground">{step.label}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{step.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}