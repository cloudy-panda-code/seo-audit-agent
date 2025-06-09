'use client';

import { useState } from 'react';
import { SeoAuditResult, AnalyzeRequest, AnalyzeResponse } from '@seo-audit/shared';
import { apiClient } from '@/lib/api';

interface SeoAnalysisFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (results: SeoAuditResult[]) => void;
  onAnalysisError: (error: string) => void;
  isLoading: boolean;
}

export function SeoAnalysisForm({
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
  isLoading
}: SeoAnalysisFormProps) {
  const [urlsText, setUrlsText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlsText.trim()) {
      onAnalysisError('Please enter at least one URL');
      return;
    }

    // Parse URLs from textarea (newline-separated)
    const urls = urlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      onAnalysisError('Please enter at least one valid URL');
      return;
    }

    if (urls.length > 10) {
      onAnalysisError('Maximum 10 URLs allowed per analysis');
      return;
    }

    try {
      onAnalysisStart();
      
      const request: AnalyzeRequest = { urls };
      const response = await apiClient.post<AnalyzeResponse>('/api/analyze', request);
      
      if (response.data.results.length > 0) {
        onAnalysisComplete(response.data.results);
      } else {
        onAnalysisError('No results returned. Please check your URLs and try again.');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors?.length) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      onAnalysisError(errorMessage);
    }
  };

  const handleClear = () => {
    setUrlsText('');
  };

  const placeholderText = `Enter URLs to analyze (one per line):

https://example.com
https://example.com/about
https://example.com/products

Maximum 10 URLs per analysis.`;

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
            URLs to Analyze
          </label>
          <textarea
            id="urls"
            rows={8}
            className="textarea"
            placeholder={placeholderText}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            disabled={isLoading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter one URL per line. We'll analyze up to 10 URLs at once.
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleClear}
            className="btn-outline"
            disabled={isLoading || !urlsText.trim()}
          >
            Clear
          </button>
          
          <button
            type="submit"
            className="btn-primary px-8"
            disabled={isLoading || !urlsText.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 