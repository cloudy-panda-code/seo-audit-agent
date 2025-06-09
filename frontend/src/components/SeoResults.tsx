'use client';

import { SeoAuditResult, SeoIssue } from '@seo-audit/shared';

interface SeoResultsProps {
  results: SeoAuditResult[];
}

export function SeoResults({ results }: SeoResultsProps) {
  const getSeverityColor = (severity: SeoIssue['severity']) => {
    switch (severity) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-success';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
        <p className="text-gray-600 mt-2">
          Analyzed {results.length} {results.length === 1 ? 'URL' : 'URLs'}
        </p>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <div key={index} className="card p-6">
            {/* URL Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {result.pageInfo.title || 'No Title'}
                </h3>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {result.pageInfo.finalUrl}
                </p>
              </div>
              <div className={`ml-4 px-4 py-2 rounded-lg ${getScoreBgColor(result.analysis.score)}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.analysis.score)}`}>
                    {result.analysis.score}
                  </div>
                  <div className="text-xs text-gray-600">SEO Score</div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {result.error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-danger-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-danger-800">Analysis Error</h4>
                    <p className="text-sm text-danger-700 mt-1">{result.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Page Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Page Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Title:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {result.pageInfo.title || 'No title found'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Meta Description:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {result.pageInfo.metaDescription || 'No meta description found'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">H1 Tags:</span>
                    <div className="mt-1">
                      {result.pageInfo.h1s.length > 0 ? (
                        <ul className="text-sm text-gray-900 space-y-1">
                          {result.pageInfo.h1s.map((h1, h1Index) => (
                            <li key={h1Index} className="truncate">• {h1}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No H1 tags found</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">H2 Tags:</span>
                    <div className="mt-1">
                      {result.pageInfo.h2s.length > 0 ? (
                        <ul className="text-sm text-gray-900 space-y-1">
                          {result.pageInfo.h2s.slice(0, 5).map((h2, h2Index) => (
                            <li key={h2Index} className="truncate">• {h2}</li>
                          ))}
                          {result.pageInfo.h2s.length > 5 && (
                            <li className="text-sm text-gray-500">... and {result.pageInfo.h2s.length - 5} more</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No H2 tags found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">AI Suggestions</h4>
                <div className="space-y-2">
                  {result.analysis.suggestions.length > 0 ? (
                    result.analysis.suggestions.map((suggestion, suggestionIndex) => (
                      <div key={suggestionIndex} className="flex items-start">
                        <svg className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No suggestions available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Issues */}
            {result.analysis.issues.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Issues Found</h4>
                <div className="space-y-3">
                  {result.analysis.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {issue.type} Issue
                        </span>
                        <span className={`badge ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{issue.message}</p>
                      <p className="text-sm text-primary-600 font-medium">
                        💡 {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 