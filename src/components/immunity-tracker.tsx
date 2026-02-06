"use client";

import { Shield, Lock, CheckCircle } from "lucide-react";

interface ImmunityTrackerProps {
  learnedTypes: string[];
}

const ALL_SCAM_TYPES = [
  "Family Impersonation",
  "Fake Invoice",
  "Bank Phishing",
  "Government Impersonation",
  "Tech Support",
  "Lottery/Prize",
  "Romance Scam",
  "Crypto Investment",
  "Delivery Scam",
  "Job Offer Scam",
];

export function ImmunityTracker({ learnedTypes }: ImmunityTrackerProps) {
  const immunityPercentage = Math.round((learnedTypes.length / ALL_SCAM_TYPES.length) * 100);

  return (
    <div className="brutal-card p-4 brutal-shadow-sm relative overflow-hidden">
      {/* Background gradient based on immunity */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#22c55e]/20 to-transparent"
        style={{ width: `${immunityPercentage}%` }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="brutal-label brutal-label-green">
            <Shield className="w-3 h-3" />
            IMMUNITY SCORE
          </div>
          <span className="font-display text-2xl text-[#22c55e]">{immunityPercentage}%</span>
        </div>

        <p className="text-sm text-[#525252] dark:text-[#a3a3a3] mb-3">
          You&apos;re now immune to <span className="font-bold text-[#0a0a0a] dark:text-[#fafafa]">{learnedTypes.length}/{ALL_SCAM_TYPES.length}</span> common scam types
        </p>

        {/* Scam type grid */}
        <div className="grid grid-cols-2 gap-2">
          {ALL_SCAM_TYPES.map((type) => {
            const isLearned = learnedTypes.includes(type);
            return (
              <div
                key={type}
                className={`flex items-center gap-2 text-xs p-2 rounded ${
                  isLearned
                    ? "bg-[#22c55e]/10 text-[#22c55e]"
                    : "bg-[#f5f5f5] dark:bg-[#1a1a1a] text-[#525252] dark:text-[#a3a3a3]"
                }`}
              >
                {isLearned ? (
                  <CheckCircle className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 flex-shrink-0 opacity-50" />
                )}
                <span className={isLearned ? "font-medium" : "opacity-60"}>{type}</span>
              </div>
            );
          })}
        </div>

        {immunityPercentage === 100 && (
          <div className="mt-4 p-3 bg-[#22c55e] text-white text-center font-bold">
            🏆 FULLY IMMUNE - You&apos;re scam-proof!
          </div>
        )}
      </div>
    </div>
  );
}
