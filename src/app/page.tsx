"use client";

import Link from "next/link";
import { Analyzer } from "@/components/analyzer";
import { LiveCounter } from "@/components/live-counter";
import {
  AlertTriangle,
  ClipboardPaste,
  ScanSearch,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#ef4444] text-white px-4 py-2 font-bold text-xs uppercase tracking-widest mb-6 brutal-shadow-sm">
          <AlertTriangle className="w-4 h-4" />
          Protect Yourself Now
        </div>

        <h1 className="font-display text-7xl md:text-8xl leading-[0.85] tracking-tight mb-6">
          <span className="text-[#0a0a0a] dark:text-[#fafafa] block animate-slide-in-left">DON&apos;T</span>
          <span className="bg-[#0a0a0a] dark:bg-[#facc15] text-white dark:text-[#0a0a0a] px-3 inline-block my-2 brutal-shadow-sm animate-slide-in-left stagger-1">GET</span>
          <br />
          <span className="text-[#ef4444] relative inline-block animate-slide-in-left stagger-2">
            SCAMMED
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
              <path d="M0 4 Q75 0, 150 4 T300 4" stroke="#ef4444" strokeWidth="6" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-lg text-[#525252] dark:text-[#a3a3a3] mb-5 max-w-md mx-auto animate-slide-in-left stagger-3">
          AI-powered scam detection. Paste anything suspicious and become immune.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border-2 border-[#0a0a0a] dark:border-[#333] text-sm font-bold animate-scale-in stagger-4">
          <Sparkles className="w-4 h-4 text-[#4285F4]" />
          <span className="text-[#525252] dark:text-[#a3a3a3]">Powered by</span>
          <span className="bg-gradient-to-r from-[#4285F4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent font-display text-lg tracking-wide">
            GEMINI AI
          </span>
        </div>
      </div>

      {/* ============================================
          PROBLEM STATS
          ============================================ */}
      <div className="brutal-card brutal-card-dark p-5 mb-8 brutal-shadow">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-3xl md:text-4xl text-[#facc15]">$10.3B</p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-1">Lost to scams in 2023</p>
          </div>
          <div className="border-x-2 border-white/10">
            <p className="font-display text-3xl md:text-4xl text-[#facc15]">2.6M</p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-1">Fraud reports annually</p>
          </div>
          <div>
            <p className="font-display text-3xl md:text-4xl text-[#facc15]">1 in 3</p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-1">People targeted yearly</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#525252] dark:text-[#a3a3a3] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#facc15]" />
          How it works
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#facc15] border-3 border-[#0a0a0a] dark:border-[#facc15] flex items-center justify-center mx-auto mb-3">
              <ClipboardPaste className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">1. Paste</div>
            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3] leading-tight">Copy any suspicious message, email, or screenshot</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#ef4444] border-3 border-[#0a0a0a] dark:border-[#ef4444] flex items-center justify-center mx-auto mb-3">
              <ScanSearch className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">2. Scan</div>
            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3] leading-tight">Gemini AI analyzes for 50+ manipulation tactics</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#22c55e] border-3 border-[#0a0a0a] dark:border-[#22c55e] flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">3. Learn</div>
            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3] leading-tight">Get a verdict, understand the tactics, become immune</p>
          </div>
        </div>
      </div>

      {/* Live Counter */}
      <LiveCounter />

      {/* ============================================
          SCANNER
          ============================================ */}
      <Analyzer />

      {/* Cross-links */}
      <div className="mt-8 mb-4 text-center">
        <div className="brutal-divider mb-4" />
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3]">
          <Link href="/learn" className="underline font-bold text-[#0a0a0a] dark:text-[#fafafa] hover:text-[#ef4444] transition-colors">Take the quiz</Link>
          {" · "}
          <Link href="/trends" className="underline font-bold text-[#0a0a0a] dark:text-[#fafafa] hover:text-[#ef4444] transition-colors">See trends</Link>
          {" · "}
          <Link href="/about" className="underline font-bold text-[#0a0a0a] dark:text-[#fafafa] hover:text-[#ef4444] transition-colors">About Gemini</Link>
        </p>
      </div>
    </div>
  );
}
