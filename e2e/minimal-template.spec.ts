import { test, expect } from '../fixtures/auth.fixture';

test.describe('Minimal Template - Proposal Generation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
  });

  test('should generate a minimal proposal for designer service', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click on "Nova Proposta" or similar button
    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    
    // Wait for form to load
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    // Fill in project details
    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Aurora Café & Co.');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'Identidade Visual Completa');
    
    // Fill in project description
    const descriptionSelector = 'textarea[name="projectDescription"], textarea[placeholder*="descrição"]';
    await page.fill(descriptionSelector, 
      'Desenvolvimento de identidade visual completa para cafeteria premium, incluindo logotipo, ' +
      'paleta de cores, tipografia, papelaria e aplicações em redes sociais.'
    );

    // Select designer service
    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*designer.*|.*design.*/i');

    // Select minimal template
    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    // Submit form
    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');

    // Wait for generation (up to 60s)
    await page.waitForURL(/\/editar\/.*/, { timeout: 60000 });

    // Verify we're on the editor page
    expect(page.url()).toContain('/editar/');

    // Verify key sections are present
    await expect(page.locator('text=/Aurora Café/i')).toBeVisible({ timeout: 10000 });
    
    // Check introduction section
    await expect(page.locator('[data-section="introduction"], .intro-section')).toBeVisible();
    
    // Check about us section
    await expect(page.locator('[data-section="aboutUs"], .about-section')).toBeVisible();
    
    // Check clients section
    await expect(page.locator('[data-section="clients"], .partners-section')).toBeVisible();
    
    // Check expertise section
    await expect(page.locator('[data-section="expertise"], .expertise-section')).toBeVisible();
  });

  test('should generate a minimal proposal for architecture service', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Residência Oliveira');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'Reforma e Ampliação Residencial');
    
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', 
      'Reforma completa de residência unifamiliar com ampliação de 80m², incluindo nova suíte master, ' +
      'integração de ambientes e modernização de fachada.'
    );

    // Select architecture service
    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*arquiteto.*|.*arquitetura.*/i');

    // Select minimal template
    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');

    await page.waitForURL(/\/editar\/.*/, { timeout: 60000 });

    expect(page.url()).toContain('/editar/');
    await expect(page.locator('text=/Residência Oliveira/i')).toBeVisible({ timeout: 10000 });
  });

  test('should generate a minimal proposal for photography service', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.click('button:has-text("Nova Proposta"), a:has-text("Nova Proposta")');
    await page.waitForSelector('input[name="clientName"], input[placeholder*="cliente"]', { timeout: 10000 });

    await page.fill('input[name="clientName"], input[placeholder*="cliente"]', 'Bella Noivas');
    await page.fill('input[name="projectName"], input[placeholder*="projeto"]', 'Ensaio Pré-Wedding');
    
    await page.fill('textarea[name="projectDescription"], textarea[placeholder*="descrição"]', 
      'Ensaio fotográfico pré-casamento em locação externa, com 4 horas de duração, ' +
      'incluindo edição completa e álbum digital premium.'
    );

    // Select photography service
    const serviceSelector = 'select[name="service"], button:has-text("Serviço")';
    await page.click(serviceSelector);
    await page.click('text=/.*fotografia.*|.*photography.*/i');

    // Select minimal template
    const templateSelector = 'select[name="template"], button:has-text("Template")';
    await page.click(templateSelector);
    await page.click('text=/.*minimal.*/i');

    await page.click('button[type="submit"]:has-text("Gerar"), button:has-text("Criar Proposta")');

    await page.waitForURL(/\/editar\/.*/, { timeout: 60000 });

    expect(page.url()).toContain('/editar/');
    await expect(page.locator('text=/Bella Noivas/i')).toBeVisible({ timeout: 10000 });
  });
});

