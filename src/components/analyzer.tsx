"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisResults } from "./analysis-results";
import { VerdictReveal } from "./verdict-reveal";
import { ScamAnalysis } from "@/types/analysis";
import { Shield, Search, Loader2, Sparkles } from "lucide-react";

// Real viral scam examples that judges will recognize
const DEMO_EXAMPLES = [
  {
    label: "Hi Mom Scam",
    emoji: "👋",
    text: `Hi Mom, it's me. I dropped my phone in the toilet and this is my new number. Can you save it?

I'm in a bit of trouble and need help urgently. I need to pay a bill but my bank app won't work on this new phone yet.

Can you transfer $800 to my friend who's helping me out? I'll pay you back tomorrow I promise.

The account details are:
Name: Sarah Johnson
BSB: 062-000
Account: 1234 5678

Please hurry, the bill is due in 2 hours or I'll get a late fee. Love you!`
  },
  {
    label: "Fake Amazon",
    emoji: "📦",
    text: `From: Amazon Customer Service <billing@amaz0n-support.com>
Subject: Your Order #112-4938271-8827364 - Action Required

Dear Valued Customer,

Your Amazon Prime account has been charged $499.99 for:
- iPhone 15 Pro Max (256GB) - Qty: 1

If you did NOT authorize this purchase, call immediately to cancel:
☎️ 1-888-555-0147 (Amazon Fraud Department)

You have 24 hours to dispute this charge or it will be processed.

To verify your identity, please have ready:
- Full name and address
- Credit card number (for verification only)
- Social Security Number

Amazon Customer Protection Team
REF: AMZ-FRAUD-99821`
  },
  {
    label: "Bank Alert",
    emoji: "🏦",
    text: `[Wells Fargo Security Alert]

We detected unusual activity on your account ending in **4829.

A wire transfer of $2,847.00 was attempted from your account to an international recipient.

If you did NOT authorize this transaction, reply STOP to block it immediately or call our Fraud Hotline:

📞 1-800-555-0192

You must verify within 30 minutes or the transfer will complete.

Click here to secure your account:
http://wellsfarg0-secure.com/verify?id=38291

Wells Fargo Fraud Prevention Team
Case #WF-2024-938271`
  },
  {
    label: "Crypto Scam",
    emoji: "🪙",
    text: `🚀 EXCLUSIVE CRYPTO OPPORTUNITY - DON'T MISS OUT! 🚀

Hey! I'm a senior analyst at BlockTrade Capital. Our AI trading bot has been generating 300-500% returns MONTHLY for our private group.

We're opening 50 spots for new members this week only.

Here's how it works:
1. Deposit minimum 0.5 ETH to our smart contract
2. Our bot trades automatically 24/7
3. Withdraw profits anytime (guaranteed minimum 10% daily returns)

Current results from our members:
- @CryptoKing2024: Turned $2K into $84K in 3 weeks
- @MoonShot_Lisa: $500 → $31K in 12 days
- @DiamondHands_99: Quit his job after 1 month

Smart contract address: 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38

Join our exclusive Telegram: t.me/blocktrade_vip

⚠️ Only 12 spots remaining! Price goes up at midnight!

This is NOT financial advice but seriously, you'd be crazy to miss this.`
  },
  {
    label: "IRS Threat",
    emoji: "🏛️",
    text: `URGENT: FINAL NOTICE FROM IRS

Taxpayer ID: [REDACTED]
Amount Due: $4,832.67
Status: WARRANT PENDING

This is your FINAL NOTICE. The Internal Revenue Service has calculated your outstanding tax liability. Failure to pay immediately will result in:

• Arrest warrant issued in your name
• Wage garnishment
• Asset seizure
• Criminal prosecution

To avoid legal action, call IRS Collections immediately:
☎️ 1-800-555-0199

Payment accepted via:
- Wire transfer
- Apple/Google gift cards
- Bitcoin

This matter requires IMMEDIATE attention. Local law enforcement has been notified.

IRS Criminal Investigation Division
Badge #IRS-4827`
  },
];

export function Analyzer() {
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [scanProgress, setScanProgress] = useState(0);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setImageData({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setScanProgress(0);

    // Animate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const isImage = activeTab === "image";
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: isImage ? imageData?.base64 : text,
          type: isImage ? "image" : "text",
          mimeType: isImage ? imageData?.mimeType : undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      clearInterval(progressInterval);
      setScanProgress(100);

      // Store analysis and trigger dramatic reveal
      setAnalysis(data.analysis);
      setIsAnalyzing(false);
      setShowReveal(true);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setScanProgress(0);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setShowReveal(false);
    setShowResults(false);
    setText("");
    setImageData(null);
    setImageName("");
    setError(null);
  };

  const handleRevealComplete = () => {
    setShowReveal(false);
    setShowResults(true);
  };

  const canAnalyze =
    (activeTab === "text" && text.trim().length > 10) ||
    (activeTab === "image" && imageData !== null);

  // Full-screen dramatic verdict reveal
  if (showReveal && analysis) {
    return (
      <VerdictReveal
        verdict={analysis.verdict}
        confidence={analysis.confidence}
        onRevealComplete={handleRevealComplete}
      />
    );
  }

  // Show detailed results after reveal
  if (showResults && analysis) {
    return <AnalysisResults analysis={analysis} onReset={handleReset} />;
  }

  // Scanning state - enhanced with layered design
  if (isAnalyzing) {
    return (
      <div className="brutal-card p-8 brutal-shadow-lg relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#facc15]/10 to-transparent" />
        <div className="absolute inset-0 grid-pattern opacity-50" />

        <div className="relative flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <Shield className="w-24 h-24 text-[#0a0a0a] dark:text-[#fafafa] animate-pulse" strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-12 h-12 text-[#facc15]" />
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-[-8px] border-4 border-dashed border-[#facc15] rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-display text-4xl text-[#0a0a0a] dark:text-[#fafafa] tracking-wide">SCANNING</h3>
            <p className="text-sm text-[#525252] dark:text-[#a3a3a3] uppercase tracking-widest font-medium">
              {scanProgress < 30 && "Analyzing patterns..."}
              {scanProgress >= 30 && scanProgress < 60 && "Checking threat database..."}
              {scanProgress >= 60 && scanProgress < 90 && "Detecting manipulation tactics..."}
              {scanProgress >= 90 && "Generating threat report..."}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <div className="h-4 bg-[#e5e5e5] dark:bg-[#333] border-4 border-[#0a0a0a] dark:border-[#555] brutal-shadow-sm overflow-hidden">
              <div
                className="h-full bg-[#facc15] transition-[width] duration-300 ease-out relative"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-[#0a0a0a] dark:text-[#fafafa] text-center mt-3 font-display text-xl">{Math.round(scanProgress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Card - Enhanced with layered depth */}
      <div className="brutal-card p-6 relative brutal-shadow animate-scale-in">
        {/* Corner accent */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#facc15] border-4 border-[#0a0a0a] dark:border-[#facc15]" />

        {/* Floating label */}
        <div className="absolute -top-4 left-4 brutal-label brutal-label-yellow brutal-shadow-sm">
          <Sparkles className="w-3 h-3" />
          PASTE HERE
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`brutal-btn px-4 py-2 text-sm ${
              activeTab === "text"
                ? "brutal-btn-dark"
                : "brutal-btn-secondary"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`brutal-btn px-4 py-2 text-sm ${
              activeTab === "image"
                ? "brutal-btn-dark"
                : "brutal-btn-secondary"
            }`}
          >
            Screenshot
          </button>
        </div>

        {activeTab === "text" ? (
          <Textarea
            placeholder="PASTE THE SUSPICIOUS MESSAGE HERE..."
            className="brutal-input min-h-[160px] resize-none text-[#0a0a0a] dark:text-[#fafafa] placeholder:text-[#525252] dark:placeholder:text-[#666] placeholder:font-medium"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full min-h-[160px] border-4 border-dashed border-[#0a0a0a] dark:border-[#333] cursor-pointer hover:bg-[#facc15]/20 transition-colors duration-200 brutal-card"
          >
            {imageData ? (
              <div className="text-center p-4">
                <div className="text-5xl mb-2">✓</div>
                <p className="font-bold text-[#0a0a0a] dark:text-[#fafafa]">{imageName}</p>
                <p className="text-sm text-[#525252] dark:text-[#a3a3a3]">Click to change</p>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="text-5xl mb-2 grayscale">📷</div>
                <p className="font-bold text-[#0a0a0a] dark:text-[#fafafa]">Upload Screenshot</p>
                <p className="text-sm text-[#525252] dark:text-[#a3a3a3]">
                  Drag & drop or click to upload
                </p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {/* CTA Button - Enhanced with layered shadow */}
      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || isAnalyzing}
        className="w-full py-5 px-8 brutal-btn brutal-btn-primary brutal-shadow-lg font-display text-2xl tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            SCANNING...
          </>
        ) : (
          <>
            <Search className="w-6 h-6 group-hover:animate-pulse" />
            SCAN FOR SCAMS
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="brutal-card brutal-card-dark p-4 border-4 border-[#ef4444] animate-shake">
          <p className="font-bold text-[#ef4444]">{error}</p>
        </div>
      )}

      {/* Example buttons - Enhanced grid */}
      <div className="space-y-4">
        <div className="brutal-divider" />
        <p className="text-xs uppercase tracking-widest text-[#525252] dark:text-[#a3a3a3] font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-[#facc15]" />
          Try a real scam example
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_EXAMPLES.map((example, i) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setActiveTab("text");
                setText(example.text);
              }}
              className={`brutal-btn brutal-btn-secondary p-3 text-left hover-tilt animate-scale-in stagger-${i + 1}`}
            >
              <span className="text-xl mr-2">{example.emoji}</span>
              <span className="font-bold text-sm">{example.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
