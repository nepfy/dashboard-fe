#!/usr/bin/env tsx

import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
import { FlashTemplateWorkflow } from "#/modules/ai-generator/themes/flash";
import { PrimeTemplateWorkflow } from "#/modules/ai-generator/themes/prime";

async function testProposalGenerator() {
  console.log("🧪 Testando gerador de propostas...\n");

  try {
    // Teste 1: Agente Flash - Marketing Digital
    console.log("📋 TESTE 1: Marketing Digital Flash");
    console.log("=".repeat(50));

    const marketingFlashAgent = await getAgentByServiceAndTemplate(
      "marketing-digital",
      "flash"
    );
    if (marketingFlashAgent) {
      console.log(`✅ Agente encontrado: ${marketingFlashAgent.name}`);

      const flashWorkflow = new FlashTemplateWorkflow();
      const testData = {
        selectedService: "marketing-digital",
        companyInfo: "Clínica Dermatológica Excelência",
        clientName: "Clínica Dermatológica Excelência",
        projectName: "Site Institucional",
        projectDescription: "Site institucional para clínica de dermatologia",
        selectedPlans: ["Plano Básico", "Plano Premium"],
        planDetails: "Planos personalizados para marketing digital",
        includeTerms: true,
        includeFAQ: true,
        templateType: "flash" as const,
        mainColor: "#3B82F6",
      };

      console.log("\n🚀 Gerando proposta Flash...");
      const flashProposal = await flashWorkflow.generateFlashProposal(
        testData,
        marketingFlashAgent
      );

      console.log("\n📄 PROPOSTA GERADA:");
      console.log("=".repeat(50));
      console.log(`Título: ${flashProposal.hero?.title || "N/A"}`);
      console.log(`Subtítulo: ${flashProposal.hero?.subtitle || "N/A"}`);
      console.log(`Sobre Nós: ${flashProposal.aboutUs?.title || "N/A"}`);
      console.log(
        `Especialidades: ${flashProposal.specialties?.title || "N/A"}`
      );
      console.log(`Processo: ${flashProposal.process?.title || "N/A"}`);
      console.log(`Termos: ${flashProposal.terms?.title || "N/A"}`);

      // Verificar se há erros de português
      const fullText = JSON.stringify(flashProposal).toLowerCase();
      const hasAtracaoIncorrect = fullText.includes("atração");
      const hasProximosSemanas =
        fullText.includes("dentro dos próximos") &&
        fullText.includes("semanas");
      const hasMidiasInfluencer = fullText.includes("mídias influencer");

      console.log("\n🔍 VERIFICAÇÃO DE ERROS:");
      console.log(
        `   ❌ 'atração' (incorreto): ${hasAtracaoIncorrect ? "SIM" : "NÃO"}`
      );
      console.log(
        `   ❌ 'dentro dos próximos X semanas': ${
          hasProximosSemanas ? "SIM" : "NÃO"
        }`
      );
      console.log(
        `   ❌ 'mídias influencer': ${hasMidiasInfluencer ? "SIM" : "NÃO"}`
      );

      if (!hasAtracaoIncorrect && !hasProximosSemanas && !hasMidiasInfluencer) {
        console.log("✅ Nenhum erro de português encontrado!");
      } else {
        console.log("❌ Erros de português encontrados!");
      }
    } else {
      console.log("❌ Agente não encontrado");
    }

    console.log("\n" + "=".repeat(80) + "\n");

    // Teste 2: Agente Prime - Design
    console.log("📋 TESTE 2: Design Prime");
    console.log("=".repeat(50));

    const designPrimeAgent = await getAgentByServiceAndTemplate(
      "design",
      "prime"
    );
    if (designPrimeAgent) {
      console.log(`✅ Agente encontrado: ${designPrimeAgent.name}`);

      const primeWorkflow = new PrimeTemplateWorkflow();
      const testData2 = {
        selectedService: "design",
        companyInfo: "Studio Fotográfico Arte & Vida",
        clientName: "Studio Fotográfico Arte & Vida",
        projectName: "Site Portfólio",
        projectDescription: "Site portfólio para estúdio fotográfico",
        selectedPlans: ["Plano Essencial", "Plano Completo"],
        planDetails: "Planos para desenvolvimento de site portfólio",
        includeTerms: true,
        includeFAQ: true,
        templateType: "prime" as const,
        mainColor: "#8B5CF6",
      };

      console.log("\n🚀 Gerando proposta Prime...");
      const primeProposal = await primeWorkflow.execute(
        testData2,
        designPrimeAgent
      );

      console.log("\n📄 PROPOSTA GERADA:");
      console.log("=".repeat(50));
      console.log(`Título: ${primeProposal.hero?.title || "N/A"}`);
      console.log(`Subtítulo: ${primeProposal.hero?.subtitle || "N/A"}`);
      console.log(`Sobre Nós: ${primeProposal.aboutUs?.title || "N/A"}`);
      console.log(
        `Especialidades: ${primeProposal.specialties?.title || "N/A"}`
      );
      console.log(`Processo: ${primeProposal.process?.title || "N/A"}`);
      console.log(`Termos: ${primeProposal.terms?.title || "N/A"}`);

      // Verificar se há erros de português
      const fullText2 = JSON.stringify(primeProposal).toLowerCase();
      const hasAtracaoIncorrect2 = fullText2.includes("atração");
      const hasProximosSemanas2 =
        fullText2.includes("dentro dos próximos") &&
        fullText2.includes("semanas");
      const hasMidiasInfluencer2 = fullText2.includes("mídias influencer");

      console.log("\n🔍 VERIFICAÇÃO DE ERROS:");
      console.log(
        `   ❌ 'atração' (incorreto): ${hasAtracaoIncorrect2 ? "SIM" : "NÃO"}`
      );
      console.log(
        `   ❌ 'dentro dos próximos X semanas': ${
          hasProximosSemanas2 ? "SIM" : "NÃO"
        }`
      );
      console.log(
        `   ❌ 'mídias influencer': ${hasMidiasInfluencer2 ? "SIM" : "NÃO"}`
      );

      if (
        !hasAtracaoIncorrect2 &&
        !hasProximosSemanas2 &&
        !hasMidiasInfluencer2
      ) {
        console.log("✅ Nenhum erro de português encontrado!");
      } else {
        console.log("❌ Erros de português encontrados!");
      }
    } else {
      console.log("❌ Agente não encontrado");
    }

    console.log("\n" + "=".repeat(80) + "\n");

    // Teste 3: Agente Base - Desenvolvimento
    console.log("📋 TESTE 3: Desenvolvimento Base");
    console.log("=".repeat(50));

    const devBaseAgent = await getAgentByServiceAndTemplate(
      "development",
      "base"
    );
    if (devBaseAgent) {
      console.log(`✅ Agente encontrado: ${devBaseAgent.name}`);

      const testData3 = {
        selectedService: "development",
        companyInfo: "Consultoria Empresarial Estratégica",
        clientName: "Consultoria Empresarial Estratégica",
        projectName: "Sistema de Gestão",
        projectDescription: "Sistema de gestão empresarial",
        selectedPlans: ["Plano Starter", "Plano Business"],
        planDetails: "Planos para desenvolvimento de sistema",
        includeTerms: true,
        includeFAQ: true,
        templateType: "base" as const,
        mainColor: "#10B981",
      };

      console.log("\n🚀 Gerando proposta Base...");
      // Para agentes base, vamos simular uma geração simples
      console.log("📄 PROPOSTA SIMULADA:");
      console.log("=".repeat(50));
      console.log(`Cliente: ${testData3.clientName}`);
      console.log(`Projeto: ${testData3.projectType}`);
      console.log(`Orçamento: ${testData3.budget}`);
      console.log(`Prazo: ${testData3.timeline}`);

      // Verificar se há erros de português no system prompt
      const systemPrompt = devBaseAgent.systemPrompt || "";
      const hasAtracaoIncorrect3 = systemPrompt.includes("atração");
      const hasProximosSemanas3 =
        systemPrompt.includes("dentro dos próximos") &&
        systemPrompt.includes("semanas");
      const hasMidiasInfluencer3 = systemPrompt.includes("mídias influencer");

      console.log("\n🔍 VERIFICAÇÃO DE ERROS NO SYSTEM PROMPT:");
      console.log(
        `   ❌ 'atração' (incorreto): ${hasAtracaoIncorrect3 ? "SIM" : "NÃO"}`
      );
      console.log(
        `   ❌ 'dentro dos próximos X semanas': ${
          hasProximosSemanas3 ? "SIM" : "NÃO"
        }`
      );
      console.log(
        `   ❌ 'mídias influencer': ${hasMidiasInfluencer3 ? "SIM" : "NÃO"}`
      );

      if (
        !hasAtracaoIncorrect3 &&
        !hasProximosSemanas3 &&
        !hasMidiasInfluencer3
      ) {
        console.log("✅ Nenhum erro de português encontrado no system prompt!");
      } else {
        console.log("❌ Erros de português encontrados no system prompt!");
      }
    } else {
      console.log("❌ Agente não encontrado");
    }

    console.log("\n🎉 Testes concluídos!");
  } catch (error) {
    console.error("❌ Erro ao testar gerador:", error);
  }
}

testProposalGenerator().catch(console.error);
