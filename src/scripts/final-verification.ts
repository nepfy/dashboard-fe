#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function finalVerification() {
  console.log("🔍 Verificação final dos agentes...\n");

  try {
    const agents = await db.execute(`
      SELECT id, name, system_prompt
      FROM agents 
      WHERE is_active = true
      ORDER BY id
    `);

    let totalAgents = 0;
    let agentsWithErrors = 0;
    let agentsCorrect = 0;

    for (const agent of agents.rows) {
      totalAgents++;
      console.log(`\n📋 ${agent.name} (${agent.id})`);

      const prompt = agent.system_prompt || "";
      const fullText = prompt.toLowerCase();

      // Verificar erros reais de português
      const hasProximosSemanas =
        fullText.includes("dentro dos próximos") &&
        fullText.includes("semanas");
      const hasMidiasInfluencer = fullText.includes("mídias influencer");

      // Verificar se tem "atração" (que está correto)
      const hasAtracaoCorrect = fullText.includes("atração");

      console.log(
        `   ✅ 'atração' (correto): ${hasAtracaoCorrect ? "SIM" : "NÃO"}`
      );
      console.log(
        `   ❌ 'dentro dos próximos X semanas': ${
          hasProximosSemanas ? "SIM" : "NÃO"
        }`
      );
      console.log(
        `   ❌ 'mídias influencer': ${hasMidiasInfluencer ? "SIM" : "NÃO"}`
      );

      if (hasProximosSemanas || hasMidiasInfluencer) {
        agentsWithErrors++;
        console.log("   ❌ Erros de português encontrados!");
      } else {
        agentsCorrect++;
        console.log("   ✅ Nenhum erro de português encontrado!");
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 RESUMO FINAL:");
    console.log(`   Total de agentes verificados: ${totalAgents}`);
    console.log(`   ✅ Agentes corretos: ${agentsCorrect}`);
    console.log(`   ❌ Agentes com erros: ${agentsWithErrors}`);

    if (agentsWithErrors === 0) {
      console.log("\n🎉 Todos os agentes estão com português correto!");
      console.log("✅ 'atração' está correto e não precisa ser alterado");
    } else {
      console.log(
        `\n⚠️ ${agentsWithErrors} agentes ainda têm erros de português.`
      );
    }
  } catch (error) {
    console.error("❌ Erro na verificação:", error);
  }
}

finalVerification().catch(console.error);

