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
  Brain,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#ef4444] text-white px-4 py-2 font-bold text-xs uppercase tracking-widest mb-6 animate-shake brutal-shadow-sm">
          <AlertTriangle className="w-4 h-4 animate-flash" />
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

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a] dark:bg-[#333]" />
          <span className="font-display text-sm tracking-widest text-[#525252] dark:text-[#a3a3a3] uppercase">How It Works</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a] dark:bg-[#333]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#facc15] border-3 border-[#0a0a0a] dark:border-[#facc15] flex items-center justify-center mx-auto mb-3">
              <ClipboardPaste className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">1. PASTE</div>
            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3] leading-tight">Copy any suspicious message, email, or screenshot</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#ef4444] border-3 border-[#0a0a0a] dark:border-[#ef4444] flex items-center justify-center mx-auto mb-3">
              <ScanSearch className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">2. SCAN</div>
            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3] leading-tight">Gemini AI analyzes for 50+ manipulation tactics</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-10 h-10 bg-[#22c55e] border-3 border-[#0a0a0a] dark:border-[#22c55e] flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mb-1">3. LEARN</div>
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

      {/* ============================================
          CROSS-LINKS
          ============================================ */}
      <div className="mt-8 mb-4">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a] dark:bg-[#333]" />
          <span className="font-display text-sm tracking-widest text-[#525252] dark:text-[#a3a3a3] uppercase">Explore More</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a] dark:bg-[#333]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link href="/learn" className="brutal-card brutal-card-yellow p-4 text-center brutal-shadow-sm group">
            <Brain className="w-6 h-6 text-[#0a0a0a] mx-auto mb-2" />
            <p className="font-display text-lg text-[#0a0a0a]">TEST YOUR SKILLS</p>
            <p className="text-[10px] text-[#0a0a0a]/60 mb-2">Take the scam quiz</p>
            <ArrowRight className="w-4 h-4 mx-auto text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/trends" className="brutal-card brutal-card-dark p-4 text-center brutal-shadow-sm group">
            <TrendingUp className="w-6 h-6 text-[#facc15] mx-auto mb-2" />
            <p className="font-display text-lg text-white">LIVE TRENDS</p>
            <p className="text-[10px] text-white/60 mb-2">See what&apos;s trending</p>
            <ArrowRight className="w-4 h-4 mx-auto text-[#facc15] group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="brutal-card p-4 text-center brutal-shadow-sm group">
            <Sparkles className="w-6 h-6 text-[#4285F4] mx-auto mb-2" />
            <p className="font-display text-lg text-[#0a0a0a] dark:text-[#fafafa]">ABOUT GEMINI</p>
            <p className="text-[10px] text-[#525252] dark:text-[#a3a3a3] mb-2">How AI protects you</p>
            <ArrowRight className="w-4 h-4 mx-auto text-[#0a0a0a] dark:text-[#facc15] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
