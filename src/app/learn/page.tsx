"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ScamQuiz } from "@/components/scam-quiz";
import { ImmunityTracker } from "@/components/immunity-tracker";
import { Brain } from "lucide-react";

const SCAM_TYPES = [
  { emoji: "👨‍👩‍👧", name: "Family Impersonation", desc: "\"Hi Mom\" texts from unknown numbers exploiting parental instincts to extract emergency money transfers.", severity: "critical" },
  { emoji: "📦", name: "Fake Invoice", desc: "Fake order confirmations from Amazon, PayPal, or Apple designed to make you call scammer hotlines.", severity: "critical" },
  { emoji: "🏦", name: "Bank Phishing", desc: "Spoofed bank alerts with malicious links. Real banks never send verification links via text.", severity: "critical" },
  { emoji: "🏛️", name: "Gov Impersonation", desc: "Fake IRS, SSA, or law enforcement threats demanding gift card payments to avoid arrest.", severity: "critical" },
  { emoji: "💻", name: "Tech Support", desc: "Pop-ups claiming virus infections. Microsoft and Apple never cold-call about computer problems.", severity: "high" },
  { emoji: "🪙", name: "Crypto / Rug Pull", desc: "Guaranteed returns on crypto investments, fake trading bots, and airdrop scams. Irreversible once sent.", severity: "critical" },
  { emoji: "📬", name: "Package Delivery", desc: "Fake delivery notices with tiny fee requests to steal card details. Real carriers never text payment links.", severity: "high" },
  { emoji: "💰", name: "Advance Fee (419)", desc: "Strangers promising millions for small upfront fees. The fees never stop and the payout never comes.", severity: "high" },
  { emoji: "💕", name: "Romance Scam", desc: "Fake online relationships built over weeks or months to eventually request money for emergencies.", severity: "critical" },
  { emoji: "🎰", name: "Lottery / Prize", desc: "\"You've won!\" messages for contests you never entered, requiring fees to claim your prize.", severity: "medium" },
];

export default function LearnPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        icon={Brain}
        title="BECOME SCAM-PROOF"
        subtitle="Master 10 types of scams with real examples and test your detection skills"
      />

      {/* ============================================
          IMMUNITY TRACKER
          ============================================ */}
      <div className="mb-8">
        <ImmunityTracker learnedTypes={[]} />
      </div>

      {/* ============================================
          INTERACTIVE QUIZ
          ============================================ */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#525252] dark:text-[#a3a3a3] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#facc15]" />
          Test your skills
        </p>
        <ScamQuiz />
      </div>

      {/* ============================================
          SCAM TYPE ENCYCLOPEDIA
          ============================================ */}
      <div className="mb-10" id="types">
        <div className="brutal-divider mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#525252] dark:text-[#a3a3a3] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ef4444]" />
          Know your enemy
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCAM_TYPES.map((scam, i) => (
            <div
              key={scam.name}
              className="brutal-card p-4 brutal-shadow-sm animate-scale-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{scam.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-lg text-[#0a0a0a] dark:text-[#fafafa] leading-tight">{scam.name}</p>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      scam.severity === "critical" ? "bg-[#ef4444]" :
                      scam.severity === "high" ? "bg-[#f97316]" : "bg-[#facc15]"
                    }`} />
                  </div>
                  <p className="text-xs text-[#525252] dark:text-[#a3a3a3] leading-relaxed">{scam.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="text-center mb-4">
        <div className="brutal-divider mb-4" />
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3]">
          <Link href="/" className="underline font-bold text-[#0a0a0a] dark:text-[#fafafa] hover:text-[#ef4444] transition-colors">Scan a message</Link>
          {" · "}
          <Link href="/trends" className="underline font-bold text-[#0a0a0a] dark:text-[#fafafa] hover:text-[#ef4444] transition-colors">See trends</Link>
        </p>
      </div>
    </div>
  );
}
