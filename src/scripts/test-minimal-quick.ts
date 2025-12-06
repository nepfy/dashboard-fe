#!/usr/bin/env tsx

import { MinimalTemplateWorkflow } from "#/modules/ai-generator/themes/minimal";
import type { MinimalThemeData } from "#/modules/ai-generator/themes/minimal";
import fs from "fs";
import path from "path";

// Ensure TOGETHER_API_KEY is set
if (!process.env.TOGETHER_API_KEY) {
  console.error("❌ TOGETHER_API_KEY não configurada!");
  console.log("Configure no .env.local: TOGETHER_API_KEY=your_key");
  process.exit(1);
}

// Mock data for testing
const mockData: MinimalThemeData = {
  companyInfo:
    "Empty Studio - Agência de design digital especializada em criar experiências visuais memoráveis e funcionais. Com 8 anos de mercado, nossa equipe multidisciplinar combina estratégia, design e tecnologia para entregar soluções que realmente fazem diferença. Atendemos desde startups até grandes empresas, sempre com foco em resultados mensuráveis e qualidade excepcional.",
  clientName: "Aurora Café & Co.",
  projectName: "Website Institucional e E-commerce",
  projectDescription:
    "Desenvolvimento de website institucional integrado com e-commerce para cafeteria artesanal premium. O projeto inclui identidade visual digital, catálogo de produtos, sistema de pedidos online, blog de conteúdo sobre café e integração com redes sociais. Objetivo: aumentar vendas online e fortalecer presença digital da marca no mercado de cafés especiais.",
  clientDescription:
    "Cafeteria artesanal focada em cafés especiais de origem única, com forte presença física em São Paulo e público jovem-adulto interessado em experiências gastronômicas autênticas.",
  selectedService: "designer",
  templateType: "minimal",
  selectedPlans: 2,
  planDetails:
    "Dois planos principais: Essencial (website básico) e Completo (website + e-commerce integrado)",
  includeTerms: true,
  includeFAQ: true,
  mainColor: "#2A2A2A",
};

async function testMinimalGeneration() {
  console.log("🚀 Iniciando teste de geração Minimal...\n");
  console.log("📋 Dados do Mock:");
  console.log(`  Cliente: ${mockData.clientName}`);
  console.log(`  Projeto: ${mockData.projectName}`);
  console.log(`  Serviço: ${mockData.selectedService}`);
  console.log("\n⏳ Gerando proposta... (isso pode levar ~30-60 segundos)\n");

  const startTime = Date.now();

  try {
    const workflow = new MinimalTemplateWorkflow();
    const result = await workflow.execute(mockData);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (result.status === "error") {
      console.error("❌ Erro na geração:", result.error);
      process.exit(1);
    }

    const proposal = result.proposal;

    // Analyze CLIENTS section
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 SEÇÃO CLIENTS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const clientsTitle = proposal.clients?.title || "";
    const clientsParagraph1 = proposal.clients?.paragraphs?.[0] || "";
    const clientsParagraph2 = proposal.clients?.paragraphs?.[1] || "";
    const clientsItems = proposal.clients?.items?.length || 0;

    console.log(`✓ Title (${clientsTitle.length} chars):`);
    console.log(`  "${clientsTitle}"\n`);

    console.log(`✓ Paragraph 1 (${clientsParagraph1.length} chars):`);
    console.log(`  "${clientsParagraph1}"\n`);

    console.log(`✓ Paragraph 2 (${clientsParagraph2.length} chars):`);
    console.log(`  "${clientsParagraph2}"\n`);

    console.log(`✓ Items: ${clientsItems} clientes\n`);

    // Validations
    const warnings: string[] = [];
    if (clientsTitle.length < 150) {
      warnings.push(
        `⚠️  Title muito curto (${clientsTitle.length} chars, recomendado 150+)`
      );
    }
    if (clientsParagraph1.length < 250) {
      warnings.push(
        `⚠️  Paragraph 1 muito curto (${clientsParagraph1.length} chars, recomendado 250+)`
      );
    }
    if (clientsParagraph2.length < 200) {
      warnings.push(
        `⚠️  Paragraph 2 muito curto (${clientsParagraph2.length} chars, recomendado 200+)`
      );
    }
    if (clientsItems !== 12) {
      warnings.push(`⚠️  Items deveria ser 12, mas é ${clientsItems}`);
    }

    if (warnings.length > 0) {
      console.log("⚠️  AVISOS CLIENTS:");
      warnings.forEach((w) => console.log(`  ${w}`));
      console.log("");
    } else {
      console.log("✅ Todos os campos de CLIENTS estão dentro do esperado!\n");
    }

    // Analyze EXPERTISE section
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎯 SEÇÃO EXPERTISE:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const expertiseTitle = proposal.expertise?.title || "";
    const expertiseSubtitle = proposal.expertise?.subtitle || "";
    const expertiseTopics = proposal.expertise?.topics || [];

    console.log(`✓ Subtitle (${expertiseSubtitle.length} chars):`);
    console.log(`  "${expertiseSubtitle}"\n`);

    console.log(`✓ Title (${expertiseTitle.length} chars):`);
    console.log(`  "${expertiseTitle}"\n`);

    console.log(`✓ Topics: ${expertiseTopics.length} áreas\n`);

    expertiseTopics.slice(0, 3).forEach((topic, index) => {
      console.log(`  ${index + 1}. ${topic.title} (${topic.title.length} chars)`);
      console.log(`     Icon: ${topic.icon}`);
      console.log(
        `     Description (${topic.description.length} chars): "${topic.description}"`
      );
      console.log("");
    });

    if (expertiseTopics.length > 3) {
      console.log(`  ... e mais ${expertiseTopics.length - 3} áreas\n`);
    }

    // Validations for expertise
    const expertiseWarnings: string[] = [];
    if (expertiseTopics.length !== 9) {
      expertiseWarnings.push(
        `⚠️  Topics deveria ser 9, mas é ${expertiseTopics.length}`
      );
    }

    expertiseTopics.forEach((topic, index) => {
      if (topic.title.length > 40) {
        expertiseWarnings.push(
          `⚠️  Topic ${index + 1} title muito longo (${topic.title.length} chars, max 40)`
        );
      }
      if (topic.description.length < 120) {
        expertiseWarnings.push(
          `⚠️  Topic ${index + 1} description muito curto (${topic.description.length} chars, recomendado 120+)`
        );
      }
      if (topic.description.length > 180) {
        expertiseWarnings.push(
          `⚠️  Topic ${index + 1} description muito longo (${topic.description.length} chars, max 180)`
        );
      }
    });

    if (expertiseWarnings.length > 0) {
      console.log("⚠️  AVISOS EXPERTISE:");
      expertiseWarnings.forEach((w) => console.log(`  ${w}`));
      console.log("");
    } else {
      console.log("✅ Todos os campos de EXPERTISE estão dentro do esperado!\n");
    }

    // Save to file
    const outputDir = path.join(process.cwd(), "test-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const filename = `minimal-test-${timestamp}.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(
      filepath,
      JSON.stringify(
        {
          metadata: {
            timestamp: new Date().toISOString(),
            duration: `${duration}s`,
            mockData,
          },
          proposal,
          validation: {
            clients: {
              titleLength: clientsTitle.length,
              paragraph1Length: clientsParagraph1.length,
              paragraph2Length: clientsParagraph2.length,
              itemsCount: clientsItems,
              warnings: warnings.length > 0 ? warnings : null,
            },
            expertise: {
              topicsCount: expertiseTopics.length,
              warnings: expertiseWarnings.length > 0 ? expertiseWarnings : null,
            },
          },
        },
        null,
        2
      )
    );

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Proposta gerada com sucesso em ${duration}s`);
    console.log(`📁 Salva em: ${filepath}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Summary
    const totalWarnings = warnings.length + expertiseWarnings.length;
    if (totalWarnings === 0) {
      console.log("🎉 PERFEITO! Nenhum aviso - textos profissionais e completos!");
    } else {
      console.log(
        `⚠️  Total de avisos: ${totalWarnings} - revisar prompts se necessário`
      );
    }
  } catch (error) {
    console.error("❌ Erro durante geração:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testMinimalGeneration();

