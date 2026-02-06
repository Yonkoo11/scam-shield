"use client";

import { useState, useRef } from "react";
import { ScamAnalysis, Verdict } from "@/types/analysis";
import { Share2, Twitter, MessageCircle, Copy, Check, Heart } from "lucide-react";

interface ShareCardProps {
  analysis: ScamAnalysis;
}

const verdictConfig: Record<Verdict, {
  emoji: string;
  label: string;
  color: string;
  bg: string;
}> = {
  SAFE: { emoji: "✅", label: "SAFE", color: "#22c55e", bg: "#dcfce7" },
  SUSPICIOUS: { emoji: "⚠️", label: "SUSPICIOUS", color: "#f59e0b", bg: "#fef3c7" },
  HIGH_RISK: { emoji: "🚨", label: "HIGH RISK", color: "#f97316", bg: "#ffedd5" },
  CONFIRMED_SCAM: { emoji: "🛑", label: "SCAM DETECTED", color: "#ef4444", bg: "#fee2e2" },
};

export function ShareCard({ analysis }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const config = verdictConfig[analysis.verdict];

  const shareText = `${config.emoji} I just used Scam Shield to check a suspicious message.

Verdict: ${config.label} (${analysis.confidence}% confidence)
${analysis.scamType ? `Type: ${analysis.scamType}` : ""}

Don't get scammed! Check suspicious messages at ScamShield.app

#ScamShield #StaySafe`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Scam Shield Report",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <div
        ref={cardRef}
        className="brutal-card p-6 relative overflow-hidden"
        style={{ background: config.bg }}
      >
        {/* Corner branding */}
        <div className="absolute top-0 right-0 bg-[#0a0a0a] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
          Scam Shield
        </div>

        <div className="flex items-start gap-4">
          <div className="text-5xl">{config.emoji}</div>
          <div className="flex-1">
            <p className="font-display text-3xl" style={{ color: config.color }}>
              {config.label}
            </p>
            <p className="text-sm text-[#525252] mt-1">
              {analysis.confidence}% confidence
            </p>
            {analysis.scamType && (
              <p className="text-xs font-bold text-[#0a0a0a] mt-2 uppercase tracking-wide">
                {analysis.scamType}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-[#0a0a0a]/10">
          <p className="text-xs text-[#525252]">
            {analysis.redFlags.length} red flags detected
          </p>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleNativeShare}
          className="flex-1 brutal-btn brutal-btn-primary py-3 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Result
        </button>
      </div>

      {/* Expanded share options */}
      {showShareOptions && (
        <div className="brutal-card p-4 space-y-3 animate-scale-in">
          <p className="text-xs uppercase tracking-wider text-[#525252] font-bold">Share via</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTwitterShare}
              className="brutal-btn brutal-btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="brutal-btn brutal-btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="w-full brutal-btn brutal-btn-dark py-3 flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}

      {/* Protect Someone CTA */}
      <div className="brutal-card brutal-card-yellow p-4 brutal-shadow-sm">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#ef4444]" />
          <div className="flex-1">
            <p className="font-bold text-[#0a0a0a]">Protect Someone You Love</p>
            <p className="text-xs text-[#525252]">Share this tool with family to keep them safe</p>
          </div>
          <button
            onClick={() => {
              const protectText = `Hey! I found this tool that helps detect scam messages. You should check it out - it could save you from getting scammed! ${shareUrl}`;
              if (navigator.share) {
                navigator.share({ title: "Scam Shield", text: protectText, url: shareUrl });
              } else {
                navigator.clipboard.writeText(protectText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            }}
            className="brutal-btn brutal-btn-dark px-4 py-2 text-sm"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
