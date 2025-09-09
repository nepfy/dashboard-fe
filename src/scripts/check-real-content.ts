#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function checkRealContent() {
  console.log("🔍 Verificando conteúdo real dos agentes...\n");

  try {
    const agents = await db.execute(`
      SELECT id, name, system_prompt
      FROM agents 
      WHERE id LIKE '%-flash-agent'
      ORDER BY id
    `);

    for (const agent of agents.rows) {
      console.log(`\n📋 ${agent.name} (${agent.id})`);
      
      const prompt = agent.system_prompt || "";
      
      // Procurar por "atração" (incorreto)
      if (prompt.includes("atração")) {
        console.log("❌ Encontrado 'atração' (incorreto)");
        const index = prompt.indexOf("atração");
        const context = prompt.substring(Math.max(0, index - 20), index + 30);
        console.log(`   Contexto: "...${context}..."`);
      }
      
      // Procurar por "atração" (correto)
      if (prompt.includes("atração")) {
        console.log("✅ Encontrado 'atração' (correto)");
      }
    }

  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

checkRealContent().catch(console.error);

