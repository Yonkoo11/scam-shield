"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

interface ScamTrend {
  name: string;
  change: number; // percentage change
  reports: string;
  severity: "critical" | "high" | "medium";
}

const TRENDS: ScamTrend[] = [
  { name: "IRS/Tax Scams", change: 127, reports: "45K", severity: "critical" },
  { name: "Hi Mom/Dad Texts", change: 89, reports: "32K", severity: "critical" },
  { name: "Fake Amazon Orders", change: 45, reports: "28K", severity: "high" },
  { name: "Bank Alert Phishing", change: 23, reports: "21K", severity: "high" },
  { name: "Crypto/Rug Pulls", change: 203, reports: "38K", severity: "critical" },
];

export function ScamTrends() {
  return (
    <div className="brutal-card p-4 brutal-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="brutal-label brutal-label-red">
          <AlertTriangle className="w-3 h-3" />
          TRENDING SCAMS
        </div>
        <span className="text-[10px] text-[#525252] uppercase tracking-wider">This Week</span>
      </div>

      <div className="space-y-3">
        {TRENDS.map((trend, i) => (
          <div
            key={trend.name}
            className="flex items-center gap-3 p-2 hover:bg-[#f5f5f5] transition-colors"
          >
            <span className="font-display text-lg text-[#525252] w-6">{i + 1}</span>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#0a0a0a] truncate">{trend.name}</p>
              <p className="text-[10px] text-[#525252]">{trend.reports} reports</p>
            </div>

            <div
              className={`flex items-center gap-1 text-xs font-bold ${
                trend.change > 0
                  ? "text-[#ef4444]"
                  : trend.change < 0
                  ? "text-[#22c55e]"
                  : "text-[#525252]"
              }`}
            >
              {trend.change > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.change < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {Math.abs(trend.change)}%
            </div>

            <div
              className={`w-2 h-2 rounded-full ${
                trend.severity === "critical"
                  ? "bg-[#ef4444]"
                  : trend.severity === "high"
                  ? "bg-[#f97316]"
                  : "bg-[#facc15]"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-[#0a0a0a]/10">
        <p className="text-[10px] text-[#525252] text-center">
          Data from FTC Consumer Sentinel Network
        </p>
      </div>
    </div>
  );
}
