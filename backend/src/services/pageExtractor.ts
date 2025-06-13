/**
 * Page information extraction service using Playwright
 */

import { chromium, Browser, Page } from 'playwright';
import { PageInfo } from '@seo-audit/shared';

export class PageExtractorService {
  private browser: Browser | null = null;
  private userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];

  /**
   * Get a random user agent
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Add human-like delay
   */
  private async humanDelay(): Promise<void> {
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Initialize browser instance
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images' // Faster loading
        ]
      });
    }
  }

  /**
   * Create a new context with random user agent
   */
  private async createContextWithUserAgent() {
    if (!this.browser) {
      await this.initialize();
    }
    
    return await this.browser!.newContext({
      userAgent: this.getRandomUserAgent(),
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    });
  }

  /**
   * Configure page to avoid bot detection
   */
  private async configurePage(page: Page): Promise<void> {
    // Remove automation indicators
    await page.addInitScript(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Mock chrome property
      Object.defineProperty(navigator, 'chrome', {
        get: () => ({
          runtime: {},
        }),
      });

      // Mock permissions - simplified to avoid TypeScript issues
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = ((parameters: PermissionDescriptor) => {
        if (parameters.name === 'notifications') {
          return Promise.resolve({ state: 'granted' } as any);
        }
        return originalQuery(parameters);
      }) as any;

      // Mock plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Mock languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });
  }

  /**
   * Extract SEO information from a URL
   */
  async extractPageInfo(url: string): Promise<PageInfo> {
    const context = await this.createContextWithUserAgent();
    const page = await context.newPage();
    
    try {
      // Configure page to avoid bot detection
      await this.configurePage(page);

      // Add human-like delay before navigation
      await this.humanDelay();

      // Navigate to the page with extended timeout
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000 // Increased timeout
      });

      if (!response || !response.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
      }

      // Wait for page to be fully loaded with retry mechanism
      try {
        await page.waitForLoadState('networkidle', { timeout: 15000 });
      } catch (timeoutError) {
        console.warn(`Network idle timeout for ${url}, continuing with extraction...`);
        // Continue with extraction even if networkidle times out
      }

      // Add another small delay before extraction
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract page information with error handling
      const pageInfo = await page.evaluate(() => {
        try {
          // Get title
          const title = document.querySelector('title')?.textContent?.trim() || null;
          
          // Get meta description
          const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || null;
          
          // Get all H1 tags
          const h1Elements = Array.from(document.querySelectorAll('h1'));
          const h1s = h1Elements.map((el: Element) => el.textContent?.trim()).filter(Boolean) as string[];
          
          // Get all H2 tags  
          const h2Elements = Array.from(document.querySelectorAll('h2'));
          const h2s = h2Elements.map((el: Element) => el.textContent?.trim()).filter(Boolean) as string[];

          return {
            title,
            metaDescription: metaDesc,
            h1s,
            h2s
          };
        } catch (error) {
          console.error('Error in page evaluation:', error);
          return {
            title: null,
            metaDescription: null,
            h1s: [],
            h2s: []
          };
        }
      });

      const result: PageInfo = {
        url,
        finalUrl: page.url(),
        title: pageInfo.title,
        metaDescription: pageInfo.metaDescription,
        h1s: pageInfo.h1s,
        h2s: pageInfo.h2s,
        extractedAt: new Date()
      };

      return result;

    } catch (error) {
      // Better error messages for common issues
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('timeout')) {
        throw new Error(`Timeout while loading ${url}. The website may be blocking automated requests or is very slow to respond.`);
      } else if (errorMessage.includes('net::ERR_')) {
        throw new Error(`Network error for ${url}: ${errorMessage}`);
      } else if (errorMessage.includes('403') || errorMessage.includes('429')) {
        throw new Error(`Access denied for ${url}. The website is blocking automated requests.`);
      } else {
        throw new Error(`Failed to extract page info from ${url}: ${errorMessage}`);
      }
    } finally {
      await page.close();
      await context.close();
    }
  }

  /**
   * Extract information from multiple URLs with delays between requests
   */
  async extractMultiplePages(urls: string[]): Promise<Array<{ url: string; pageInfo?: PageInfo; error?: string }>> {
    const results = [];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        const pageInfo = await this.extractPageInfo(url);
        results.push({ url, pageInfo });
      } catch (error) {
        results.push({ 
          url, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Add delay between requests to avoid being rate limited
      if (i < urls.length - 1) {
        await this.humanDelay();
      }
    }
    
    return results;
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.close();
  }
}

// Create singleton instance
export const pageExtractor = new PageExtractorService();

// Graceful shutdown
process.on('SIGINT', async () => {
  await pageExtractor.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pageExtractor.destroy();
  process.exit(0);
}); 