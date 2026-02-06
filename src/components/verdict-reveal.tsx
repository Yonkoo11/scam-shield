"use client";

import { useState, useEffect } from "react";
import { Verdict } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

interface VerdictRevealProps {
  verdict: Verdict;
  confidence: number;
  onRevealComplete: () => void;
}

const verdictConfig: Record<Verdict, {
  label: string;
  sublabel: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  Icon: typeof Shield;
}> = {
  SAFE: {
    label: "SAFE",
    sublabel: "No threats detected",
    emoji: "✅",
    bgColor: "bg-[#22c55e]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: ShieldCheck,
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    sublabel: "Proceed with caution",
    emoji: "⚠️",
    bgColor: "bg-[#facc15]",
    textColor: "text-[#0a0a0a]",
    borderColor: "border-[#0a0a0a]",
    Icon: ShieldAlert,
  },
  HIGH_RISK: {
    label: "HIGH RISK",
    sublabel: "Likely fraudulent",
    emoji: "🚨",
    bgColor: "bg-[#f97316]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: ShieldAlert,
  },
  CONFIRMED_SCAM: {
    label: "SCAM",
    sublabel: "Do not engage",
    emoji: "🛑",
    bgColor: "bg-[#ef4444]",
    textColor: "text-white",
    borderColor: "border-[#0a0a0a]",
    Icon: ShieldX,
  },
};

export function VerdictReveal({ verdict, confidence, onRevealComplete }: VerdictRevealProps) {
  const [phase, setPhase] = useState<"scanning" | "reveal" | "complete">("scanning");
  const config = verdictConfig[verdict];

  useEffect(() => {
    // Transition to reveal after 1.5s
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
    }, 1500);

    // Transition to complete after 3s
    const completeTimer = setTimeout(() => {
      setPhase("complete");
    }, 3000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Warning stripes top */}
      <div className="absolute top-0 left-0 right-0 warning-stripes h-4" />

      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 transition-[background-color] duration-500 ease-out",
          phase === "scanning" ? "bg-[#fafafa] dark:bg-[#0a0a0a]" : config.bgColor
        )}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {phase === "scanning" ? (
          <>
            {/* Scanning state */}
            <div className="relative mb-8">
              <Shield className="w-32 h-32 text-[#0a0a0a] dark:text-[#fafafa]" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-1 bg-[#facc15] animate-pulse" />
              </div>
            </div>
            <p className="font-display text-4xl text-[#0a0a0a] dark:text-[#fafafa] tracking-widest">
              SCANNING
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-3 h-3 bg-[#0a0a0a] dark:bg-[#facc15] animate-pulse" />
              <span className="w-3 h-3 bg-[#0a0a0a] dark:bg-[#facc15] animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-3 h-3 bg-[#0a0a0a] dark:bg-[#facc15] animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </>
        ) : (
          <>
            {/* Giant emoji */}
            <div
              className={cn(
                "text-[120px] md:text-[180px] leading-none mb-4 transition-[transform,opacity] duration-500 ease-out",
                phase === "reveal" && "animate-in zoom-in-50 duration-500"
              )}
            >
              {config.emoji}
            </div>

            {/* Verdict text */}
            <h2
              className={cn(
                "font-display text-7xl md:text-9xl tracking-tight mb-2 transition-[transform,opacity] duration-500 ease-out",
                config.textColor,
                phase === "reveal" && "animate-in fade-in slide-in-from-bottom-4 duration-500"
              )}
            >
              {config.label}
            </h2>

            {/* Sublabel */}
            <p
              className={cn(
                "text-xl md:text-2xl font-bold mb-6 opacity-90 transition-[transform,opacity] duration-500 ease-out",
                config.textColor,
                phase === "reveal" && "animate-in fade-in slide-in-from-bottom-4 duration-500"
              )}
              style={{ animationDelay: "0.1s" }}
            >
              {config.sublabel}
            </p>

            {/* Confidence badge */}
            <div
              className={cn(
                "px-6 py-3 bg-[#0a0a0a] text-white font-display text-2xl tracking-widest transition-[transform,opacity] duration-500 ease-out",
                phase === "reveal" && "animate-in fade-in slide-in-from-bottom-4 duration-500"
              )}
              style={{ animationDelay: "0.2s" }}
            >
              {confidence}% CONFIDENCE
            </div>
          </>
        )}
      </div>

      {/* Click to continue */}
      {phase === "complete" && (
        <button
          onClick={onRevealComplete}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#0a0a0a] text-white border-4 border-white font-display text-xl tracking-widest brutal-shadow-sm transition-[transform,box-shadow] duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_white] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_white] animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
        >
          VIEW FULL REPORT →
        </button>
      )}

      {/* Warning stripes bottom */}
      <div className="absolute bottom-0 left-0 right-0 warning-stripes h-4" />
    </div>
  );
}
