"use client";

import { Lightbulb, Brain, ShieldCheck, ArrowRight } from "lucide-react";

interface WhatYouLearnedProps {
  scamType: string;
  tactics: string[];
  redFlags: string[];
}

const SCAM_TYPE_LESSONS: Record<string, { emoji: string; lesson: string; nextTime: string }> = {
  "Family Impersonation Scam": {
    emoji: "👨‍👩‍👧",
    lesson: "Scammers exploit family bonds and urgency to bypass your critical thinking.",
    nextTime: "Always verify via a known phone number or video call before sending money to 'family'.",
  },
  "Fake Invoice / Order Scam": {
    emoji: "📦",
    lesson: "Panic about unauthorized charges makes you call scammer hotlines instead of real support.",
    nextTime: "Never call numbers in emails. Go directly to the company's official website.",
  },
  "Bank Impersonation Scam": {
    emoji: "🏦",
    lesson: "Banks never send links via text. Fake urgency tricks you into clicking malicious links.",
    nextTime: "Log into your bank directly through their app or website - never through text links.",
  },
  "Government Impersonation Scam": {
    emoji: "🏛️",
    lesson: "The IRS and government agencies never threaten arrest or demand gift cards.",
    nextTime: "Government agencies always mail official notices first. Hang up on phone threats.",
  },
  "Tech Support Scam": {
    emoji: "💻",
    lesson: "Microsoft and Apple never cold-call about viruses. Pop-ups with phone numbers are fake.",
    nextTime: "Close suspicious pop-ups. Never call numbers displayed on your screen.",
  },
  "Crypto Investment Scam": {
    emoji: "🪙",
    lesson: "No legitimate investment guarantees fixed returns. 'Guaranteed profit' in crypto is always a scam. Once you send tokens to a scammer's wallet, the transaction is irreversible.",
    nextTime: "If someone promises guaranteed crypto returns, it's a scam. Period. Check SEC.gov for registered investment advisors.",
  },
  "Package Delivery Phishing": {
    emoji: "📬",
    lesson: "Scammers impersonate delivery services with tiny fee requests to steal your card details. Real carriers never text links for payment.",
    nextTime: "Track packages only through official carrier apps or websites. Never pay 'customs fees' via text links.",
  },
  "Advance Fee Fraud (419 Scam)": {
    emoji: "💰",
    lesson: "If a stranger promises millions for minimal effort, they want your money. The 'fees' never stop, and the payout never comes.",
    nextTime: "Delete and block. No stranger is going to give you money.",
  },
  "Business Email Compromise (BEC)": {
    emoji: "💼",
    lesson: "BEC attacks impersonate executives to exploit organizational trust. The FBI reported $2.9 billion in BEC losses in 2023 -- making it the costliest cybercrime type.",
    nextTime: "Always verify wire transfer requests by calling the executive on a known direct number. Never change vendor payment details based solely on email.",
  },
  "Pig Butchering (Long-Con Investment Scam)": {
    emoji: "💬",
    lesson: "'Wrong number' texts that lead to investment pitches are pig butchering scams. Scammers invest weeks building trust before directing victims to fake trading platforms. The FBI reported $3.96 billion in crypto fraud losses in 2023.",
    nextTime: "Never continue conversations with unknown 'wrong number' texters. No legitimate stranger will recommend investment platforms via text.",
  },
  "QR Code Scam (Quishing)": {
    emoji: "📱",
    lesson: "Scammers place fake QR codes over legitimate ones on parking meters, mail, and restaurant menus. The FTC issued a warning about this growing threat in December 2023.",
    nextTime: "Check if a QR code is a sticker placed over another. Preview the URL before entering any information. Use official payment apps instead.",
  },
  "Phishing / Fake Document": {
    emoji: "🖼️",
    lesson: "Scammers use fake screenshots, invoices, and login pages to steal credentials. Visual spoofing is harder to detect than text-based scams.",
    nextTime: "Never enter credentials on pages reached through links in messages. Type the URL directly or use the official app.",
  },
  "default": {
    emoji: "🎓",
    lesson: "Scammers use urgency, fear, and authority to bypass your natural skepticism.",
    nextTime: "When in doubt, pause. Legitimate requests can wait for verification.",
  },
};

export function WhatYouLearned({ scamType, redFlags }: WhatYouLearnedProps) {
  const lesson = SCAM_TYPE_LESSONS[scamType] || SCAM_TYPE_LESSONS["default"];

  return (
    <div className="brutal-card p-5 brutal-shadow relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 via-transparent to-[#facc15]/10" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#facc15] border-4 border-[#0a0a0a] dark:border-[#facc15] flex items-center justify-center">
            <Brain className="w-6 h-6 text-[#0a0a0a]" />
          </div>
          <div>
            <p className="font-display text-xl text-[#0a0a0a] dark:text-[#fafafa]">WHAT YOU LEARNED</p>
            <p className="text-xs text-[#525252] dark:text-[#a3a3a3]">You&apos;re now immune to this scam type</p>
          </div>
        </div>

        {/* Main lesson */}
        <div className="brutal-card brutal-card-yellow p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{lesson.emoji}</span>
            <div>
              <p className="font-bold text-[#0a0a0a] mb-1">{scamType}</p>
              <p className="text-sm text-[#525252]">{lesson.lesson}</p>
            </div>
          </div>
        </div>

        {/* Key takeaways */}
        <div className="space-y-3 mb-4">
          <p className="text-xs uppercase tracking-wider text-[#525252] dark:text-[#a3a3a3] font-bold flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-[#facc15]" />
            Key Red Flags You Can Now Spot
          </p>
          <div className="grid gap-2">
            {redFlags.slice(0, 3).map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                <span className="text-[#0a0a0a] dark:text-[#fafafa]">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next time tip */}
        <div className="brutal-card brutal-card-dark p-4">
          <p className="text-xs uppercase tracking-wider text-[#facc15] mb-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            Next Time You See This
          </p>
          <p className="text-sm text-white">{lesson.nextTime}</p>
        </div>

        {/* Immunity badge */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#22c55e]/10 border-2 border-[#22c55e] text-[#22c55e] font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            +1 IMMUNITY UNLOCKED
          </span>
        </div>
      </div>
    </div>
  );
}
