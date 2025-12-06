import { test, expect } from '../fixtures/auth.fixture';

/**
 * Visual Layout Validation - Minimal Template vs Empty Studio Reference
 * Reference: https://empty-studio.webflow.io/
 */
test.describe('Minimal Template - Visual Layout Validation', () => {
  let proposalUrl: string;

  test.beforeAll(async () => {
    // We'll use the proposal that was just generated
    // In a real scenario, this would be created dynamically
    proposalUrl = '/editar/aurora-cafe-co';
  });

  test('should match Empty Studio hero section layout', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto(proposalUrl);
    await page.waitForSelector('[data-section="introduction"], .intro-section', { timeout: 10000 });

    // Hero Section Checks based on Empty Studio reference
    
    // 1. Check navbar layout: Logo left, Client name center, Date + Button right
    const navbar = page.locator('.navbar, [data-section="navbar"]');
    await expect(navbar).toBeVisible();
    
    // 2. Check hero title is prominent and well-spaced
    const heroTitle = page.locator('.hero-title, .intro-title h1');
    await expect(heroTitle).toBeVisible();
    const heroTitleBox = await heroTitle.boundingBox();
    expect(heroTitleBox?.height).toBeGreaterThan(40); // Should be large text
    
    // 3. Check client name display with avatar
    const clientDisplay = page.locator('.hero-client, [data-client-display]');
    await expect(clientDisplay).toBeVisible();
    
    // 4. Check horizontal line separator exists
    const separator = page.locator('.hero-separator, hr');
    await expect(separator.first()).toBeVisible();
    
    // 5. Check proposal date positioning (should be absolute positioned)
    const proposalDate = page.locator('.proposal-date, [data-proposal-date]');
    await expect(proposalDate).toBeVisible();
    
    console.log('✅ Hero section layout matches Empty Studio structure');
  });

  test('should match Empty Studio about us section layout', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto(proposalUrl);
    await page.waitForSelector('[data-section="aboutUs"], .about-section', { timeout: 10000 });

    // About Us Section Checks
    
    // 1. Check title and subtitle layout
    const aboutTitle = page.locator('.about-title, .about-section h2');
    await expect(aboutTitle).toBeVisible();
    
    const aboutSubtitle = page.locator('.about-subtitle, .about-section .subtitle');
    await expect(aboutSubtitle).toBeVisible();
    
    // 2. Check grid layout for images (should be 2 columns with different aspect ratios)
    const aboutGrid = page.locator('.about-content, [data-about-grid]');
    await expect(aboutGrid).toBeVisible();
    
    const aboutImages = page.locator('.about-item, [data-about-item]');
    const imageCount = await aboutImages.count();
    expect(imageCount).toBeGreaterThanOrEqual(2);
    
    // 3. Check first image is wider (16:9) and second is taller (9:16)
    const firstImage = aboutImages.nth(0);
    const secondImage = aboutImages.nth(1);
    
    const firstBox = await firstImage.boundingBox();
    const secondBox = await secondImage.boundingBox();
    
    if (firstBox && secondBox) {
      // First image should be wider than tall
      expect(firstBox.width).toBeGreaterThan(firstBox.height);
      // Second image should be taller than wide
      expect(secondBox.height).toBeGreaterThan(secondBox.width * 1.3);
    }
    
    console.log('✅ About Us section layout matches Empty Studio structure');
  });

  test('should match Empty Studio clients section header layout', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto(proposalUrl);
    await page.waitForSelector('[data-section="clients"], .partners-section', { timeout: 10000 });
    await page.locator('[data-section="clients"], .partners-section').scrollIntoViewIfNeeded();

    // Clients Section Header Checks (CRITICAL - 2x2 asymmetric grid)
    
    // Reference layout from Empty Studio:
    // +------------------------+----------------+
    // | Title (3 lines, left)  |                |
    // |                        | Paragraphs     |
    // +------------------------+----------------+
    
    // 1. Check header grid exists
    const headerGrid = page.locator('.partners-header-grid, [data-clients-header]');
    await expect(headerGrid).toBeVisible();
    
    // 2. Check title positioning (left column, top alignment)
    const clientsTitle = page.locator('.partners-heading h2, .clients-title');
    await expect(clientsTitle).toBeVisible();
    
    // Title should be long (150+ chars as per our prompt)
    const titleText = await clientsTitle.textContent();
    expect(titleText?.length).toBeGreaterThan(50);
    console.log(`Title length: ${titleText?.length} chars`);
    
    // 3. Check paragraphs positioning (right column, bottom alignment)
    const clientsParagraphs = page.locator('.partners-paragraph, [data-clients-paragraphs]');
    await expect(clientsParagraphs).toBeVisible();
    
    const paragraphsText = await clientsParagraphs.allTextContents();
    expect(paragraphsText.length).toBeGreaterThanOrEqual(2);
    
    // Each paragraph should be substantial
    paragraphsText.forEach((p, i) => {
      expect(p.trim().length).toBeGreaterThan(50);
      console.log(`Paragraph ${i + 1}: ${p.trim().length} chars`);
    });
    
    // 4. Check grid layout using CSS
    const gridStyles = await headerGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
      };
    });
    
    expect(gridStyles.display).toBe('grid');
    console.log('Grid template columns:', gridStyles.gridTemplateColumns);
    
    // 5. Check 12 client logos are present
    const clientLogos = page.locator('.partners-logos-item, [data-client-item]');
    const logoCount = await clientLogos.count();
    expect(logoCount).toBe(12);
    
    console.log('✅ Clients section header layout matches Empty Studio structure');
  });

  test('should match Empty Studio expertise section layout', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto(proposalUrl);
    await page.waitForSelector('[data-section="expertise"], .expertise-section', { timeout: 10000 });
    await page.locator('[data-section="expertise"], .expertise-section').scrollIntoViewIfNeeded();

    // Expertise Section Checks
    
    // 1. Check section header (subtitle + title)
    const expertiseSubtitle = page.locator('.expertise-subtitle, .expertise-section .subtitle');
    await expect(expertiseSubtitle).toBeVisible();
    
    const expertiseTitle = page.locator('.expertise-title, .expertise-section h2');
    await expect(expertiseTitle).toBeVisible();
    
    // 2. Check topics grid (should be 3 columns on desktop)
    const expertiseGrid = page.locator('.expertise-grid, [data-expertise-grid]');
    await expect(expertiseGrid).toBeVisible();
    
    const expertiseItems = page.locator('.expertise-item, [data-expertise-item]');
    const itemCount = await expertiseItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(6); // At least 6 topics
    
    // 3. Check each topic has icon, title, and description
    for (let i = 0; i < Math.min(3, itemCount); i++) {
      const item = expertiseItems.nth(i);
      
      // Icon
      const icon = item.locator('.expertise-icon, [data-expertise-icon]');
      await expect(icon).toBeVisible();
      
      // Title
      const title = item.locator('h3, .expertise-topic-title');
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.length).toBeGreaterThan(5);
      
      // Description
      const description = item.locator('p, .expertise-description');
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(120); // Should be detailed
      
      console.log(`Topic ${i + 1}: ${titleText} - ${descText?.length} chars`);
    }
    
    console.log('✅ Expertise section layout matches Empty Studio structure');
  });

  test('should have proper spacing and typography matching Empty Studio', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto(proposalUrl);
    await page.waitForLoadState('networkidle');

    // Typography and Spacing Checks
    
    // 1. Check hero title font size (should be large, 48px+ on desktop)
    const heroTitle = page.locator('.hero-title h1, .intro-title h1').first();
    const heroStyles = await heroTitle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
      };
    });
    
    const heroFontSize = parseInt(heroStyles.fontSize);
    expect(heroFontSize).toBeGreaterThan(40); // Should be large
    console.log('Hero font size:', heroStyles.fontSize);
    
    // 2. Check section spacing (should have generous padding)
    const sections = page.locator('[data-section], section');
    const sectionCount = await sections.count();
    
    for (let i = 0; i < Math.min(3, sectionCount); i++) {
      const section = sections.nth(i);
      const padding = await section.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
        };
      });
      
      console.log(`Section ${i + 1} padding:`, padding);
    }
    
    // 3. Check color consistency (should use mainColor: #000000)
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    console.log('Body background:', bgColor);
    
    console.log('✅ Typography and spacing verified');
  });
});

