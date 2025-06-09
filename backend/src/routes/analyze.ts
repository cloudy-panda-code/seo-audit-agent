/**
 * Analysis API routes
 */

import { Router, Request, Response } from 'express';
import { AnalyzeRequest, AnalyzeResponse, SeoAuditResult } from '@seo-audit/shared';
import { pageExtractor } from '../services/pageExtractor';
import { seoAnalyzer } from '../services/seoAnalyzer';

const router = Router();

/**
 * POST /analyze
 * Analyze one or more URLs for SEO
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { urls }: AnalyzeRequest = req.body;

    // Validation
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        error: 'URLs array is required and must not be empty',
        results: [],
        totalProcessed: 0,
        errors: ['Invalid request: URLs array is required']
      });
    }

    // Validate URL format
    const validUrls: string[] = [];
    const errors: string[] = [];

    for (const url of urls) {
      if (typeof url !== 'string' || !url.trim()) {
        errors.push(`Invalid URL: "${url}"`);
        continue;
      }

      const trimmedUrl = url.trim();
      
      // Add protocol if missing
      const fullUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
      
      try {
        new URL(fullUrl);
        validUrls.push(fullUrl);
      } catch {
        errors.push(`Invalid URL format: "${url}"`);
      }
    }

    if (validUrls.length === 0) {
      return res.status(400).json({
        error: 'No valid URLs provided',
        results: [],
        totalProcessed: 0,
        errors
      });
    }

    // Limit the number of URLs to prevent abuse
    const maxUrls = 10;
    if (validUrls.length > maxUrls) {
      return res.status(400).json({
        error: `Too many URLs. Maximum ${maxUrls} URLs allowed per request`,
        results: [],
        totalProcessed: 0,
        errors: [`Request exceeded maximum of ${maxUrls} URLs`]
      });
    }

    console.log(`Starting analysis for ${validUrls.length} URLs`);

    // Extract page information
    const extractionResults = await pageExtractor.extractMultiplePages(validUrls);
    
    // Analyze pages with extracted information
    const results: SeoAuditResult[] = [];
    
    for (const result of extractionResults) {
      if (result.pageInfo) {
        try {
          const analysis = await seoAnalyzer.analyzePage(result.pageInfo);
          results.push({
            pageInfo: result.pageInfo,
            analysis
          });
        } catch (error) {
          results.push({
            pageInfo: result.pageInfo,
            analysis: {
              url: result.url,
              suggestions: [],
              score: 0,
              issues: [],
              analyzedAt: new Date()
            },
            error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      } else {
        // Page extraction failed
        results.push({
          pageInfo: {
            url: result.url,
            finalUrl: result.url,
            title: null,
            metaDescription: null,
            h1s: [],
            h2s: [],
            extractedAt: new Date()
          },
          analysis: {
            url: result.url,
            suggestions: [],
            score: 0,
            issues: [],
            analyzedAt: new Date()
          },
          error: result.error || 'Failed to extract page information'
        });
      }
    }

    const response: AnalyzeResponse = {
      results,
      totalProcessed: results.length,
      errors: errors.concat(results.filter(r => r.error).map(r => r.error!))
    };

    console.log(`Analysis completed for ${results.length} URLs`);
    
    res.json(response);

  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    
    const response: AnalyzeResponse = {
      results: [],
      totalProcessed: 0,
      errors: [`Server error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
    
    res.status(500).json(response);
  }
});

/**
 * GET /analyze/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'seo-audit-backend'
  });
});

export default router; 