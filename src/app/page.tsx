import { Analyzer } from "@/components/analyzer";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Warning stripes header */}
      <div className="warning-stripes h-2" />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Alert Badge */}
        <div className="inline-flex items-center gap-2 bg-[#ef4444] text-white px-4 py-2 font-bold text-xs uppercase tracking-widest mb-6 animate-shake">
          <AlertTriangle className="w-4 h-4 animate-flash" />
          Protect Yourself Now
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-7xl md:text-8xl leading-[0.85] tracking-tight mb-4">
          <span className="text-[#0a0a0a]">DON&apos;T</span>
          <br />
          <span className="bg-[#0a0a0a] text-white px-2 inline-block">GET</span>
          <br />
          <span className="text-[#ef4444] underline decoration-[6px] underline-offset-4">SCAMMED</span>
        </h1>

        <p className="text-lg text-[#525252] mb-8 max-w-md">
          Paste any suspicious message. We&apos;ll tell you if it&apos;s trying to steal from you.
        </p>

        {/* Stats */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-[#0a0a0a] text-white p-5 relative tilt-left">
            <div className="absolute -inset-1 border-[3px] border-[#facc15] -z-10" />
            <p className="font-display text-4xl text-[#facc15]">$10B+</p>
            <p className="text-xs uppercase tracking-wide opacity-80">Stolen in 2023</p>
          </div>
          <div className="flex-1 bg-[#0a0a0a] text-white p-5 relative tilt-right">
            <div className="absolute -inset-1 border-[3px] border-[#facc15] -z-10" />
            <p className="font-display text-4xl text-[#facc15]">2.4M</p>
            <p className="text-xs uppercase tracking-wide opacity-80">Fraud Reports</p>
          </div>
          <div className="flex-1 bg-[#0a0a0a] text-white p-5 relative tilt-slight">
            <div className="absolute -inset-1 border-[3px] border-[#facc15] -z-10" />
            <p className="font-display text-4xl text-[#facc15]">1 in 3</p>
            <p className="text-xs uppercase tracking-wide opacity-80">Adults Hit</p>
          </div>
        </div>

        {/* Main Analyzer */}
        <Analyzer />

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t-2 border-[#0a0a0a] flex justify-between text-xs uppercase tracking-wide text-[#525252]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0a0a0a]" />
            No Data Stored
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0a0a0a]" />
            Instant Results
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0a0a0a]" />
            100% Private
          </span>
        </footer>
      </div>

      {/* Warning stripes footer */}
      <div className="warning-stripes h-2" />
    </main>
  );
}
