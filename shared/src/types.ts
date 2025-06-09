/**
 * Shared types for SEO Audit Agent
 */

// Core page information extracted from URLs
export interface PageInfo {
  url: string;
  finalUrl: string;
  title: string | null;
  metaDescription: string | null;
  h1s: string[];
  h2s: string[];
  extractedAt: Date;
}

// SEO analysis result from GPT-4
export interface SeoAnalysis {
  url: string;
  suggestions: string[];
  score: number; // 0-100
  issues: SeoIssue[];
  analyzedAt: Date;
}

// Individual SEO issues
export interface SeoIssue {
  type: 'title' | 'meta' | 'headers' | 'keywords' | 'structure';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

// Combined result for each URL
export interface SeoAuditResult {
  pageInfo: PageInfo;
  analysis: SeoAnalysis;
  error?: string;
}

// Request/Response types for API
export interface AnalyzeRequest {
  urls: string[];
}

export interface AnalyzeResponse {
  results: SeoAuditResult[];
  totalProcessed: number;
  errors: string[];
}

// Status types for real-time updates
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface AnalysisProgress {
  url: string;
  status: AnalysisStatus;
  progress: number; // 0-100
  message?: string;
} 