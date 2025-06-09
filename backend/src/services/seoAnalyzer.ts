/**
 * SEO Analysis service using OpenAI GPT-4
 */

import OpenAI from 'openai';
import { PageInfo, SeoAnalysis, SeoIssue, buildSeoPrompt, SYSTEM_PROMPT } from '@seo-audit/shared';
import { config } from '../config/env';

export class SeoAnalyzerService {
  private openai: OpenAI;

  constructor() {
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  /**
   * Analyze page info and get SEO suggestions from GPT-4
   */
  async analyzePage(pageInfo: PageInfo): Promise<SeoAnalysis> {
    try {
      const prompt = buildSeoPrompt(pageInfo);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(content);
      
      // Validate response structure
      if (!this.isValidSeoResponse(parsedResponse)) {
        throw new Error('Invalid response format from OpenAI');
      }

      const analysis: SeoAnalysis = {
        url: pageInfo.url,
        suggestions: parsedResponse.suggestions || [],
        score: Math.max(0, Math.min(100, parsedResponse.score || 0)),
        issues: parsedResponse.issues || [],
        analyzedAt: new Date()
      };

      return analysis;

    } catch (error) {
      console.error(`Error analyzing page ${pageInfo.url}:`, error);
      
      // Return fallback analysis
      return this.createFallbackAnalysis(pageInfo, error);
    }
  }

  /**
   * Analyze multiple pages
   */
  async analyzeMultiplePages(pageInfos: PageInfo[]): Promise<Array<{ url: string; analysis?: SeoAnalysis; error?: string }>> {
    const results = [];
    
    for (const pageInfo of pageInfos) {
      try {
        const analysis = await this.analyzePage(pageInfo);
        results.push({ url: pageInfo.url, analysis });
      } catch (error) {
        results.push({ 
          url: pageInfo.url, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  /**
   * Validate the structure of the OpenAI response
   */
  private isValidSeoResponse(response: any): boolean {
    return (
      typeof response === 'object' &&
      typeof response.score === 'number' &&
      Array.isArray(response.suggestions) &&
      Array.isArray(response.issues) &&
      response.issues.every((issue: any) => 
        typeof issue.type === 'string' &&
        typeof issue.severity === 'string' &&
        typeof issue.message === 'string' &&
        typeof issue.suggestion === 'string'
      )
    );
  }

  /**
   * Create a fallback analysis when OpenAI fails
   */
  private createFallbackAnalysis(pageInfo: PageInfo, error: any): SeoAnalysis {
    const issues: SeoIssue[] = [];
    let score = 50; // Default middle score

    // Basic title analysis
    if (!pageInfo.title) {
      issues.push({
        type: 'title',
        severity: 'high',
        message: 'Page is missing a title tag',
        suggestion: 'Add a descriptive title tag between 50-60 characters'
      });
      score -= 20;
    } else if (pageInfo.title.length > 60) {
      issues.push({
        type: 'title',
        severity: 'medium',
        message: 'Title tag is too long',
        suggestion: 'Shorten title to 50-60 characters for better search results'
      });
      score -= 10;
    } else if (pageInfo.title.length < 30) {
      issues.push({
        type: 'title',
        severity: 'medium',
        message: 'Title tag is too short',
        suggestion: 'Expand title to be more descriptive (30-60 characters)'
      });
      score -= 5;
    }

    // Basic meta description analysis
    if (!pageInfo.metaDescription) {
      issues.push({
        type: 'meta',
        severity: 'high',
        message: 'Page is missing a meta description',
        suggestion: 'Add a compelling meta description between 150-160 characters'
      });
      score -= 15;
    } else if (pageInfo.metaDescription.length > 160) {
      issues.push({
        type: 'meta',
        severity: 'medium',
        message: 'Meta description is too long',
        suggestion: 'Shorten meta description to 150-160 characters'
      });
      score -= 5;
    }

    // Basic header analysis
    if (pageInfo.h1s.length === 0) {
      issues.push({
        type: 'headers',
        severity: 'high',
        message: 'Page is missing H1 tags',
        suggestion: 'Add at least one H1 tag to clearly define the page topic'
      });
      score -= 15;
    } else if (pageInfo.h1s.length > 1) {
      issues.push({
        type: 'headers',
        severity: 'medium',
        message: 'Multiple H1 tags found',
        suggestion: 'Use only one H1 tag per page for better SEO'
      });
      score -= 5;
    }

    const suggestions = [
      'Ensure your page has a unique, descriptive title',
      'Add a compelling meta description',
      'Use proper header hierarchy (H1, H2, H3)',
      'Include relevant keywords naturally in your content'
    ];

    return {
      url: pageInfo.url,
      suggestions,
      score: Math.max(0, score),
      issues,
      analyzedAt: new Date()
    };
  }
}

// Create singleton instance
export const seoAnalyzer = new SeoAnalyzerService(); 