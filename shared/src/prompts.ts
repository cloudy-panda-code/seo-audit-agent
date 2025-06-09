/**
 * Shared prompt templates for SEO analysis
 */

import { PageInfo } from './types';

export const SEO_ANALYSIS_PROMPT = `
You are an expert SEO analyst. Analyze the following webpage information and provide detailed SEO improvement suggestions.

Page Information:
- URL: {{url}}
- Final URL: {{finalUrl}}
- Title: {{title}}
- Meta Description: {{metaDescription}}
- H1 Tags: {{h1s}}
- H2 Tags: {{h2s}}

Please analyze this page and provide:

1. **SEO Score** (0-100): Overall SEO health of the page
2. **Critical Issues**: List any major SEO problems
3. **Improvement Suggestions**: Specific, actionable recommendations
4. **Content Analysis**: Evaluate title, meta description, and header structure

Focus on:
- Title length (optimal: 50-60 characters)
- Meta description length (optimal: 150-160 characters)
- Header hierarchy and keyword usage
- Content structure and readability
- Missing or duplicate elements

Provide your response in the following JSON format:
{
  "score": number,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "issues": [
    {
      "type": "title|meta|headers|keywords|structure",
      "severity": "low|medium|high", 
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ]
}
`;

export function buildSeoPrompt(pageInfo: PageInfo): string {
  return SEO_ANALYSIS_PROMPT
    .replace('{{url}}', pageInfo.url)
    .replace('{{finalUrl}}', pageInfo.finalUrl)
    .replace('{{title}}', pageInfo.title || 'No title found')
    .replace('{{metaDescription}}', pageInfo.metaDescription || 'No meta description found')
    .replace('{{h1s}}', pageInfo.h1s.length > 0 ? pageInfo.h1s.join(', ') : 'No H1 tags found')
    .replace('{{h2s}}', pageInfo.h2s.length > 0 ? pageInfo.h2s.join(', ') : 'No H2 tags found');
}

export const SYSTEM_PROMPT = `You are an expert SEO consultant with deep knowledge of search engine optimization best practices. 
You analyze web pages and provide actionable, specific recommendations to improve their search engine rankings. 
Always provide practical, implementable suggestions and explain the reasoning behind your recommendations.
Respond only with valid JSON in the specified format.`; 