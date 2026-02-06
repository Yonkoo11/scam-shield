"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";

const FLAG_PATTERNS: { name: string; color: string; pattern: RegExp }[] = [
  { name: "Urgency", color: "#ef4444", pattern: /\b(urgent|immediately|now|hurry|fast|quick|asap|limited time|act now|expires?)\b/gi },
  { name: "Threat", color: "#f97316", pattern: /\b(will be|suspend|close|arrest|terminat|block|frozen|locked|cancel|legal action|warrant)\b/gi },
  { name: "Authority", color: "#8b5cf6", pattern: /\b(IRS|FBI|police|bank|amazon|apple|microsoft|paypal|government|federal|SSA|customs)\b/gi },
  { name: "Money", color: "#facc15", pattern: /\b(pay|send|transfer|wire|gift\s*card|bitcoin|crypto|fee|charge|refund|\$\d+)\b/gi },
  { name: "Pressure", color: "#ec4899", pattern: /\b(don't tell|secret|only you|special|chosen|selected|winner|congratulations|click here|verify)\b/gi },
];

export function GeminiDemo() {
  const [text, setText] = useState("URGENT: Your bank account will be suspended! Pay $500 in gift cards immediately to avoid arrest.");

  const detectedFlags = useMemo(() => {
    const found: { name: string; color: string; matches: string[] }[] = [];
    for (const fp of FLAG_PATTERNS) {
      const matches = text.match(fp.pattern);
      if (matches) {
        found.push({ name: fp.name, color: fp.color, matches: Array.from(new Set(matches)) });
      }
    }
    return found;
  }, [text]);

  const totalFlags = detectedFlags.reduce((sum, f) => sum + f.matches.length, 0);

  return (
    <div className="brutal-card p-5 brutal-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#4285F4]" />
        <span className="font-display text-lg tracking-wider">TRY IT YOURSELF</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 200))}
        maxLength={200}
        className="w-full h-24 p-3 bg-[#f5f5f5] border-2 border-[#0a0a0a] text-sm font-body resize-none focus:bg-[#facc15]/20 focus:outline-none transition-colors"
        placeholder="Type a suspicious message..."
      />
      <p className="text-[10px] text-[#525252] text-right mt-1">{text.length}/200</p>

      {/* Results */}
      {totalFlags > 0 ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#ef4444]">
            <AlertTriangle className="w-4 h-4" />
            {totalFlags} red flag{totalFlags !== 1 ? "s" : ""} detected
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedFlags.map((flag) => (
              <div key={flag.name} className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold border-2 border-[#0a0a0a]" style={{ backgroundColor: flag.color + "20", borderColor: flag.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: flag.color }} />
                {flag.name}: {flag.matches.join(", ")}
              </div>
            ))}
          </div>
        </div>
      ) : text.length > 0 ? (
        <div className="mt-3 text-sm text-[#22c55e] font-bold">No red flags detected</div>
      ) : null}
    </div>
  );
}
