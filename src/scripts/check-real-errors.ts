#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function checkRealErrors() {
  console.log("🔍 Verificando erros reais de português...\n");

  try {
    // Verificar "dentro dos próximos X semanas" (incorreto)
    const proximosSemanas = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt ~ 'dentro dos próximos.*semanas'
    `);

    // Verificar "mídias influencer" (incorreto)
    const midiasInfluencer = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt LIKE '%mídias influencer%'
    `);

    console.log("📊 RESULTADOS DA VERIFICAÇÃO:");
    console.log(
      `   ❌ 'dentro dos próximos X semanas': ${proximosSemanas.rows.length} agentes`
    );
    console.log(
      `   ❌ 'mídias influencer': ${midiasInfluencer.rows.length} agentes`
    );

    if (proximosSemanas.rows.length > 0) {
      console.log("\n❌ Agentes com 'dentro dos próximos X semanas':");
      proximosSemanas.rows.forEach((agent: any) => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }

    if (midiasInfluencer.rows.length > 0) {
      console.log("\n❌ Agentes com 'mídias influencer':");
      midiasInfluencer.rows.forEach((agent: any) => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }

    if (
      proximosSemanas.rows.length === 0 &&
      midiasInfluencer.rows.length === 0
    ) {
      console.log("\n🎉 Todos os erros reais foram corrigidos!");
      console.log("✅ 'atração' está correto (não precisa ser alterado)");
    } else {
      console.log("\n⚠️ Ainda há erros reais para corrigir.");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

checkRealErrors().catch(console.error);

