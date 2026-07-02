import Image from "next/image";

const RELATED = [
  { title: "Will Rema Release HEIS Delux by January?", chance: 18, img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&auto=format&fit=crop&q=80" },
  { title: "Best African Act Grammy Award Winner?", chance: 40, outcome: "Wizkid", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&auto=format&fit=crop&q=80" },
  { title: "Wizkid's Morayo to Chart on Billboard Hot 100?", chance: 20, img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=80&auto=format&fit=crop&q=80" },
  { title: "Grammy for Song of the Year", chance: 23, outcome: "Not like us", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=80&auto=format&fit=crop&q=80" },
  { title: "Will Burna Boy Win Album of the Year?", chance: 18, img: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=80&auto=format&fit=crop&q=80" },
];
export default function RelatedMarkets() {
  return (
    <div className=" space-y-4 pb-6">
      <h3 className="text-sm font-bold text-slate-400">Related Markets</h3>
      <div className="space-y-5">
        {RELATED.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 cursor-pointer group">
            <Image
              src={item.img}
              alt={item.title}
              width={24}
              height={24}
              className="w-11 h-11 rounded-full object-cover bg-slate-100 shrink-0"
            />
            <div>
              <h4 className="text-sm font-bold text-[#1E3A5F] group-hover:text-[#0066FF] transition-colors leading-snug">
                {item.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-semibold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
                  {item.chance}% Chance
                </span>
                {item.outcome && (
                  <span className="text-xs text-slate-400">• {item.outcome}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}