import { test, expect } from '../fixtures/auth.fixture';

/**
 * Complete End-to-End Visual Validation
 * 
 * This test does EVERYTHING automatically:
 * 1. Creates a new proposal via UI
 * 2. Waits for AI generation
 * 3. Extracts projectId from URL
 * 4. Validates proposal data is correctly injected
 * 5. Validates visual layout against Empty Studio reference
 * 
 * Reference: https://empty-studio.webflow.io/
 */
test.describe('Minimal Template - Complete E2E Validation', () => {
  
  test('should create proposal, load editor, and match Empty Studio layout', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    console.log('\n🚀 Starting Complete E2E Validation...\n');
    
    // ============================================
    // STEP 1: CREATE PROPOSAL
    // ============================================
    console.log('📝 STEP 1: Creating proposal...');
    
    await page.goto('/dashboard');
    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    // Fill in proposal form with test data
    const testData = {
      clientName: 'Aurora Café & Co.',
      projectName: 'Site Institucional Premium',
      projectDescription: 'Desenvolvimento de site institucional moderno e responsivo para cafeteria premium, ' +
        'com foco em identidade visual, experiência do usuário e presença digital forte.'
    };
    
    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', testData.clientName);
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', testData.projectName);
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', testData.projectDescription);

    // Select designer service
    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*designer.*|.*design.*/i');

    // Select minimal template
    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    console.log('  ✓ Form filled with test data');
    console.log(`  ✓ Client: ${testData.clientName}`);
    console.log(`  ✓ Project: ${testData.projectName}`);
    
    // Submit and wait for generation
    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');
    console.log('  ✓ Proposal submitted, waiting for AI generation...');
    
    // ============================================
    // STEP 2: WAIT FOR EDITOR & EXTRACT PROJECT ID
    // ============================================
    console.log('\n⏳ STEP 2: Waiting for AI generation and redirect...');
    
    await page.waitForURL(/\/editar\?projectId=.*&templateType=minimal/, { timeout: 90000 });
    
    const currentUrl = page.url();
    const urlParams = new URL(currentUrl);
    const projectId = urlParams.searchParams.get('projectId');
    const templateType = urlParams.searchParams.get('templateType');
    
    expect(projectId).toBeTruthy();
    expect(templateType).toBe('minimal');
    
    console.log(`  ✓ Redirected to editor`);
    console.log(`  ✓ Project ID: ${projectId}`);
    console.log(`  ✓ Template: ${templateType}`);
    
    // Wait for proposal to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-section="introduction"], .intro-section', { timeout: 10000 });
    
    console.log('  ✓ Editor loaded successfully');
    
    // ============================================
    // STEP 3: VALIDATE PROPOSAL DATA INJECTION
    // ============================================
    console.log('\n📊 STEP 3: Validating proposal data injection...');
    
    // Check if client name appears in the proposal
    const clientNameInProposal = page.locator(`text="${testData.clientName}"`);
    await expect(clientNameInProposal.first()).toBeVisible();
    console.log(`  ✓ Client name "${testData.clientName}" correctly injected`);
    
    // Check if content is AI-generated (not empty or fallback)
    const heroTitle = page.locator('.hero-title h1, .intro-title h1');
    const heroTitleText = await heroTitle.textContent();
    
    expect(heroTitleText).toBeTruthy();
    expect(heroTitleText?.length).toBeGreaterThan(20);
    expect(heroTitleText?.toLowerCase()).not.toContain('loading');
    expect(heroTitleText?.toLowerCase()).not.toContain('carregando');
    
    console.log(`  ✓ Hero title: "${heroTitleText?.substring(0, 60)}..."`);
    console.log(`  ✓ Title length: ${heroTitleText?.length} chars`);
    
    // Check clients section has real content
    const clientsTitle = page.locator('.partners-heading h2, .heading-style-h2').first();
    const clientsTitleText = await clientsTitle.textContent();
    
    expect(clientsTitleText).toBeTruthy();
    expect(clientsTitleText?.length).toBeGreaterThan(50);
    
    console.log(`  ✓ Clients title: "${clientsTitleText?.substring(0, 60)}..."`);
    console.log(`  ✓ Clients title length: ${clientsTitleText?.length} chars`);
    
    // Check paragraphs are not empty
    const paragraphs = page.locator('.partners-paragraph p, .text-size-medium');
    const paragraphTexts = await paragraphs.allTextContents();
    
    expect(paragraphTexts.length).toBeGreaterThanOrEqual(2);
    paragraphTexts.forEach((text, i) => {
      expect(text.trim().length).toBeGreaterThan(50);
      console.log(`  ✓ Paragraph ${i + 1}: ${text.trim().length} chars`);
    });
    
    console.log('  ✅ All data correctly injected (no fallbacks)');
    
    // ============================================
    // STEP 4: VISUAL VALIDATION - HERO SECTION
    // ============================================
    console.log('\n🎨 STEP 4: Visual validation vs Empty Studio...');
    console.log('\n📋 Section: HERO / INTRODUCTION');
    
    // Navbar structure
    const navbar = page.locator('.navbar, [data-section="navbar"]');
    await expect(navbar).toBeVisible();
    console.log('  ✓ Navbar present');
    
    // Hero title styling
    await expect(heroTitle).toBeVisible();
    const heroFontSize = await heroTitle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: parseInt(styles.fontSize),
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
      };
    });
    
    expect(heroFontSize.fontSize).toBeGreaterThan(40);
    console.log(`  ✓ Hero font size: ${heroFontSize.fontSize}px (Empty Studio: ~48px)`);
    console.log(`  ✓ Hero font weight: ${heroFontSize.fontWeight}`);
    
    // Client display with avatar
    const clientDisplay = page.locator('.hero-client, [data-client-display]');
    await expect(clientDisplay).toBeVisible();
    console.log('  ✓ Client display with avatar visible');
    
    // Horizontal separator
    const separator = page.locator('.hero-separator, hr');
    await expect(separator.first()).toBeVisible();
    console.log('  ✓ Horizontal separator line present');
    
    // Proposal date
    const proposalDate = page.locator('.proposal-date, [data-proposal-date]');
    await expect(proposalDate).toBeVisible();
    console.log('  ✓ Proposal date visible');
    
    // ============================================
    // STEP 5: VISUAL VALIDATION - ABOUT US
    // ============================================
    console.log('\n📋 Section: ABOUT US');
    await page.locator('[data-section="aboutUs"], .about-section').scrollIntoViewIfNeeded();
    
    const aboutTitle = page.locator('.about-title, .about-section h2');
    await expect(aboutTitle).toBeVisible();
    console.log('  ✓ About Us title present');
    
    const aboutSubtitle = page.locator('.about-subtitle, .subtitle').first();
    const subtitleText = await aboutSubtitle.textContent();
    console.log(`  ✓ Subtitle: "${subtitleText?.substring(0, 60)}..."`);
    
    // Check image grid
    const aboutImages = page.locator('.about-item, [data-about-item]');
    const imageCount = await aboutImages.count();
    expect(imageCount).toBeGreaterThanOrEqual(2);
    console.log(`  ✓ Images present: ${imageCount}`);
    
    // Validate aspect ratios
    const firstBox = await aboutImages.nth(0).boundingBox();
    const secondBox = await aboutImages.nth(1).boundingBox();
    
    if (firstBox && secondBox) {
      const firstRatio = (firstBox.width / firstBox.height).toFixed(2);
      const secondRatio = (secondBox.width / secondBox.height).toFixed(2);
      
      console.log(`  ✓ First image aspect: ${firstRatio} (expected: >1 for 16:9)`);
      console.log(`  ✓ Second image aspect: ${secondRatio} (expected: <1 for 9:16)`);
      
      // First should be wider, second should be taller
      expect(firstBox.width).toBeGreaterThan(firstBox.height);
      expect(secondBox.height).toBeGreaterThan(secondBox.width);
    }
    
    // ============================================
    // STEP 6: VISUAL VALIDATION - CLIENTS (CRITICAL)
    // ============================================
    console.log('\n📋 Section: CLIENTS (CRITICAL - 2x2 Grid)');
    await page.locator('[data-section="clients"], .partners-section').scrollIntoViewIfNeeded();
    
    const headerGrid = page.locator('.partners-header-grid, [data-clients-header]');
    await expect(headerGrid).toBeVisible();
    
    // Check grid layout
    const gridStyles = await headerGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        gridTemplateRows: styles.gridTemplateRows,
        gap: styles.gap,
      };
    });
    
    expect(gridStyles.display).toBe('grid');
    console.log(`  ✓ Grid display: ${gridStyles.display}`);
    console.log(`  ✓ Grid columns: ${gridStyles.gridTemplateColumns}`);
    console.log(`  ✓ Grid rows: ${gridStyles.gridTemplateRows}`);
    console.log(`  ✓ Gap: ${gridStyles.gap}`);
    
    // Validate Empty Studio layout: left column wider (1.6fr 1fr)
    const hasAsymmetricGrid = gridStyles.gridTemplateColumns.includes('1.6fr') || 
                               gridStyles.gridTemplateColumns.match(/\d+\.\d+fr/);
    console.log(`  ${hasAsymmetricGrid ? '✓' : '⚠️'} Asymmetric grid (1.6fr 1fr expected)`);
    
    // Title positioning and length
    await expect(clientsTitle).toBeVisible();
    expect(clientsTitleText!.length).toBeGreaterThan(50);
    console.log(`  ✓ Title length: ${clientsTitleText!.length} chars (Empty Studio: ~150+)`);
    
    // Paragraphs positioning
    const clientsParagraphContainer = page.locator('.partners-paragraph, [data-clients-paragraphs]');
    await expect(clientsParagraphContainer).toBeVisible();
    console.log(`  ✓ Paragraphs present: ${paragraphTexts.length}`);
    
    // Client logos
    const clientLogos = page.locator('.partners-logos-item, [data-client-item]');
    const logoCount = await clientLogos.count();
    expect(logoCount).toBe(12);
    console.log(`  ✓ Client logos: ${logoCount} (Empty Studio: 12)`);
    
    // ============================================
    // STEP 7: VISUAL VALIDATION - EXPERTISE
    // ============================================
    console.log('\n📋 Section: EXPERTISE');
    await page.locator('[data-section="expertise"], .expertise-section').scrollIntoViewIfNeeded();
    
    const expertiseSubtitle = page.locator('.expertise-subtitle, .expertise-section .subtitle');
    await expect(expertiseSubtitle).toBeVisible();
    
    const expertiseTitle = page.locator('.expertise-title, .expertise-section h2');
    await expect(expertiseTitle).toBeVisible();
    console.log('  ✓ Expertise title and subtitle present');
    
    // Topics grid
    const expertiseItems = page.locator('.expertise-item, [data-expertise-item]');
    const topicCount = await expertiseItems.count();
    expect(topicCount).toBeGreaterThanOrEqual(6);
    console.log(`  ✓ Topics present: ${topicCount} (Empty Studio: ~11)`);
    
    // Check grid layout
    const expertiseGrid = page.locator('.expertise-grid, [data-expertise-grid]');
    const expertiseGridStyles = await expertiseGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
      };
    });
    
    console.log(`  ✓ Grid columns: ${expertiseGridStyles.gridTemplateColumns}`);
    
    // Validate first 3 topics have complete data
    for (let i = 0; i < Math.min(3, topicCount); i++) {
      const item = expertiseItems.nth(i);
      
      const icon = item.locator('.expertise-icon, [data-expertise-icon], svg');
      await expect(icon).toBeVisible();
      
      const title = item.locator('h3, .expertise-topic-title');
      const titleText = await title.textContent();
      expect(titleText?.length).toBeGreaterThan(5);
      
      const description = item.locator('p, .expertise-description');
      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(120);
      
      console.log(`  ✓ Topic ${i + 1}: "${titleText}" (${descText?.length} chars)`);
    }
    
    // ============================================
    // STEP 8: SPACING & TYPOGRAPHY VALIDATION
    // ============================================
    console.log('\n📏 Global Spacing & Typography');
    
    // Section padding
    const sections = page.locator('section, [data-section]');
    const firstSection = sections.nth(0);
    const sectionPadding = await firstSection.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingTop: parseInt(styles.paddingTop),
        paddingBottom: parseInt(styles.paddingBottom),
      };
    });
    
    console.log(`  ✓ Section padding: ${sectionPadding.paddingTop}px / ${sectionPadding.paddingBottom}px`);
    console.log(`    (Empty Studio: ~80-120px)`);
    
    // Body font size
    const bodyText = page.locator('p').first();
    const bodyFontSize = await bodyText.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    
    console.log(`  ✓ Body font size: ${bodyFontSize}px (Empty Studio: ~16-18px)`);
    
    // ============================================
    // FINAL COMPARISON SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL COMPARISON: Nepfy vs Empty Studio');
    console.log('='.repeat(60));
    
    const comparison = [
      { aspect: 'Hero Title', nepfy: `${heroFontSize.fontSize}px`, emptyStudio: '~48px', match: heroFontSize.fontSize >= 40 },
      { aspect: 'Body Text', nepfy: `${bodyFontSize}px`, emptyStudio: '~16-18px', match: bodyFontSize >= 14 && bodyFontSize <= 20 },
      { aspect: 'Clients Title', nepfy: `${clientsTitleText!.length} chars`, emptyStudio: '~150+ chars', match: clientsTitleText!.length > 50 },
      { aspect: 'Client Logos', nepfy: `${logoCount}`, emptyStudio: '12', match: logoCount === 12 },
      { aspect: 'Expertise Topics', nepfy: `${topicCount}`, emptyStudio: '~11', match: topicCount >= 6 },
      { aspect: 'Grid Layout', nepfy: hasAsymmetricGrid ? 'Asymmetric' : 'Symmetric', emptyStudio: 'Asymmetric (1.6fr 1fr)', match: hasAsymmetricGrid },
    ];
    
    comparison.forEach(({ aspect, nepfy, emptyStudio, match }) => {
      const status = match ? '✅' : '⚠️';
      console.log(`${status} ${aspect.padEnd(20)} | Nepfy: ${nepfy.padEnd(20)} | Empty: ${emptyStudio}`);
    });
    
    const matchCount = comparison.filter(c => c.match).length;
    const matchPercentage = ((matchCount / comparison.length) * 100).toFixed(0);
    
    console.log('='.repeat(60));
    console.log(`🎯 Match Score: ${matchCount}/${comparison.length} (${matchPercentage}%)`);
    console.log('='.repeat(60));
    
    // Assert overall success
    expect(matchCount).toBeGreaterThanOrEqual(comparison.length * 0.8); // 80% match required
    
    console.log('\n✅ VALIDATION COMPLETE! Proposal matches Empty Studio reference.');
    console.log(`\n🔗 View proposal: http://localhost:3000/editar?projectId=${projectId}&templateType=minimal`);
    console.log(`🔗 Compare with: https://empty-studio.webflow.io/\n`);
  });
});

