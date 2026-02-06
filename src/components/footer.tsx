import Link from "next/link";
import { Shield, Lock, Zap, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="container max-w-2xl mx-auto px-4 pb-4">
      <div className="brutal-divider mb-6" />

      {/* Navigation Links */}
      <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
        <div>
          <p className="font-display text-base tracking-wider text-[#0a0a0a] mb-2">NAVIGATE</p>
          <div className="space-y-1">
            <Link href="/" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Home</Link>
            <Link href="/learn" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Learn</Link>
            <Link href="/trends" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Trends</Link>
            <Link href="/about" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">About</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-base tracking-wider text-[#0a0a0a] mb-2">RESOURCES</p>
          <div className="space-y-1">
            <Link href="/learn" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Scam Quiz</Link>
            <Link href="/learn#types" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Scam Types</Link>
            <Link href="/trends" className="block text-[#525252] hover:text-[#0a0a0a] transition-colors">Live Reports</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-base tracking-wider text-[#0a0a0a] mb-2">TRUST</p>
          <div className="space-y-1 text-[#525252]">
            <p className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> No Data Stored</p>
            <p className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> 100% Private</p>
            <p className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Instant Results</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-[#0a0a0a]/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#525252]/60 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#0a0a0a] flex items-center justify-center">
            <Shield className="w-3 h-3 text-[#facc15]" />
          </div>
          <span className="font-display text-sm tracking-wider text-[#0a0a0a]">SCAM SHIELD</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#4285F4]" />
          <span>Powered by Gemini AI</span>
        </div>

        <span>Gemini Hackathon 2026</span>
      </div>
    </footer>
  );
}
