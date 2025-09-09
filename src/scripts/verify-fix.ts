#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function verifyFix() {
  console.log("🔍 Verificando se as correções foram aplicadas...\n");

  try {
    // Verificar se ainda há "atração" (incorreto) - mas na verdade "atração" está correto
    const atracaoIncorrect = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt LIKE '%atração%'
    `);

    // Verificar se ainda há "atração" (correto)
    const atracaoCorrect = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt LIKE '%atração%'
    `);

    // Verificar se ainda há "dentro dos próximos"
    const proximosSemanas = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt ~ 'dentro dos próximos.*semanas'
    `);

    // Verificar se ainda há "mídias influencer"
    const midiasInfluencer = await db.execute(`
      SELECT id, name
      FROM agents 
      WHERE is_active = true 
      AND system_prompt LIKE '%mídias influencer%'
    `);

    console.log("📊 RESULTADOS DA VERIFICAÇÃO:");
    console.log(
      `   ❌ 'atração' (incorreto): ${atracaoIncorrect.rows.length} agentes`
    );
    console.log(
      `   ✅ 'atração' (correto): ${atracaoCorrect.rows.length} agentes`
    );
    console.log(
      `   ❌ 'dentro dos próximos X semanas': ${proximosSemanas.rows.length} agentes`
    );
    console.log(
      `   ❌ 'mídias influencer': ${midiasInfluencer.rows.length} agentes`
    );

    if (atracaoIncorrect.rows.length > 0) {
      console.log("\n❌ Agentes com 'atração' (incorreto):");
      atracaoIncorrect.rows.forEach((agent: any) => {
        console.log(`   - ${agent.name} (${agent.id})`);
      });
    }

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
      atracaoIncorrect.rows.length === 0 &&
      proximosSemanas.rows.length === 0 &&
      midiasInfluencer.rows.length === 0
    ) {
      console.log("\n🎉 Todos os erros foram corrigidos!");
    } else {
      console.log("\n⚠️ Ainda há erros para corrigir.");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

verifyFix().catch(console.error);
