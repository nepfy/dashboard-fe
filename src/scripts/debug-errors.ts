#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function debugErrors() {
  console.log("🔍 Debugando erros de português...\n");

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
        const index = prompt.indexOf("atração");
        const context = prompt.substring(Math.max(0, index - 20), index + 30);
        console.log(`   Contexto: "...${context}..."`);
      }

      // Procurar por "dentro dos próximos"
      if (prompt.includes("dentro dos próximos")) {
        console.log("❌ Encontrado 'dentro dos próximos'");
        const index = prompt.indexOf("dentro dos próximos");
        const context = prompt.substring(Math.max(0, index - 10), index + 30);
        console.log(`   Contexto: "...${context}..."`);
      }

      // Procurar por "mídias influencer"
      if (prompt.includes("mídias influencer")) {
        console.log("❌ Encontrado 'mídias influencer'");
        const index = prompt.indexOf("mídias influencer");
        const context = prompt.substring(Math.max(0, index - 10), index + 30);
        console.log(`   Contexto: "...${context}..."`);
      }
    }
  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

debugErrors().catch(console.error);

