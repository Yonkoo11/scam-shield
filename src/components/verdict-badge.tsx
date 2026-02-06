"use client";

import { Verdict } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Zap, XCircle } from "lucide-react";

const verdictConfig: Record<Verdict, {
  label: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  Icon: typeof Shield;
}> = {
  SAFE: {
    label: "SAFE",
    emoji: "✅",
    bgColor: "bg-[#22c55e]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: Shield,
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    emoji: "⚠️",
    bgColor: "bg-[#facc15]",
    textColor: "text-[#0a0a0a]",
    borderColor: "border-[#0a0a0a]",
    Icon: AlertTriangle,
  },
  HIGH_RISK: {
    label: "HIGH RISK",
    emoji: "🚨",
    bgColor: "bg-[#f97316]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: Zap,
  },
  CONFIRMED_SCAM: {
    label: "CONFIRMED SCAM",
    emoji: "🛑",
    bgColor: "bg-[#ef4444]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: XCircle,
  },
};

interface VerdictBadgeProps {
  verdict: Verdict;
  confidence: number;
  size?: "sm" | "lg";
}

export function VerdictBadge({ verdict, confidence, size = "lg" }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 font-bold text-xs uppercase tracking-wide border-2",
          config.bgColor,
          config.textColor,
          config.borderColor
        )}
      >
        {config.emoji} {config.label}
      </span>
    );
  }

  return (
    <div className={cn(
      "border-4 p-6 text-center relative",
      config.bgColor,
      config.textColor,
      config.borderColor
    )}>
      <div className="text-5xl mb-3">{config.emoji}</div>
      <div className="font-display text-4xl tracking-tight mb-2">{config.label}</div>
      <div className="inline-block px-4 py-1 bg-[#0a0a0a] text-white font-display text-lg tracking-widest">
        {confidence}% CONFIDENCE
      </div>
    </div>
  );
}
