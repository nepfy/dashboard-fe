#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function fixPortugueseErrors() {
  console.log("🔧 Corrigindo erros de português nos agentes...\n");

  try {
    // Buscar todos os agentes Flash
    const agents = await db.execute(`
      SELECT id, name, system_prompt
      FROM agents 
      WHERE is_active = true AND id LIKE '%-flash-agent'
      ORDER BY id
    `);

    console.log(`📋 Corrigindo ${agents.rows.length} agentes Flash...\n`);

    for (const agent of agents.rows) {
      let updatedPrompt = agent.system_prompt;
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
        await db.execute(`
          UPDATE agents 
          SET system_prompt = '${updatedPrompt.replace(/'/g, "''")}', updated_at = NOW()
          WHERE id = '${agent.id}'
        `);
        
        console.log(`💾 Salvo: ${agent.name}`);
      }
    }

    console.log("\n🎉 Correções concluídas!");

    // Verificar se ainda há erros
    console.log("\n🔍 Verificando se ainda há erros...");
    const remainingErrors = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND (system_prompt ILIKE '%atração%' 
           OR system_prompt ILIKE '%dentro dos próximos%' 
           OR system_prompt ILIKE '%mídias influencer%')
    `);

    if (remainingErrors.rows.length === 0) {
      console.log("✅ Todos os erros foram corrigidos!");
    } else {
      console.log(`❌ Ainda há ${remainingErrors.rows.length} agentes com erros:`);
      remainingErrors.rows.forEach(agent => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }

  } catch (error) {
    console.error("❌ Erro ao corrigir agentes:", error);
  }
}

fixPortugueseErrors().catch(console.error);
