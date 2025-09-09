#!/usr/bin/env tsx

import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

async function fixPortugueseErrors() {
  console.log("🔧 Corrigindo erros de português nos agentes...\n");

  try {
    // Buscar todos os agentes Flash
    const agents = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.is_active, true));

    const flashAgents = agents.filter(agent => agent.id.includes("-flash-agent"));

    console.log(`📋 Corrigindo ${flashAgents.length} agentes Flash...\n`);

    for (const agent of flashAgents) {
      let updatedPrompt = agent.systemPrompt || "";
      let hasChanges = false;

      // Corrigir "atração" → "atração"
      if (updatedPrompt.includes("atração")) {
        updatedPrompt = updatedPrompt.replace(/atração/g, "atração");
        hasChanges = true;
        console.log(`✅ Corrigido 'atração' em ${agent.name}`);
      }

      // Corrigir "dentro dos próximos X semanas" → "dentro das próximas X semanas"
      const semanasRegex = /dentro dos próximos (\d+) semanas/g;
      if (semanasRegex.test(updatedPrompt)) {
        updatedPrompt = updatedPrompt.replace(semanasRegex, "dentro das próximas $1 semanas");
        hasChanges = true;
        console.log(`✅ Corrigido 'dentro dos próximos X semanas' em ${agent.name}`);
      }

      // Corrigir "mídias influencer" → "mídias de influenciadores"
      if (updatedPrompt.includes("mídias influencer")) {
        updatedPrompt = updatedPrompt.replace(/mídias influencer/g, "mídias de influenciadores");
        hasChanges = true;
        console.log(`✅ Corrigido 'mídias influencer' em ${agent.name}`);
      }

      // Salvar se houve mudanças
      if (hasChanges) {
        await db
          .update(agentsTable)
          .set({
            systemPrompt: updatedPrompt,
            updatedAt: new Date(),
          })
          .where(eq(agentsTable.id, agent.id));
        
        console.log(`💾 Salvo: ${agent.name}`);
      }
    }

    console.log("\n🎉 Correções concluídas!");

    // Verificar se ainda há erros
    console.log("\n🔍 Verificando se ainda há erros...");
    const allAgents = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.is_active, true));

    const remainingErrors = allAgents.filter(agent => {
      const prompt = agent.systemPrompt || "";
      return prompt.includes("atração") || 
             prompt.includes("dentro dos próximos") || 
             prompt.includes("mídias influencer");
    });

    if (remainingErrors.length === 0) {
      console.log("✅ Todos os erros foram corrigidos!");
    } else {
      console.log(`❌ Ainda há ${remainingErrors.length} agentes com erros:`);
      remainingErrors.forEach(agent => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }

  } catch (error) {
    console.error("❌ Erro ao corrigir agentes:", error);
  }
}

fixPortugueseErrors().catch(console.error);
