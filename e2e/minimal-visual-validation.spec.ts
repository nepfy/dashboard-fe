import { test, expect } from '../fixtures/auth.fixture';

/**
 * Visual Layout Validation - Minimal Template vs Empty Studio Reference
 * Reference: https://empty-studio.webflow.io/
 * 
 * This test suite validates the visual layout by:
 * 1. Creating a new proposal (generates projectId)
 * 2. Loading the proposal in the editor using projectId
 * 3. Validating layout against Empty Studio reference
 */
test.describe('Minimal Template - Visual Layout Validation', () => {
  
  test('should match Empty Studio layout after proposal generation', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // Step 1: Create a new proposal
    await page.goto('/dashboard');
    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    // Fill in proposal form
    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Aurora Café & Co.');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'Site Institucional');
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', 
      'Desenvolvimento de site institucional moderno e responsivo para cafeteria premium, ' +
      'com foco em identidade visual, experiência do usuário e presença digital.'
    );

    // Select designer service
    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*designer.*|.*design.*/i');

    // Select minimal template
    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    // Submit and wait for generation
    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');
    
    // Step 2: Wait for redirect to editor (URL will have projectId)
    await page.waitForURL(/\/editar\?projectId=.*&templateType=minimal/, { timeout: 60000 });
    
    // Extract projectId from URL
    const currentUrl = page.url();
    const urlParams = new URL(currentUrl);
    const projectId = urlParams.searchParams.get('projectId');
    
    expect(projectId).toBeTruthy();
    console.log('✅ Proposal created with projectId:', projectId);
    
    // Step 3: Validate layout sections
    await page.waitForLoadState('networkidle');
    
    // HERO SECTION VALIDATION
    console.log('\n📋 Validating Hero Section...');
    
    const navbar = page.locator('.navbar, [data-section="navbar"]');
    await expect(navbar).toBeVisible();
    
    const heroTitle = page.locator('.hero-title h1, .intro-title h1');
    await expect(heroTitle).toBeVisible();
    const titleText = await heroTitle.textContent();
    expect(titleText?.length).toBeGreaterThan(20);
    console.log(`  ✓ Hero title: ${titleText?.substring(0, 50)}...`);
    
    const clientDisplay = page.locator('.hero-client, [data-client-display]');
    await expect(clientDisplay).toBeVisible();
    console.log('  ✓ Client display visible');
    
    const separator = page.locator('.hero-separator, hr');
    await expect(separator.first()).toBeVisible();
    console.log('  ✓ Separator line visible');
    
    // ABOUT US SECTION VALIDATION
    console.log('\n📋 Validating About Us Section...');
    await page.locator('[data-section="aboutUs"], .about-section').scrollIntoViewIfNeeded();
    
    const aboutTitle = page.locator('.about-title, .about-section h2');
    await expect(aboutTitle).toBeVisible();
    
    const aboutImages = page.locator('.about-item, [data-about-item]');
    const imageCount = await aboutImages.count();
    expect(imageCount).toBeGreaterThanOrEqual(2);
    console.log(`  ✓ About Us images: ${imageCount}`);
    
    // Check aspect ratios
    const firstBox = await aboutImages.nth(0).boundingBox();
    const secondBox = await aboutImages.nth(1).boundingBox();
    
    if (firstBox && secondBox) {
      const firstRatio = (firstBox.width / firstBox.height).toFixed(2);
      const secondRatio = (secondBox.width / secondBox.height).toFixed(2);
      console.log(`  ✓ First image ratio: ${firstRatio} (should be > 1 for 16:9)`);
      console.log(`  ✓ Second image ratio: ${secondRatio} (should be < 1 for 9:16)`);
    }
    
    // CLIENTS SECTION VALIDATION (CRITICAL)
    console.log('\n📋 Validating Clients Section...');
    await page.locator('[data-section="clients"], .partners-section').scrollIntoViewIfNeeded();
    
    const headerGrid = page.locator('.partners-header-grid, [data-clients-header]');
    await expect(headerGrid).toBeVisible();
    
    const clientsTitle = page.locator('.partners-heading h2, .clients-title');
    await expect(clientsTitle).toBeVisible();
    const titleLength = (await clientsTitle.textContent())?.length || 0;
    console.log(`  ✓ Clients title length: ${titleLength} chars (should be 50+)`);
    expect(titleLength).toBeGreaterThan(50);
    
    const clientsParagraphs = page.locator('.partners-paragraph p, .text-size-medium');
    const paragraphCount = await clientsParagraphs.count();
    console.log(`  ✓ Paragraphs count: ${paragraphCount} (should be 2)`);
    expect(paragraphCount).toBeGreaterThanOrEqual(2);
    
    // Check grid layout
    const gridStyles = await headerGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
      };
    });
    
    expect(gridStyles.display).toBe('grid');
    console.log(`  ✓ Grid template: ${gridStyles.gridTemplateColumns}`);
    
    const clientLogos = page.locator('.partners-logos-item, [data-client-item]');
    const logoCount = await clientLogos.count();
    expect(logoCount).toBe(12);
    console.log(`  ✓ Client logos: ${logoCount}`);
    
    // EXPERTISE SECTION VALIDATION
    console.log('\n📋 Validating Expertise Section...');
    await page.locator('[data-section="expertise"], .expertise-section').scrollIntoViewIfNeeded();
    
    const expertiseItems = page.locator('.expertise-item, [data-expertise-item]');
    const topicCount = await expertiseItems.count();
    expect(topicCount).toBeGreaterThanOrEqual(6);
    console.log(`  ✓ Expertise topics: ${topicCount}`);
    
    // Check first 3 topics have complete descriptions
    for (let i = 0; i < Math.min(3, topicCount); i++) {
      const item = expertiseItems.nth(i);
      const description = item.locator('p, .expertise-description');
      const descText = await description.textContent();
      const descLength = descText?.length || 0;
      
      expect(descLength).toBeGreaterThan(120);
      console.log(`  ✓ Topic ${i + 1} description: ${descLength} chars`);
    }
    
    // TYPOGRAPHY VALIDATION
    console.log('\n📋 Validating Typography...');
    const heroFontSize = await heroTitle.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    
    expect(heroFontSize).toBeGreaterThan(40);
    console.log(`  ✓ Hero font size: ${heroFontSize}px (should be 40px+)`);
    
    console.log('\n✅ All visual validations passed!');
  });
});

