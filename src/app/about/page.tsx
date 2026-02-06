"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { GeminiDemo } from "@/components/gemini-demo";
import {
  Shield,
  Lock,
  Zap,
  Sparkles,
  Brain,
  ArrowRight,
  Code2,
  Palette,
  FileCode2,
  Atom,
  Star,
  BookOpen,
} from "lucide-react";

const TECH_STACK = [
  { name: "Gemini AI", icon: Star, color: "#4285F4" },
  { name: "Next.js 14", icon: Code2, color: "#0a0a0a" },
  { name: "TypeScript", icon: FileCode2, color: "#3178c6" },
  { name: "Tailwind", icon: Palette, color: "#06b6d4" },
  { name: "React 18", icon: Atom, color: "#61dafb" },
  { name: "Lucide", icon: BookOpen, color: "#f97316" },
];

const TIMELINE = [
  { day: "Day 1", label: "Research", desc: "Analyzed 10K+ scam patterns from FTC data" },
  { day: "Day 2", label: "Prototype", desc: "Built scanner + Gemini AI integration" },
  { day: "Day 3", label: "Polish", desc: "Added quiz, trends, community features" },
  { day: "Day 4", label: "Ship", desc: "You're using it right now" },
];

export default function AboutPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        icon={Shield}
        title="ABOUT SCAM SHIELD"
        subtitle="Built with Gemini AI to protect everyone from scams"
      />

      {/* ============================================
          MISSION STATEMENT
          ============================================ */}
      <div className="brutal-card brutal-card-yellow p-6 mb-8 brutal-shadow animate-slide-in-left">
        <p className="font-display text-3xl md:text-4xl text-[#0a0a0a] leading-tight mb-3">
          $10.3 BILLION LOST TO SCAMS IN 2023.
        </p>
        <p className="text-[#0a0a0a]/70 text-lg mb-4 animate-slide-in-left stagger-1">
          That&apos;s someone&apos;s retirement. Someone&apos;s college fund. Someone&apos;s trust in other people.
        </p>
        <div className="brutal-card brutal-card-dark p-4 animate-slide-in-left stagger-2">
          <p className="font-display text-xl text-[#facc15]">
            WE&apos;RE BUILDING THE IMMUNE SYSTEM AGAINST FRAUD.
          </p>
          <p className="text-sm text-white/70 mt-1">
            Every scan makes you smarter. Every quiz builds immunity. Every report protects someone else.
          </p>
        </div>
      </div>

      {/* ============================================
          POWERED BY GEMINI
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
          <span className="font-display text-sm tracking-widest text-[#525252] uppercase">Powered by Gemini</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* How Gemini Works */}
          <div className="brutal-card p-5 brutal-shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#4285F4]" />
              <span className="font-display text-lg tracking-wider">HOW GEMINI PROTECTS YOU</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#4285F4]/10 border-2 border-[#4285F4] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-[#4285F4]">50+</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a0a0a]">Manipulation Tactics</p>
                  <p className="text-xs text-[#525252]">Detects urgency, threats, authority abuse, and more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#9b72cb]/10 border-2 border-[#9b72cb] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-[#9b72cb]">2X</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a0a0a]">Multimodal Analysis</p>
                  <p className="text-xs text-[#525252]">Scans both text messages and screenshot images</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#d96570]/10 border-2 border-[#d96570] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-[#d96570]">&lt;3s</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a0a0a]">Instant Processing</p>
                  <p className="text-xs text-[#525252]">Results in under 3 seconds via Gemini 2.0 Flash</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <GeminiDemo />
        </div>
      </div>

      {/* ============================================
          PRIVACY & TRUST
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
          <span className="font-display text-sm tracking-widest text-[#525252] uppercase">Your Privacy</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#facc15]" />
            </div>
            <p className="font-display text-lg text-[#0a0a0a] mb-1">NO DATA STORED</p>
            <p className="text-[10px] text-[#525252] leading-tight">Messages analyzed in real-time, never saved to any database</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-[#22c55e]" />
            </div>
            <p className="font-display text-lg text-[#0a0a0a] mb-1">100% PRIVATE</p>
            <p className="text-[10px] text-[#525252] leading-tight">No tracking, no cookies, no account required</p>
          </div>
          <div className="brutal-card p-4 text-center brutal-shadow-sm">
            <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-[#ef4444]" />
            </div>
            <p className="font-display text-lg text-[#0a0a0a] mb-1">INSTANT</p>
            <p className="text-[10px] text-[#525252] leading-tight">Powered by Gemini 2.0 Flash for sub-3-second results</p>
          </div>
        </div>
      </div>

      {/* ============================================
          TECH STACK
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
          <span className="font-display text-sm tracking-widest text-[#525252] uppercase">Built With</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TECH_STACK.map((tech) => {
            const Icon = tech.icon;
            return (
              <div key={tech.name} className="brutal-card p-3 text-center hover-tilt brutal-shadow-sm">
                <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: tech.color }} />
                <p className="text-[10px] font-bold text-[#525252] uppercase">{tech.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================
          HACKATHON STORY
          ============================================ */}
      <div className="mb-8">
        <div className="brutal-card brutal-card-dark p-6 brutal-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#4285F4]" />
            <span className="font-display text-lg text-white tracking-wider">GEMINI API DEVELOPER COMPETITION 2026</span>
          </div>
          <p className="text-white/70 text-sm mb-6">
            We built this in 4 days to prove a point: AI should protect people, not just entertain them.
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Yellow line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-[#facc15]" />

            <div className="space-y-4">
              {TIMELINE.map((step, i) => (
                <div key={step.day} className="flex items-start gap-4 relative animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-10 h-10 bg-[#facc15] border-2 border-[#facc15] flex items-center justify-center flex-shrink-0 z-10">
                    <span className="font-display text-sm text-[#0a0a0a]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-display text-base text-[#facc15]">{step.day}: {step.label}</p>
                    <p className="text-xs text-white/60">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/" className="brutal-card brutal-card-dark p-5 text-center group brutal-shadow-sm">
          <Shield className="w-6 h-6 text-[#facc15] mx-auto mb-2" />
          <p className="font-display text-lg text-white mb-1">TRY IT NOW</p>
          <p className="text-[10px] text-white/60 mb-2">Scan your first message</p>
          <ArrowRight className="w-4 h-4 mx-auto text-[#facc15] group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/learn" className="brutal-card brutal-card-yellow p-5 text-center group brutal-shadow-sm">
          <Brain className="w-6 h-6 text-[#0a0a0a] mx-auto mb-2" />
          <p className="font-display text-lg text-[#0a0a0a] mb-1">TAKE THE QUIZ</p>
          <p className="text-[10px] text-[#0a0a0a]/60 mb-2">Test your scam IQ</p>
          <ArrowRight className="w-4 h-4 mx-auto text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
