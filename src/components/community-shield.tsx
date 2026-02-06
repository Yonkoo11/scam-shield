"use client";

import { useState, useEffect } from "react";
import { Shield, Clock, MapPin, Flag, CheckCircle, TrendingUp } from "lucide-react";

interface ReportedScam {
  id: string;
  type: string;
  location: string;
  timeAgo: string;
  excerpt: string;
}

// Simulated community reports (in production, this would be from a database)
const MOCK_REPORTS: ReportedScam[] = [
  { id: "1", type: "IRS Scam", location: "Texas, USA", timeAgo: "2m ago", excerpt: "Threatening arrest for unpaid taxes..." },
  { id: "2", type: "Hi Mom Scam", location: "Sydney, AU", timeAgo: "5m ago", excerpt: "New phone, need money urgently..." },
  { id: "3", type: "Amazon Fraud", location: "London, UK", timeAgo: "8m ago", excerpt: "Unauthorized $499 charge..." },
  { id: "4", type: "Bank Alert", location: "Toronto, CA", timeAgo: "12m ago", excerpt: "Suspicious wire transfer detected..." },
  { id: "5", type: "Crypto Scam", location: "Berlin, DE", timeAgo: "15m ago", excerpt: "Guaranteed 500% returns..." },
];

export function CommunityShield() {
  const [reports] = useState(MOCK_REPORTS);
  const [totalReports, setTotalReports] = useState(847293);
  const [peopleProtected, setPeopleProtected] = useState(2847123);

  useEffect(() => {
    // Simulate new reports coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTotalReports(prev => prev + 1);
        setPeopleProtected(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="brutal-card brutal-card-dark p-4 brutal-shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#facc15]" />
          <span className="font-display text-xl text-white">COMMUNITY SHIELD</span>
          <span className="ml-auto relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]"></span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-display text-3xl text-[#facc15] tabular-nums">
              {totalReports.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">Scams Reported</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[#22c55e] tabular-nums">
              {peopleProtected.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">People Protected</p>
          </div>
        </div>

        <p className="text-xs text-white/60 text-center mt-4 border-t border-white/10 pt-3">
          Every report helps protect someone else from the same scam
        </p>
      </div>

      {/* Live Feed */}
      <div className="brutal-card p-4 brutal-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="brutal-label brutal-label-yellow">
            <TrendingUp className="w-3 h-3" />
            LIVE REPORTS
          </div>
          <span className="text-[10px] text-[#525252] dark:text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
            Real-time
          </span>
        </div>

        <div className="space-y-3">
          {reports.map((report, i) => (
            <div
              key={report.id}
              className={`flex items-start gap-3 p-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border-l-4 ${
                i === 0 ? "border-[#ef4444] animate-pulse" : "border-[#facc15]"
              }`}
            >
              <Flag className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0a0a0a] dark:text-[#fafafa]">{report.type}</span>
                  {i === 0 && (
                    <span className="text-[10px] bg-[#ef4444] text-white px-1.5 py-0.5 font-bold uppercase">New</span>
                  )}
                </div>
                <p className="text-xs text-[#525252] dark:text-[#a3a3a3] truncate">{report.excerpt}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#525252] dark:text-[#a3a3a3]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.timeAgo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="brutal-card brutal-card-yellow p-4">
        <p className="font-bold text-[#0a0a0a] dark:text-[#0a0a0a] mb-2">How Community Shield Works</p>
        <ol className="text-sm text-[#525252] dark:text-[#0a0a0a]/70 space-y-1">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0a0a0a] dark:text-[#0a0a0a]">1.</span>
            You scan a suspicious message
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0a0a0a]">2.</span>
            If it&apos;s a scam, you can report it anonymously
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0a0a0a]">3.</span>
            Your report helps protect others worldwide
          </li>
        </ol>
      </div>
    </div>
  );
}

// Report button component to use in results
export function ReportScamButton({ onReport }: { onReport: () => void }) {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    setReported(true);
    onReport();
  };

  if (reported) {
    return (
      <div className="brutal-card brutal-card-dark p-4 flex items-center gap-3 animate-scale-in">
        <CheckCircle className="w-6 h-6 text-[#22c55e]" />
        <div>
          <p className="font-bold text-white">Thanks for reporting!</p>
          <p className="text-xs text-white/60">You just helped protect others from this scam</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleReport}
      className="w-full brutal-btn brutal-btn-secondary py-3 flex items-center justify-center gap-2"
    >
      <Flag className="w-4 h-4" />
      Report to Community Shield
    </button>
  );
}
