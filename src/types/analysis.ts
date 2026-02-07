export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CONFIRMED_SCAM';

export type SophisticationLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPERT';

export interface Tactic {
  name: string;
  description: string;
  evidence: string;
}

export interface PsychologicalTactic {
  principle: string;
  description: string;
  howUsedHere: string;
}

export interface LanguageAnalysis {
  registerShifts: string | null;
  emotionalManipulation: string[];
  urgencyIndicators: string[];
  aiGeneratedSignals: string | null;
}

export interface RiskBreakdown {
  financial: number;
  identity: number;
  emotional: number;
  reputational: number;
}

export interface URLAnalysis {
  url: string;
  suspicious: boolean;
  reasons: string[];
}

export interface ScamAnalysis {
  // Core fields
  verdict: Verdict;
  confidence: number;
  scamType: string | null;
  tactics: Tactic[];
  redFlags: string[];
  explanation: string;
  recommendedActions: string[];
  similarScamsCount: number;

  // Enhanced fields
  sophisticationLevel: SophisticationLevel;
  targetDemographic: string;
  psychologicalTactics: PsychologicalTactic[];
  languageAnalysis: LanguageAnalysis;
  riskBreakdown: RiskBreakdown;
  whatMakesItConvincing: string;
  realWorldExample: string;
  verificationSteps: string[];
  urlsFound: URLAnalysis[];
}

export interface AnalysisRequest {
  content: string;
  type: 'text' | 'image';
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: ScamAnalysis;
  error?: string;
}
