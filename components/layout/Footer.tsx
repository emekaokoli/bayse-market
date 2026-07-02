export default function Footer() {
  return (
    <footer className="bg-[#0052CC] text-white pt-32 pb-8 px-6 mt-0">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-6 gap-8 text-xs pb-10 border-b border-blue-400/20">
        {/* Main info identity column */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white text-[#0052CC] text-base">M</span>
              <span>bayse</span>
            </div>
            <p className="text-[10px] text-blue-200/60 mt-0.5 font-medium">Formerly Growvr</p>
          </div>
          <p className="text-blue-100 leading-relaxed max-w-xs font-light">
            The future of prediction markets in Africa. Trade the future, and turn your insights into profit.
          </p>
          <div className="flex items-center gap-3 pt-2 text-blue-200">
            <span className="cursor-pointer hover:text-white transition-colors text-sm font-bold">X</span>
            <svg className="w-4 h-4 cursor-pointer hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <span className="cursor-pointer hover:text-white transition-colors text-sm font-bold">in</span>
          </div>
        </div>

        {/* Quick links block */}
        <div className="space-y-3">
          <h5 className="font-bold text-white tracking-wider uppercase text-[10px] opacity-80">Quick Links</h5>
          <ul className="space-y-2 text-blue-100 font-light">
            <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Tutorials</li>
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Referral Program</li>
          </ul>
        </div>

        {/* Legal columns structure */}
        <div className="space-y-3">
          <h5 className="font-bold text-white tracking-wider uppercase text-[10px] opacity-80">Legal</h5>
          <ul className="space-y-2 text-blue-100 font-light">
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition-colors">Prohibition Policies</li>
            <li className="hover:text-white cursor-pointer transition-colors">Dispute Resolution Policy</li>
          </ul>
        </div>

        {/* Corporate segment details */}
        <div className="space-y-3">
          <h5 className="font-bold text-white tracking-wider uppercase text-[10px] opacity-80">Company</h5>
          <ul className="space-y-2 text-blue-100 font-light">
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
          </ul>
        </div>

        {/* Location details parameters */}
        <div className="space-y-3">
          <h5 className="font-bold text-white tracking-wider uppercase text-[10px] opacity-80">Contact</h5>
          <p className="text-blue-100 font-light leading-relaxed">
            support@growvr.com <br />
            8 The Green, Ste A, <br />
            Dover County of Kent, 19901
          </p>
        </div>
      </div>

      {/* Disclaimer / Bottom legal context stack */}
      <div className="max-w-[1280px] mx-auto pt-6 text-[10px] text-blue-200/70 font-light space-y-4">
        <p className="leading-relaxed">
          Prediction markets involve financial risk—only trade with funds you can afford to lose. Bayse Markets does not provide investment or financial advice. All market outcomes are resolved transparently using publicly verifiable sources. Participation is restricted to individuals 18 years and older and may be limited in some jurisdictions. Please review our Terms of Service, Privacy Policy, and Prohibition Policy before using the platform.
        </p>
        <div className="flex justify-between text-[11px] text-blue-100/50 font-normal pt-2">
          <span>© 2026 Bayse. All Right Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
