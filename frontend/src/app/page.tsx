'use client';

import { useState } from 'react';
import { SeoAnalysisForm } from '@/components/SeoAnalysisForm';
import { SeoResults } from '@/components/SeoResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SeoAuditResult } from '@seo-audit/shared';

export default function HomePage() {
  const [results, setResults] = useState<SeoAuditResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (newResults: SeoAuditResult[]) => {
    setResults(newResults);
    setIsLoading(false);
    setError(null);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">SEO Audit</span>
            <span className="block text-primary-600">Agent</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Analyze your website's SEO performance with AI-powered insights. 
            Get detailed recommendations to improve your search engine rankings.
          </p>
        </div>

        {/* Analysis Form */}
        <div className="max-w-4xl mx-auto">
          <SeoAnalysisForm
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
            isLoading={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingSpinner message="Analyzing your URLs..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !isLoading && (
          <div className="max-w-6xl mx-auto">
            <SeoResults results={results} />
          </div>
        )}

        {/* Features Section */}
        {results.length === 0 && !isLoading && !error && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                What We Analyze
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Title & Meta Tags</h3>
                  <p className="text-gray-600">Analyze page titles and meta descriptions for optimal length and relevance.</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Header Structure</h3>
                  <p className="text-gray-600">Check H1 and H2 tags for proper hierarchy and keyword optimization.</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                  <p className="text-gray-600">Get intelligent suggestions powered by GPT-4 to improve your SEO.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 