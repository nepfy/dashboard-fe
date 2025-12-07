import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Test user fixture that handles authentication
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    console.log("🔐 Starting authentication...");

    // Try direct access to dashboard using storageState
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" }).catch(() => {});
    if (page.url().match(/\/(dashboard|app|gerar-proposta)/)) {
      console.log("  ✓ Session restored, already signed in");
      await use(page);
      return;
    }

    // Fall back to login
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    console.log("  ✓ Navigated to /login");

    const emailSelector =
      'input[type="email"], input[name*="email"], input[id*="email"], input[placeholder*="email"]';
    const passwordSelector =
      'input[type="password"], input[name*="password"], input[id*="password"], input[placeholder*="senha"]';
    const loginButtonSelector = 'button[type="submit"], button:has-text("Acessar conta")';

    // Wait for login form or detect redirect
    try {
      await page.waitForSelector(
        `${emailSelector}, ${passwordSelector}, ${loginButtonSelector}`,
        { timeout: 8000 }
      );
    } catch {
      if (page.url().match(/\/(dashboard|app|gerar-proposta)/)) {
        console.log("  ✓ Redirected automatically");
        await use(page);
        return;
      }
      throw new Error("Login form not found");
    }

    // Fill credentials
    const emailInput = page.locator(emailSelector).first();
    await emailInput.fill(process.env.TEST_USER_EMAIL || "teste.e2e@nepfy.com");
    console.log(
      `  ✓ Filled email: ${process.env.TEST_USER_EMAIL || "teste.e2e@nepfy.com"}`
    );

    const passwordInput = page.locator(passwordSelector).first();
    await passwordInput.fill(
      process.env.TEST_USER_PASSWORD || "TestPassword123!"
    );
    console.log("  ✓ Filled password");

    // Click login (ensure enabled)
    const loginButton = page.locator(loginButtonSelector).first();
    await loginButton.waitFor({ state: "visible", timeout: 8000 });
    for (let i = 0; i < 10; i++) {
      const disabled = await loginButton.isDisabled().catch(() => false);
      if (!disabled) break;
      await page.waitForTimeout(150);
    }
    await loginButton.click({ force: true, timeout: 8000 });
    console.log("  ✓ Clicked login button");

    const waitForResult = async (timeoutMs: number) =>
      Promise.race([
        page.waitForURL(/\/(dashboard|app|gerar-proposta)/, {
          timeout: timeoutMs,
          waitUntil: "domcontentloaded",
        }).then(() => "redirect").catch(() => null),
        page.waitForSelector('text=/Email ou senha incorretos/i', {
          timeout: timeoutMs,
        }).then(() => "error").catch(() => null),
      ]);

    let loginResult = await waitForResult(20000);

    // If still on /login, force navigate to dashboard once (session may be set)
    if (!loginResult && page.url().includes("/login")) {
      console.log("  ⚠️ No redirect yet, navigating to /dashboard...");
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" }).catch(() => {});
      if (page.url().match(/\/(dashboard|app|gerar-proposta)/)) {
        loginResult = "redirect";
      }
    }

    if (!loginResult && page.url().includes("/login")) {
      console.log("  ⚠️ Still on /login, clicking login once more...");
      await loginButton.click({ force: true, timeout: 8000 }).catch(() => {});
      loginResult = await waitForResult(15000);
    }

    if (loginResult === "error") {
      throw new Error("Login failed: Email ou senha incorretos");
    }
    if (loginResult !== "redirect") {
      throw new Error("Login failed or did not redirect in time");
    }
    console.log("  ✓ Redirected after login");

    await use(page);
  },
});

export { expect };

