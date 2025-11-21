/**
 * Script para atualizar system prompts dos agentes no banco de dados
 * Adiciona instrução crítica de idioma pt-BR em todos os agentes
 */

import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

const LANGUAGE_INSTRUCTION = `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

`;

async function updateAgentsLanguage() {
  try {
    console.log("🔄 Iniciando atualização de system prompts dos agentes...");

    // Buscar todos os agentes ativos
    const agents = await db.select().from(agentsTable);

    console.log(`📊 Encontrados ${agents.length} agentes no banco`);

    let updatedCount = 0;

    for (const agent of agents) {
      // Verificar se o system prompt já tem a instrução de idioma
      if (agent.systemPrompt.includes("IDIOMA OBRIGATÓRIO")) {
        console.log(`⏭️  Agente ${agent.id} já possui instrução de idioma`);
        continue;
      }

      // Adicionar instrução de idioma no início do system prompt
      const updatedSystemPrompt = LANGUAGE_INSTRUCTION + agent.systemPrompt;

      // Atualizar no banco
      await db
        .update(agentsTable)
        .set({
          systemPrompt: updatedSystemPrompt,
          updatedAt: new Date(),
        })
        .where(eq(agentsTable.id, agent.id));

      updatedCount++;
      console.log(`✅ Agente ${agent.id} atualizado com instrução de idioma`);
    }

    console.log(`\n✨ Atualização concluída!`);
    console.log(`📈 ${updatedCount} agentes atualizados`);
    console.log(`⏭️  ${agents.length - updatedCount} agentes já estavam atualizados`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao atualizar agentes:", error);
    process.exit(1);
  }
}

// Executar script
updateAgentsLanguage();

