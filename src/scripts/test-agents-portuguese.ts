#!/usr/bin/env tsx

import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

async function testAgentsPortuguese() {
  console.log("🧪 Testando agentes para verificar português correto...\n");

  try {
    // Lista de agentes para testar
    const testCases = [
      {
        service: "marketing-digital",
        template: "flash",
        name: "Marketing Digital Flash",
      },
      { service: "design", template: "flash", name: "Design Flash" },
      { service: "fotógrafo", template: "flash", name: "Fotógrafo Flash" },
      {
        service: "desenvolvedor",
        template: "flash",
        name: "Desenvolvedor Flash",
      },
      { service: "arquiteto", template: "flash", name: "Arquiteto Flash" },
      { service: "médico", template: "flash", name: "Médico Flash" },
      {
        service: "marketing-digital",
        template: "prime",
        name: "Marketing Digital Prime",
      },
      { service: "design", template: "prime", name: "Design Prime" },
      {
        service: "development",
        template: "base",
        name: "Desenvolvimento Base",
      },
    ];

    let totalAgents = 0;
    let agentsWithErrors = 0;
    let agentsCorrect = 0;

    for (const testCase of testCases) {
      console.log(`\n📋 TESTE: ${testCase.name}`);
      console.log("=".repeat(50));

      try {
        const agent = await getAgentByServiceAndTemplate(
          testCase.service as any,
          testCase.template as any
        );

        if (agent) {
          totalAgents++;
          console.log(`✅ Agente encontrado: ${agent.name}`);

          // Verificar system prompt
          const systemPrompt = agent.systemPrompt || "";
          const fullText = systemPrompt.toLowerCase();

          // Verificar erros de português
          const hasAtracaoIncorrect = fullText.includes("atração");
          const hasProximosSemanas =
            fullText.includes("dentro dos próximos") &&
            fullText.includes("semanas");
          const hasMidiasInfluencer = fullText.includes("mídias influencer");

          console.log("\n🔍 VERIFICAÇÃO DE ERROS:");
          console.log(
            `   ❌ 'atração' (incorreto): ${
              hasAtracaoIncorrect ? "SIM" : "NÃO"
            }`
          );
          console.log(
            `   ❌ 'dentro dos próximos X semanas': ${
              hasProximosSemanas ? "SIM" : "NÃO"
            }`
          );
          console.log(
            `   ❌ 'mídias influencer': ${hasMidiasInfluencer ? "SIM" : "NÃO"}`
          );

          if (
            hasAtracaoIncorrect ||
            hasProximosSemanas ||
            hasMidiasInfluencer
          ) {
            agentsWithErrors++;
            console.log("❌ Erros de português encontrados!");

            // Mostrar contexto dos erros
            if (hasAtracaoIncorrect) {
              const index = fullText.indexOf("atração");
              const context = systemPrompt.substring(
                Math.max(0, index - 30),
                index + 50
              );
              console.log(`   Contexto: "...${context}..."`);
            }
          } else {
            agentsCorrect++;
            console.log("✅ Nenhum erro de português encontrado!");
          }

          // Verificar se tem "atração" correto
          const hasAtracaoCorrect = fullText.includes("atração");
          if (hasAtracaoCorrect) {
            console.log("✅ 'atração' (correto) encontrado");
          }
        } else {
          console.log("❌ Agente não encontrado");
        }
      } catch (error) {
        console.log(`❌ Erro ao buscar agente: ${error}`);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 RESUMO DOS TESTES:");
    console.log(`   Total de agentes testados: ${totalAgents}`);
    console.log(`   ✅ Agentes corretos: ${agentsCorrect}`);
    console.log(`   ❌ Agentes com erros: ${agentsWithErrors}`);

    if (agentsWithErrors === 0) {
      console.log("\n🎉 Todos os agentes estão com português correto!");
    } else {
      console.log(
        `\n⚠️ ${agentsWithErrors} agentes ainda têm erros de português.`
      );
    }
  } catch (error) {
    console.error("❌ Erro ao testar agentes:", error);
  }
}

testAgentsPortuguese().catch(console.error);

