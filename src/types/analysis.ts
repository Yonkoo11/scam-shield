export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CONFIRMED_SCAM';

export interface Tactic {
  name: string;
  description: string;
  evidence: string;
}

export interface ScamAnalysis {
  verdict: Verdict;
  confidence: number;
  scamType: string | null;
  tactics: Tactic[];
  redFlags: string[];
  explanation: string;
  recommendedActions: string[];
  similarScamsCount: number;
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
