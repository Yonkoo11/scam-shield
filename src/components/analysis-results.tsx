"use client";

import { useState } from "react";
import { ScamAnalysis } from "@/types/analysis";
import { VerdictBadge } from "./verdict-badge";
import { Check, Share2, AlertTriangle, Target, Flag, ArrowRight, Shield } from "lucide-react";

interface AnalysisResultsProps {
  analysis: ScamAnalysis;
  onReset: () => void;
}

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = generateShareText(analysis);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scam Shield Report',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed, fall back to copy
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateShareText = (analysis: ScamAnalysis) => {
    const verdictEmoji = {
      SAFE: "✅",
      SUSPICIOUS: "⚠️",
      HIGH_RISK: "🚨",
      CONFIRMED_SCAM: "🛑"
    }[analysis.verdict];

    return `${verdictEmoji} Scam Shield Report

Verdict: ${analysis.verdict.replace('_', ' ')} (${analysis.confidence}% confidence)
${analysis.scamType ? `Type: ${analysis.scamType}\n` : ''}
Red Flags:
${analysis.redFlags.slice(0, 3).map(f => `• ${f}`).join('\n')}

Protect yourself and others. Check suspicious messages at ScamShield.app`;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verdict */}
      <VerdictBadge verdict={analysis.verdict} confidence={analysis.confidence} />

      {/* Scam Type */}
      {analysis.scamType && (
        <div className="border-4 border-[#0a0a0a] bg-white p-4 relative">
          <div className="absolute -top-3 left-4 bg-[#f97316] text-white font-display text-sm px-2 py-0.5 tracking-widest flex items-center gap-1">
            <Target className="w-3 h-3" />
            TYPE
          </div>
          <p className="font-display text-2xl text-[#0a0a0a] mt-2">{analysis.scamType}</p>
        </div>
      )}

      {/* Explanation */}
      <div className="border-4 border-[#0a0a0a] bg-white p-4 relative">
        <div className="absolute -top-3 left-4 bg-[#0a0a0a] text-white font-display text-sm px-2 py-0.5 tracking-widest flex items-center gap-1">
          <Shield className="w-3 h-3" />
          ANALYSIS
        </div>
        <p className="text-[#525252] leading-relaxed mt-2">{analysis.explanation}</p>
      </div>

      {/* Tactics */}
      {analysis.tactics.length > 0 && (
        <div className="border-4 border-[#0a0a0a] bg-white p-4 relative">
          <div className="absolute -top-3 left-4 bg-[#facc15] text-[#0a0a0a] font-display text-sm px-2 py-0.5 tracking-widest flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            TACTICS FOUND
          </div>
          <div className="space-y-4 mt-2">
            {analysis.tactics.map((tactic, i) => (
              <div key={i} className="border-l-4 border-[#facc15] pl-4">
                <p className="font-bold text-[#0a0a0a]">{tactic.name}</p>
                <p className="text-sm text-[#525252] mb-2">{tactic.description}</p>
                <p className="text-sm bg-[#f5f5f5] p-2 text-[#525252] italic border-2 border-[#e5e5e5]">&quot;{tactic.evidence}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div className="border-4 border-[#0a0a0a] bg-white p-4 relative">
          <div className="absolute -top-3 left-4 bg-[#ef4444] text-white font-display text-sm px-2 py-0.5 tracking-widest flex items-center gap-1">
            <Flag className="w-3 h-3" />
            RED FLAGS
          </div>
          <ul className="space-y-2 mt-2">
            {analysis.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-[#ef4444] mt-2 flex-shrink-0" />
                <span className="text-[#525252]">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="border-4 border-[#0a0a0a] bg-white p-4 relative">
        <div className="absolute -top-3 left-4 bg-[#22c55e] text-white font-display text-sm px-2 py-0.5 tracking-widest flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          WHAT TO DO
        </div>
        <ul className="space-y-2 mt-2">
          {analysis.recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#22c55e] font-bold mt-0.5">→</span>
              <span className="text-[#0a0a0a] font-medium">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Similar Scams */}
      {analysis.similarScamsCount > 0 && analysis.verdict !== "SAFE" && (
        <div className="text-center py-4 px-4 bg-[#0a0a0a] text-white border-4 border-[#facc15]">
          <p className="text-sm">
            This matches patterns from <span className="font-display text-xl text-[#facc15]">{analysis.similarScamsCount.toLocaleString()}</span> similar reported scams.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleShare}
          className="flex-1 py-4 px-4 bg-white text-[#0a0a0a] border-4 border-[#0a0a0a] font-bold uppercase tracking-wide brutal-shadow-sm transition-[transform,box-shadow] duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#0a0a0a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#0a0a0a] flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-4 px-4 bg-[#0a0a0a] text-white border-4 border-[#0a0a0a] font-bold uppercase tracking-wide brutal-shadow-sm transition-[transform,box-shadow] duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#525252] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#525252] flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Scan Another
        </button>
      </div>
    </div>
  );
}
