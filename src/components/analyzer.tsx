"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisResults } from "./analysis-results";
import { VerdictReveal } from "./verdict-reveal";
import { ScamAnalysis } from "@/types/analysis";
import { Shield, Search, Loader2 } from "lucide-react";

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

  // Scanning state
  if (isAnalyzing) {
    return (
      <div className="border-4 border-[#0a0a0a] bg-white p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <Shield className="w-20 h-20 text-[#0a0a0a]" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-10 h-10 text-[#facc15] animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-display text-3xl text-[#0a0a0a]">SCANNING</h3>
            <p className="text-sm text-[#525252] uppercase tracking-wide">
              {scanProgress < 30 && "Analyzing patterns..."}
              {scanProgress >= 30 && scanProgress < 60 && "Checking databases..."}
              {scanProgress >= 60 && scanProgress < 90 && "Detecting tactics..."}
              {scanProgress >= 90 && "Generating report..."}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="h-3 bg-[#e5e5e5] border-2 border-[#0a0a0a]">
              <div
                className="h-full bg-[#facc15] transition-[width] duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#525252] text-center mt-2 font-bold">{Math.round(scanProgress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="border-4 border-[#0a0a0a] p-6 bg-white relative">
        <div className="absolute -top-4 left-4 bg-[#facc15] text-[#0a0a0a] font-display text-lg px-3 py-0.5 tracking-widest">
          PASTE HERE
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 mt-2">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 border-2 border-[#0a0a0a] font-bold text-sm uppercase transition-[background-color,color] duration-150 ${
              activeTab === "text"
                ? "bg-[#0a0a0a] text-white"
                : "bg-white text-[#0a0a0a] hover:bg-[#f5f5f5]"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2 border-2 border-[#0a0a0a] font-bold text-sm uppercase transition-[background-color,color] duration-150 ${
              activeTab === "image"
                ? "bg-[#0a0a0a] text-white"
                : "bg-white text-[#0a0a0a] hover:bg-[#f5f5f5]"
            }`}
          >
            Screenshot
          </button>
        </div>

        {activeTab === "text" ? (
          <Textarea
            placeholder="PASTE THE SUSPICIOUS MESSAGE HERE..."
            className="min-h-[140px] resize-none border-2 border-[#0a0a0a] bg-[#f5f5f5] text-[#0a0a0a] placeholder:text-[#525252] placeholder:font-medium focus:bg-[#facc15] focus:border-[#0a0a0a] focus:ring-0 font-medium"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-[#0a0a0a] cursor-pointer hover:bg-[#f5f5f5] transition-[background-color] duration-150"
          >
            {imageData ? (
              <div className="text-center p-4">
                <div className="text-4xl mb-2">✓</div>
                <p className="font-bold text-[#0a0a0a]">{imageName}</p>
                <p className="text-sm text-[#525252]">Click to change</p>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="text-4xl mb-2 opacity-50">📷</div>
                <p className="font-bold text-[#0a0a0a]">Upload Screenshot</p>
                <p className="text-sm text-[#525252]">
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

      {/* CTA Button */}
      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || isAnalyzing}
        className="w-full py-5 px-8 bg-[#ef4444] text-white border-4 border-[#0a0a0a] font-display text-2xl tracking-widest brutal-shadow transition-[transform,box-shadow] duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_#0a0a0a] flex items-center justify-center gap-3"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            SCANNING...
          </>
        ) : (
          <>
            <Search className="w-6 h-6" />
            SCAN FOR SCAMS
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-[#ef4444] text-white border-4 border-[#0a0a0a] font-bold">
          {error}
        </div>
      )}

      {/* Example buttons */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#525252] font-bold">
          Try a real scam example:
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setActiveTab("text");
                setText(example.text);
              }}
              className="px-3 py-2 border-2 border-[#0a0a0a] bg-white font-bold text-sm hover:bg-[#facc15] transition-[background-color] duration-150"
            >
              <span className="mr-1">{example.emoji}</span>
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
