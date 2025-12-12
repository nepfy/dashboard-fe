import { test, expect } from '../fixtures/auth.fixture';

test.describe('Minimal Template - Content Quality', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
  });

  test('should generate quality content for clients section', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Create a new proposal
    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Tech Startup Inc.');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'Landing Page Conversion');
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', 
      'Desenvolvimento de landing page de alta conversão para produto SaaS B2B, ' +
      'com foco em geração de leads e otimização para SEO.'
    );

    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*designer.*|.*design.*/i');

    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');
    await page.waitForURL(/\/editar\/.*/, { timeout: 60000 });

    // Navigate to clients section
    await page.locator('[data-section="clients"], .partners-section').scrollIntoViewIfNeeded();

    // Verify clients title is not empty and has minimum length
    const clientsTitle = await page.locator('.partners-heading h2, .heading-style-h2').first().textContent();
    expect(clientsTitle).toBeTruthy();
    expect(clientsTitle!.length).toBeGreaterThan(50); // Should be descriptive

    // Verify paragraphs are not empty and have minimum length
    const paragraphs = await page.locator('.partners-paragraph p, .text-size-medium').allTextContents();
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    
    paragraphs.forEach((paragraph, index) => {
      expect(paragraph.trim().length).toBeGreaterThan(100); // Minimum 100 chars per paragraph
      console.log(`Paragraph ${index + 1}: ${paragraph.length} chars`);
    });

    // Verify 12 client logos are present
    const clientLogos = await page.locator('.partners-logos-item, [data-client-item]').count();
    expect(clientLogos).toBe(12);
  });

  test('should generate quality content for expertise section', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Create a new proposal
    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Fashion Brand X');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'E-commerce UI/UX Redesign');
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', 
      'Redesign completo da experiência de compra do e-commerce, incluindo jornada do usuário, ' +
      'interface mobile-first e integração com sistema de pagamento.'
    );

    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*designer.*|.*design.*/i');

    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');
    await page.waitForURL(/\/editar\/.*/, { timeout: 60000 });

    // Navigate to expertise section
    await page.locator('[data-section="expertise"], .expertise-section').scrollIntoViewIfNeeded();

    // Verify expertise topics
    const expertiseItems = await page.locator('.expertise-item, [data-expertise-item]').all();
    expect(expertiseItems.length).toBeGreaterThanOrEqual(3);

    // Check each topic has title and description with minimum length
    for (const item of expertiseItems) {
      const title = await item.locator('h3, .expertise-title').textContent();
      const description = await item.locator('p, .expertise-description').textContent();
      
      expect(title).toBeTruthy();
      expect(title!.length).toBeGreaterThan(10);
      
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(120); // Minimum 120 chars
      
      console.log(`Topic: ${title} - ${description!.length} chars`);
    }
  });
});

