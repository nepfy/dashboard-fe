#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function fixPortugueseErrors() {
  console.log("🔧 Corrigindo erros de português nos agentes...\n");

  try {
    // Corrigir "atração" → "atração" em todos os agentes Flash
    console.log("📋 Corrigindo 'atração' → 'atração'...");

    const result1 = await db.execute(`
      UPDATE agents 
      SET system_prompt = REPLACE(system_prompt, 'atração', 'atração'),
          updated_at = NOW()
      WHERE id LIKE '%-flash-agent' 
      AND system_prompt LIKE '%atração%'
    `);

    console.log(`✅ ${result1.rowCount} agentes atualizados`);

    // Corrigir "dentro dos próximos X semanas" → "dentro das próximas X semanas"
    console.log("📋 Corrigindo 'dentro dos próximos X semanas'...");

    const result2 = await db.execute(`
      UPDATE agents 
      SET system_prompt = REGEXP_REPLACE(
        system_prompt, 
        'dentro dos próximos (\\d+) semanas', 
        'dentro das próximas \\1 semanas', 
        'g'
      ),
      updated_at = NOW()
      WHERE id LIKE '%-flash-agent' 
      AND system_prompt ~ 'dentro dos próximos.*semanas'
    `);

    console.log(`✅ ${result2.rowCount} agentes atualizados`);

    // Corrigir "mídias influencer" → "mídias de influenciadores"
    console.log("📋 Corrigindo 'mídias influencer'...");

    const result3 = await db.execute(`
      UPDATE agents 
      SET system_prompt = REPLACE(system_prompt, 'mídias influencer', 'mídias de influenciadores'),
          updated_at = NOW()
      WHERE id LIKE '%-flash-agent' 
      AND system_prompt LIKE '%mídias influencer%'
    `);

    console.log(`✅ ${result3.rowCount} agentes atualizados`);

    console.log("\n🎉 Correções concluídas!");

    // Verificar se ainda há erros
    console.log("\n🔍 Verificando se ainda há erros...");

    const remainingErrors = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND (system_prompt ILIKE '%atração%' 
           OR system_prompt ~ 'dentro dos próximos.*semanas'
           OR system_prompt ILIKE '%mídias influencer%')
    `);

    if (remainingErrors.rows.length === 0) {
      console.log("✅ Todos os erros foram corrigidos!");
    } else {
      console.log(
        `❌ Ainda há ${remainingErrors.rows.length} agentes com erros:`
      );
      remainingErrors.rows.forEach((agent: any) => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }
  } catch (error) {
    console.error("❌ Erro ao corrigir agentes:", error);
  }
}

fixPortugueseErrors().catch(console.error);

