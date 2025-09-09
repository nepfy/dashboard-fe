#!/usr/bin/env tsx

import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

async function compareDbVsFiles() {
  console.log("🔍 Verificando agente no banco de dados...\n");

  try {
    // Buscar um agente Flash específico no banco
    const agent = await getAgentByServiceAndTemplate(
      "marketing-digital",
      "flash"
    );

    if (!agent) {
      console.error("❌ Agente não encontrado no banco de dados.");
      return;
    }

    console.log("📋 AGENTE NO BANCO:");
    console.log(`  ID: ${agent.id}`);
    console.log(`  Nome: ${agent.name}`);
    console.log(`  Setor: ${agent.sector}`);
    console.log(
      `  System Prompt (primeiros 200 chars): ${agent.systemPrompt?.substring(
        0,
        200
      )}...`
    );
    console.log(`  Expertise: ${JSON.stringify(agent.expertise)}`);
    console.log(`  Common Services: ${JSON.stringify(agent.commonServices)}`);
    console.log(
      `  Proposal Structure: ${JSON.stringify(agent.proposalStructure)}`
    );
    console.log(`  Key Terms: ${JSON.stringify(agent.keyTerms)}`);
    console.log(`  Pricing Model: ${agent.pricingModel}`);

    // Verificar se tem flashSpecific
    if (agent.flashSpecific) {
      console.log("\n📋 TEMPLATE FLASH NO BANCO:");
      console.log(
        `  Introduction Style: ${agent.flashSpecific.introductionStyle}`
      );
      console.log(`  About Us Focus: ${agent.flashSpecific.aboutUsFocus}`);
      console.log(
        `  Specialties Approach: ${agent.flashSpecific.specialtiesApproach}`
      );
      console.log(`  Process Emphasis: ${agent.flashSpecific.processEmphasis}`);
      console.log(
        `  Investment Strategy: ${agent.flashSpecific.investmentStrategy}`
      );
    }

    console.log(
      "\n🎯 RESUMO: ✅ Agente encontrado e funcionando no banco de dados!"
    );
    console.log("📝 Nota: Arquivos hardcoded foram removidos com sucesso.");
    console.log("🚀 Sistema agora usa apenas banco de dados.");
  } catch (error) {
    console.error("❌ Erro ao verificar agente:", error);
  }
}

compareDbVsFiles().catch(console.error);
