import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Test user fixture that handles authentication
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/sign-in');
    
    // Wait for Clerk to load
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
    
    // Fill in credentials (test user should be created in Clerk Dashboard)
    await page.fill('input[name="identifier"]', process.env.TEST_USER_EMAIL || 'teste.e2e@nepfy.com');
    await page.click('button[type="submit"]');
    
    // Wait for password field
    await page.waitForSelector('input[name="password"]', { timeout: 10000 });
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    await use(page);
  },
});

export { expect };

