#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function fixRemainingErrors() {
  console.log("🔧 Corrigindo erros restantes de português...\n");

  try {
    // Primeiro, vamos verificar o que realmente está no banco
    console.log("🔍 Verificando conteúdo atual...");

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
      const atracaoIncorrectCount = (prompt.match(/atração/g) || []).length;
      const atracaoCorrectCount = (prompt.match(/atração/g) || []).length;

      console.log(
        `   'atração' (incorreto): ${atracaoIncorrectCount} ocorrências`
      );
      console.log(`   'atração' (correto): ${atracaoCorrectCount} ocorrências`);

      if (atracaoIncorrectCount > 0) {
        console.log("   ❌ Precisa correção");

        // Mostrar contexto
        const index = prompt.indexOf("atração");
        if (index !== -1) {
          const context = prompt.substring(Math.max(0, index - 20), index + 30);
          console.log(`   Contexto: "...${context}..."`);
        }
      } else {
        console.log("   ✅ Já está correto");
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("🔧 Aplicando correções...");

    // Corrigir "atração" → "atração" em todos os agentes Flash
    const result = await db.execute(`
      UPDATE agents 
      SET system_prompt = REPLACE(system_prompt, 'atração', 'atração'),
          updated_at = NOW()
      WHERE id LIKE '%-flash-agent' 
      AND system_prompt LIKE '%atração%'
    `);

    console.log(`✅ ${result.rowCount} agentes atualizados`);

    console.log("\n🔍 Verificando após correção...");

    const agentsAfter = await db.execute(`
      SELECT id, name, system_prompt
      FROM agents 
      WHERE id LIKE '%-flash-agent'
      ORDER BY id
    `);

    let stillHasErrors = 0;
    for (const agent of agentsAfter.rows) {
      const prompt = agent.system_prompt || "";
      const atracaoIncorrectCount = (prompt.match(/atração/g) || []).length;

      if (atracaoIncorrectCount > 0) {
        stillHasErrors++;
        console.log(
          `❌ ${agent.name} ainda tem ${atracaoIncorrectCount} ocorrências de 'atração' (incorreto)`
        );
      } else {
        console.log(`✅ ${agent.name} está correto`);
      }
    }

    if (stillHasErrors === 0) {
      console.log("\n🎉 Todos os erros foram corrigidos!");
    } else {
      console.log(`\n⚠️ Ainda há ${stillHasErrors} agentes com erros.`);
    }
  } catch (error) {
    console.error("❌ Erro ao corrigir agentes:", error);
  }
}

fixRemainingErrors().catch(console.error);

