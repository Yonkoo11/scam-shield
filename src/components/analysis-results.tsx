"use client";

import { ScamAnalysis } from "@/types/analysis";
import { VerdictBadge } from "./verdict-badge";
import { ShareCard } from "./share-card";
import { WhatYouLearned } from "./what-you-learned";
import { ReportScamButton } from "./community-shield";
import { AlertTriangle, Target, Flag, ArrowRight, Shield } from "lucide-react";

interface AnalysisResultsProps {
  analysis: ScamAnalysis;
  onReset: () => void;
}

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verdict */}
      <VerdictBadge verdict={analysis.verdict} confidence={analysis.confidence} />

      {/* Scam Type */}
      {analysis.scamType && (
        <div className="brutal-card p-4 relative brutal-shadow-sm">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-orange">
            <Target className="w-3 h-3" />
            TYPE
          </div>
          <p className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mt-2">{analysis.scamType}</p>
        </div>
      )}

      {/* Explanation */}
      <div className="brutal-card p-4 relative brutal-shadow-sm">
        <div className="absolute -top-3 left-4 brutal-label brutal-label-black">
          <Shield className="w-3 h-3" />
          ANALYSIS
        </div>
        <p className="text-[#525252] dark:text-[#a3a3a3] leading-relaxed mt-2">{analysis.explanation}</p>
      </div>

      {/* Tactics */}
      {analysis.tactics.length > 0 && (
        <div className="brutal-card p-4 relative brutal-shadow-sm">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-yellow">
            <AlertTriangle className="w-3 h-3" />
            TACTICS FOUND
          </div>
          <div className="space-y-4 mt-2">
            {analysis.tactics.map((tactic, i) => (
              <div key={i} className="border-l-4 border-[#facc15] pl-4">
                <p className="font-bold text-[#0a0a0a] dark:text-[#fafafa]">{tactic.name}</p>
                <p className="text-sm text-[#525252] dark:text-[#a3a3a3] mb-2">{tactic.description}</p>
                <p className="text-sm bg-[#f5f5f5] dark:bg-[#1a1a1a] p-2 text-[#525252] dark:text-[#a3a3a3] italic border-2 border-[#e5e5e5] dark:border-[#333]">&quot;{tactic.evidence}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div className="brutal-card p-4 relative brutal-shadow-sm">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-red">
            <Flag className="w-3 h-3" />
            RED FLAGS
          </div>
          <ul className="space-y-2 mt-2">
            {analysis.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-[#ef4444] mt-2 flex-shrink-0" />
                <span className="text-[#525252] dark:text-[#a3a3a3]">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="brutal-card p-4 relative brutal-shadow-sm">
        <div className="absolute -top-3 left-4 brutal-label brutal-label-green">
          <ArrowRight className="w-3 h-3" />
          WHAT TO DO
        </div>
        <ul className="space-y-2 mt-2">
          {analysis.recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#22c55e] font-bold mt-0.5">→</span>
              <span className="text-[#0a0a0a] dark:text-[#fafafa] font-medium">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Similar Scams */}
      {analysis.similarScamsCount > 0 && analysis.verdict !== "SAFE" && (
        <div className="brutal-card brutal-card-dark p-4 border-4 border-[#facc15] text-center">
          <p className="text-sm text-white">
            This matches patterns from <span className="font-display text-2xl text-[#facc15]">{analysis.similarScamsCount.toLocaleString()}</span> similar reported scams.
          </p>
        </div>
      )}

      {/* What You Learned - only for scams */}
      {analysis.scamType && analysis.verdict !== "SAFE" && (
        <WhatYouLearned
          scamType={analysis.scamType}
          tactics={analysis.tactics.map(t => t.name)}
          redFlags={analysis.redFlags}
        />
      )}

      {/* Report to Community */}
      {analysis.verdict !== "SAFE" && (
        <ReportScamButton onReport={() => {}} />
      )}

      {/* Share Card */}
      <ShareCard analysis={analysis} />

      {/* Scan Another Button */}
      <button
        onClick={onReset}
        className="w-full brutal-btn brutal-btn-dark py-4 flex items-center justify-center gap-2"
      >
        <Shield className="w-4 h-4" />
        Scan Another Message
      </button>
    </div>
  );
}
