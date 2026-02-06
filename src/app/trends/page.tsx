"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { LiveCounter } from "@/components/live-counter";
import { ScamTrends } from "@/components/scam-trends";
import { CommunityShield } from "@/components/community-shield";
import { TrendingUp, Shield, Brain, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Sep", value: 62 },
  { month: "Oct", value: 71 },
  { month: "Nov", value: 58 },
  { month: "Dec", value: 84 },
  { month: "Jan", value: 93 },
  { month: "Feb", value: 100 },
];

const PROTECTION_TIPS = [
  {
    title: "IRS scams up 127% this week",
    icon: "🏛️",
    color: "#ef4444",
    tips: [
      "The IRS always mails official notices first -- they never call or text with threats",
      "No government agency accepts gift cards as payment. Ever.",
    ],
  },
  {
    title: "Crypto rug pulls surging +203%",
    icon: "🪙",
    color: "#f97316",
    tips: [
      "\"Guaranteed returns\" in crypto is ALWAYS a scam. No exceptions.",
      "Never send tokens to an unknown wallet address -- transactions are irreversible",
    ],
  },
  {
    title: "\"Hi Mom\" texts spreading fast",
    icon: "👨‍👩‍👧",
    color: "#8b5cf6",
    tips: [
      "Always verify via a known phone number or video call before sending any money",
      "Real family members can prove their identity. Scammers can't.",
    ],
  },
];

export default function TrendsPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        icon={TrendingUp}
        title="LIVE THREAT INTEL"
        subtitle="Real-time scam activity tracked across our community"
        badge="LIVE"
      />

      {/* ============================================
          LIVE STATS
          ============================================ */}
      <LiveCounter />

      {/* ============================================
          TWO-COLUMN: TRENDS + COMMUNITY
          ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ScamTrends />
        <CommunityShield />
      </div>

      {/* ============================================
          MONTHLY TREND CHART
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
          <span className="font-display text-sm tracking-widest text-[#525252] uppercase">6-Month Trend</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
        </div>

        <div className="brutal-card brutal-card-dark p-5 brutal-shadow">
          <div className="flex items-end justify-between gap-2 h-40">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="font-display text-sm text-[#facc15]">{d.value}K</span>
                <div
                  className="w-full bg-[#facc15] border-2 border-[#facc15] transition-all duration-500 hover:bg-[#ef4444] hover:border-[#ef4444]"
                  style={{ height: `${d.value}%` }}
                />
                <span className="text-[10px] text-white/60 uppercase">{d.month}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/40 text-center mt-3 uppercase tracking-wider">
            Scam reports (thousands) -- Source: FTC Consumer Sentinel
          </p>
        </div>
      </div>

      {/* ============================================
          PROTECTION TIPS
          ============================================ */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
          <span className="font-display text-sm tracking-widest text-[#525252] uppercase">Protect Yourself</span>
          <div className="h-[2px] w-8 bg-[#0a0a0a]" />
        </div>

        <div className="space-y-3">
          {PROTECTION_TIPS.map((tip) => (
            <div key={tip.title} className="brutal-card p-4 brutal-shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{tip.icon}</span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: tip.color }} />
                  <p className="font-bold text-sm text-[#0a0a0a]">{tip.title}</p>
                </div>
              </div>
              <div className="space-y-2 pl-8">
                {tip.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                    <span className="text-[#525252]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/" className="brutal-card brutal-card-dark p-5 text-center group brutal-shadow-sm">
          <Shield className="w-6 h-6 text-[#facc15] mx-auto mb-2" />
          <p className="font-display text-lg text-white mb-1">SCAN NOW</p>
          <p className="text-[10px] text-white/60 mb-2">Got a suspicious message?</p>
          <ArrowRight className="w-4 h-4 mx-auto text-[#facc15] group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/learn" className="brutal-card brutal-card-yellow p-5 text-center group brutal-shadow-sm">
          <Brain className="w-6 h-6 text-[#0a0a0a] mx-auto mb-2" />
          <p className="font-display text-lg text-[#0a0a0a] mb-1">TAKE THE QUIZ</p>
          <p className="text-[10px] text-[#0a0a0a]/60 mb-2">Test your detection skills</p>
          <ArrowRight className="w-4 h-4 mx-auto text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
