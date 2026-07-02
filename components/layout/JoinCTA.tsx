export default function JoinCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 -mb-16 relative z-30">
      <div className="bg-[#EBF2FF] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="space-y-3 z-10 text-center md:text-left">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">
            Your knowledge should <br className="hidden md:inline" /> pay, you&apos;re early, join the <br className="hidden md:inline" /> movement.
          </h2>
          <button className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 mt-2">
            Start Trading Now
          </button>
        </div>
        {/* Real QR Code */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200/60 shadow-inner flex flex-col items-center gap-2 z-10">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://app.bayse.markets&color=0F172A&bgcolor=FFFFFF"
            alt="QR Code to download app"
            className="w-24 h-24"
          />
          <span className="text-[9px] font-bold tracking-wider text-[#64748B] uppercase">Scan to download</span>
        </div>
        {/* Abstract background subtle circle blur */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl -z-0"></div>
      </div>
    </section>
  );
}
