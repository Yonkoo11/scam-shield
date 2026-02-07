"use client";

import { ScamAnalysis } from "@/types/analysis";
import { VerdictBadge } from "./verdict-badge";
import { ShareCard } from "./share-card";
import { WhatYouLearned } from "./what-you-learned";
import { ReportScamButton } from "./community-shield";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle, Target, Flag, Shield, Brain, BarChart3,
  Eye, Link2, CheckCircle, Layers, Zap,
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: ScamAnalysis;
  onReset: () => void;
}

const SOPHISTICATION_CONFIG = {
  LOW: { bars: 1, color: "#22c55e", label: "Low" },
  MEDIUM: { bars: 2, color: "#facc15", label: "Medium" },
  HIGH: { bars: 3, color: "#f97316", label: "High" },
  EXPERT: { bars: 4, color: "#ef4444", label: "Expert" },
} as const;

function RiskBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#525252] dark:text-[#a3a3a3] w-24 shrink-0 uppercase tracking-wider font-medium">{label}</span>
      <div className="flex-1 h-3 bg-[#e5e5e5] dark:bg-[#333] border-2 border-[#0a0a0a] dark:border-[#555] overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold text-[#0a0a0a] dark:text-[#fafafa] w-8 text-right">{value}</span>
    </div>
  );
}

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  const sophistication = SOPHISTICATION_CONFIG[analysis.sophisticationLevel] || SOPHISTICATION_CONFIG.MEDIUM;

  const hasTacticsContent = analysis.tactics.length > 0 || (analysis.psychologicalTactics && analysis.psychologicalTactics.length > 0) || analysis.redFlags.length > 0;
  const hasForensicsContent = (analysis.languageAnalysis && (analysis.languageAnalysis.registerShifts || analysis.languageAnalysis.emotionalManipulation.length > 0 || analysis.languageAnalysis.aiGeneratedSignals)) || (analysis.urlsFound && analysis.urlsFound.length > 0 && analysis.urlsFound.some(u => u.suspicious));
  const hasEvidenceContent = analysis.whatMakesItConvincing || analysis.realWorldExample || (analysis.verificationSteps && analysis.verificationSteps.length > 0) || analysis.similarScamsCount > 0;
  const hasDeepDive = hasTacticsContent || hasForensicsContent || hasEvidenceContent;

  // Count items for tab badges
  const tacticsCount = analysis.tactics.length + (analysis.psychologicalTactics?.length || 0) + analysis.redFlags.length;
  const forensicsCount = (analysis.languageAnalysis?.emotionalManipulation?.length || 0) + (analysis.languageAnalysis?.urgencyIndicators?.length || 0) + (analysis.urlsFound?.filter(u => u.suspicious)?.length || 0);
  const evidenceCount = (analysis.verificationSteps?.length || 0) + (analysis.whatMakesItConvincing ? 1 : 0) + (analysis.realWorldExample ? 1 : 0);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ============================================
          ZONE 1: VERDICT + ACTION
          What users need in 3 seconds
          ============================================ */}

      {/* Verdict */}
      <VerdictBadge verdict={analysis.verdict} confidence={analysis.confidence} />

      {/* TAKE ACTION - moved to top priority position */}
      {analysis.recommendedActions.length > 0 && (
        <div className="brutal-card p-4 relative brutal-shadow-sm border-4 border-[#22c55e]">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-green">
            <Zap className="w-3 h-3" />
            TAKE ACTION
          </div>
          <ul className="space-y-2 mt-2">
            {analysis.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#22c55e] font-bold mt-0.5 text-lg">→</span>
                <span className="text-[#0a0a0a] dark:text-[#fafafa] font-bold">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scam Type + Sophistication */}
      {analysis.scamType && (
        <div className="brutal-card p-4 relative brutal-shadow-sm">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-orange">
            <Target className="w-3 h-3" />
            TYPE
          </div>
          <p className="font-display text-2xl text-[#0a0a0a] dark:text-[#fafafa] mt-2">{analysis.scamType}</p>
          {analysis.sophisticationLevel && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#525252] dark:text-[#a3a3a3]" />
                <span className="text-xs uppercase tracking-wider text-[#525252] dark:text-[#a3a3a3] font-medium">Sophistication:</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="w-5 h-3 border-2 border-[#0a0a0a] dark:border-[#555]"
                    style={{
                      backgroundColor: bar <= sophistication.bars ? sophistication.color : "transparent",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: sophistication.color }}>
                {sophistication.label}
              </span>
            </div>
          )}
          {analysis.targetDemographic && analysis.targetDemographic !== "N/A" && (
            <p className="text-xs text-[#525252] dark:text-[#a3a3a3] mt-2">
              <span className="font-bold">Targets:</span> {analysis.targetDemographic}
            </p>
          )}
        </div>
      )}

      {/* Risk Breakdown */}
      {analysis.riskBreakdown && (analysis.riskBreakdown.financial > 0 || analysis.riskBreakdown.identity > 0) && (
        <div className="brutal-card p-4 relative brutal-shadow-sm">
          <div className="absolute -top-3 left-4 brutal-label brutal-label-red">
            <BarChart3 className="w-3 h-3" />
            RISK
          </div>
          <div className="space-y-2.5 mt-2">
            <RiskBar label="Financial" value={analysis.riskBreakdown.financial} color="#ef4444" />
            <RiskBar label="Identity" value={analysis.riskBreakdown.identity} color="#f97316" />
            <RiskBar label="Emotional" value={analysis.riskBreakdown.emotional} color="#a855f7" />
            <RiskBar label="Reputation" value={analysis.riskBreakdown.reputational} color="#3b82f6" />
          </div>
        </div>
      )}

      {/* ============================================
          ZONE 2: DEEP DIVE (Tabbed)
          Expert details for curious users
          ============================================ */}

      {hasDeepDive && analysis.verdict !== "SAFE" && (
        <div>
          <div className="brutal-divider mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#525252] dark:text-[#a3a3a3] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#facc15]" />
            Deep Dive
          </p>

          <Tabs defaultValue="tactics">
            <TabsList>
              {hasTacticsContent && (
                <TabsTrigger value="tactics">
                  Tactics
                  {tacticsCount > 0 && <span className="bg-[#0a0a0a] text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold">{tacticsCount}</span>}
                </TabsTrigger>
              )}
              {hasForensicsContent && (
                <TabsTrigger value="forensics">
                  Forensics
                  {forensicsCount > 0 && <span className="bg-[#0a0a0a] text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold">{forensicsCount}</span>}
                </TabsTrigger>
              )}
              {hasEvidenceContent && (
                <TabsTrigger value="evidence">
                  Evidence
                  {evidenceCount > 0 && <span className="bg-[#0a0a0a] text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold">{evidenceCount}</span>}
                </TabsTrigger>
              )}
            </TabsList>

            {/* TACTICS TAB */}
            {hasTacticsContent && (
              <TabsContent value="tactics">
                {/* Explanation */}
                <div className="brutal-card p-4 relative brutal-shadow-sm">
                  <div className="absolute -top-3 left-4 brutal-label brutal-label-black">
                    <Shield className="w-3 h-3" />
                    ANALYSIS
                  </div>
                  <p className="text-[#525252] dark:text-[#a3a3a3] leading-relaxed mt-2">{analysis.explanation}</p>
                </div>

                {/* Tactics */}
                {analysis.tactics.length > 0 && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm">
                    <div className="absolute -top-3 left-4 brutal-label brutal-label-yellow">
                      <AlertTriangle className="w-3 h-3" />
                      TACTICS FOUND
                    </div>
                    <div className="space-y-4 mt-2">
                      {analysis.tactics.map((tactic, i) => (
                        <div key={i} className="border-l-4 border-[#facc15] pl-4">
                          <p className="font-bold text-[#0a0a0a] dark:text-[#fafafa]">{tactic.name}</p>
                          <p className="text-sm text-[#525252] dark:text-[#a3a3a3] mb-2">{tactic.description}</p>
                          <p className="text-sm bg-[#f5f5f5] dark:bg-[#1a1a1a] p-2 text-[#525252] dark:text-[#a3a3a3] italic border-2 border-[#e5e5e5] dark:border-[#333]">&quot;{tactic.evidence}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Psychological Tactics */}
                {analysis.psychologicalTactics && analysis.psychologicalTactics.length > 0 && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm">
                    <div className="absolute -top-3 left-4 brutal-label" style={{ backgroundColor: "#f97316", color: "white", border: "2px solid #0a0a0a" }}>
                      <Brain className="w-3 h-3" />
                      PSYCHOLOGY
                    </div>
                    <div className="space-y-3 mt-2">
                      {analysis.psychologicalTactics.map((pt, i) => (
                        <div key={i} className="border-l-4 border-[#f97316] pl-4">
                          <p className="font-bold text-[#0a0a0a] dark:text-[#fafafa] text-sm">{pt.principle}</p>
                          <p className="text-xs text-[#525252] dark:text-[#a3a3a3] mb-1">{pt.description}</p>
                          <p className="text-sm text-[#f97316] font-medium">{pt.howUsedHere}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {analysis.redFlags.length > 0 && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm">
                    <div className="absolute -top-3 left-4 brutal-label brutal-label-red">
                      <Flag className="w-3 h-3" />
                      RED FLAGS
                    </div>
                    <ul className="space-y-2 mt-2">
                      {analysis.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-[#ef4444] mt-2 flex-shrink-0" />
                          <span className="text-[#525252] dark:text-[#a3a3a3]">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            )}

            {/* FORENSICS TAB */}
            {hasForensicsContent && (
              <TabsContent value="forensics">
                {/* Language Forensics */}
                {analysis.languageAnalysis && (
                  analysis.languageAnalysis.registerShifts ||
                  analysis.languageAnalysis.emotionalManipulation.length > 0 ||
                  analysis.languageAnalysis.aiGeneratedSignals
                ) && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm">
                    <div className="absolute -top-3 left-4 brutal-label brutal-label-black">
                      <Eye className="w-3 h-3" />
                      LANGUAGE FORENSICS
                    </div>
                    <div className="space-y-3 mt-2">
                      {analysis.languageAnalysis.registerShifts && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#525252] dark:text-[#a3a3a3] font-bold mb-1">Register Shifts</p>
                          <p className="text-sm text-[#0a0a0a] dark:text-[#fafafa]">{analysis.languageAnalysis.registerShifts}</p>
                        </div>
                      )}
                      {analysis.languageAnalysis.emotionalManipulation.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#525252] dark:text-[#a3a3a3] font-bold mb-1">Emotional Trigger Words</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.languageAnalysis.emotionalManipulation.map((word, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 font-medium">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.languageAnalysis.urgencyIndicators.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#525252] dark:text-[#a3a3a3] font-bold mb-1">Urgency Indicators</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.languageAnalysis.urgencyIndicators.map((word, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs bg-[#facc15]/10 text-[#a16207] dark:text-[#facc15] border border-[#facc15]/30 font-medium">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.languageAnalysis.aiGeneratedSignals && (
                        <div className="p-3 bg-[#a855f7]/10 border-2 border-[#a855f7]/30">
                          <p className="text-xs uppercase tracking-wider text-[#a855f7] font-bold mb-1">AI-Generated Signals</p>
                          <p className="text-sm text-[#0a0a0a] dark:text-[#fafafa]">{analysis.languageAnalysis.aiGeneratedSignals}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suspicious URLs */}
                {analysis.urlsFound && analysis.urlsFound.length > 0 && analysis.urlsFound.some(u => u.suspicious) && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm border-4 border-[#ef4444]">
                    <div className="absolute -top-3 left-4 brutal-label brutal-label-red">
                      <Link2 className="w-3 h-3" />
                      SUSPICIOUS URLS
                    </div>
                    <div className="space-y-3 mt-2">
                      {analysis.urlsFound.filter(u => u.suspicious).map((urlInfo, i) => (
                        <div key={i} className="p-3 bg-[#ef4444]/5 border-2 border-[#ef4444]/20">
                          <p className="font-mono text-sm text-[#ef4444] break-all mb-2">{urlInfo.url}</p>
                          <ul className="space-y-1">
                            {urlInfo.reasons.map((reason, j) => (
                              <li key={j} className="text-xs text-[#525252] dark:text-[#a3a3a3] flex items-start gap-1">
                                <span className="text-[#ef4444] mt-0.5">!</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )}

            {/* EVIDENCE TAB */}
            {hasEvidenceContent && (
              <TabsContent value="evidence">
                {/* Why It Works + Real World Example */}
                {(analysis.whatMakesItConvincing || analysis.realWorldExample) && (
                  <div className="brutal-card brutal-card-dark p-4 relative brutal-shadow-sm border-4 border-[#525252]">
                    {analysis.whatMakesItConvincing && (
                      <div className="mb-3">
                        <p className="text-xs uppercase tracking-wider text-[#facc15] font-bold mb-2 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Why People Fall For This
                        </p>
                        <p className="text-sm text-white/80">{analysis.whatMakesItConvincing}</p>
                      </div>
                    )}
                    {analysis.realWorldExample && (
                      <div className={analysis.whatMakesItConvincing ? "pt-3 border-t border-white/10" : ""}>
                        <p className="text-xs uppercase tracking-wider text-[#facc15] font-bold mb-2">Real-World Data</p>
                        <p className="text-sm text-white/80">{analysis.realWorldExample}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Verify It Yourself */}
                {analysis.verificationSteps && analysis.verificationSteps.length > 0 && (
                  <div className="brutal-card p-4 relative brutal-shadow-sm">
                    <div className="absolute -top-3 left-4 brutal-label brutal-label-green">
                      <CheckCircle className="w-3 h-3" />
                      VERIFY IT YOURSELF
                    </div>
                    <ol className="space-y-2 mt-2">
                      {analysis.verificationSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-[#22c55e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-[#0a0a0a] dark:text-[#fafafa]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Similar Scams */}
                {analysis.similarScamsCount > 0 && (
                  <div className="brutal-card brutal-card-dark p-4 border-4 border-[#facc15] text-center">
                    <p className="text-sm text-white">
                      This matches patterns from <span className="font-display text-2xl text-[#facc15]">{analysis.similarScamsCount.toLocaleString()}</span> similar reported scams.
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}

      {/* ============================================
          ZONE 3: LEARN + SHARE
          Educational gamification and social actions
          ============================================ */}

      {/* What You Learned - only for scams */}
      {analysis.scamType && analysis.verdict !== "SAFE" && (
        <>
          <div className="brutal-divider" />
          <WhatYouLearned
            scamType={analysis.scamType}
            tactics={analysis.tactics.map(t => t.name)}
            redFlags={analysis.redFlags}
          />
        </>
      )}

      {/* Bottom actions - compact */}
      <div className="space-y-3">
        {analysis.verdict !== "SAFE" && (
          <ReportScamButton onReport={() => {}} />
        )}

        <ShareCard analysis={analysis} />

        <button
          onClick={onReset}
          className="w-full brutal-btn brutal-btn-dark py-4 flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Scan Another Message
        </button>
      </div>
    </div>
  );
}
