"use client";

import { useState, useEffect } from "react";
import { Shield, TrendingUp, Users, Zap } from "lucide-react";

export function LiveCounter() {
  const [scamsDetected, setScamsDetected] = useState(47382);
  const [peopleProtected, setPeopleProtected] = useState(128493);
  const [activeNow, setActiveNow] = useState(342);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Random increment for scams detected (1-3 every few seconds)
      if (Math.random() > 0.6) {
        setScamsDetected(prev => prev + Math.floor(Math.random() * 3) + 1);
      }

      // Random increment for people protected
      if (Math.random() > 0.7) {
        setPeopleProtected(prev => prev + Math.floor(Math.random() * 5) + 1);
      }

      // Fluctuate active users
      setActiveNow(prev => {
        const change = Math.floor(Math.random() * 10) - 4;
        return Math.max(280, Math.min(450, prev + change));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="brutal-card brutal-card-dark p-4 brutal-shadow-lg mb-8 relative overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#facc15]/10 via-transparent to-[#ef4444]/10 animate-pulse" />

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]"></span>
        </span>
        <span className="text-xs text-[#22c55e] font-bold uppercase tracking-wider">Live</span>
      </div>

      <div className="relative grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#ef4444]">
            <Shield className="w-4 h-4" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#facc15] tabular-nums">
            {scamsDetected.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/60">Scams Caught Today</p>
        </div>

        <div className="space-y-1 border-x border-white/10">
          <div className="flex items-center justify-center gap-1 text-[#22c55e]">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#facc15] tabular-nums">
            {peopleProtected.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/60">People Protected</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#facc15]">
            <Zap className="w-4 h-4" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#facc15] tabular-nums">
            {activeNow.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/60">Scanning Now</p>
        </div>
      </div>

      {/* Recent activity ticker */}
      <div className="mt-4 pt-3 border-t border-white/10 overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-white/60 animate-pulse">
          <TrendingUp className="w-3 h-3 text-[#22c55e]" />
          <span>+127% increase in IRS scams this week</span>
        </div>
      </div>
    </div>
  );
}
