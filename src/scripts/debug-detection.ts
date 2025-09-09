#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function debugDetection() {
  console.log("🔍 Debugando detecção de caracteres...\n");

  try {
    const agents = await db.execute(`
      SELECT id, name, system_prompt
      FROM agents 
      WHERE id LIKE '%-flash-agent'
      LIMIT 1
    `);

    const agent = agents.rows[0];
    const prompt = agent.system_prompt || "";

    console.log(`📋 ${agent.name}`);

    // Testar diferentes formas de busca
    const test1 = prompt.includes("atração");
    const test2 = prompt.includes("atração");
    const test3 = prompt.indexOf("atração") !== -1;
    const test4 = prompt.indexOf("atração") !== -1;

    console.log(`\n🧪 TESTES DE DETECÇÃO:`);
    console.log(`   prompt.includes("atração"): ${test1}`);
    console.log(`   prompt.includes("atração"): ${test2}`);
    console.log(`   prompt.indexOf("atração") !== -1: ${test3}`);
    console.log(`   prompt.indexOf("atração") !== -1: ${test4}`);

    // Verificar se são realmente diferentes
    const char1 = "atração";
    const char2 = "atração";
    const areEqual = char1 === char2;
    const length1 = char1.length;
    const length2 = char2.length;

    console.log(`\n🔍 COMPARAÇÃO DIRETA:`);
    console.log(`   "atração" === "atração": ${areEqual}`);
    console.log(`   "atração".length: ${length1}`);
    console.log(`   "atração".length: ${length2}`);

    // Mostrar códigos Unicode das strings de teste
    console.log(`\n🔍 CÓDIGOS UNICODE DAS STRINGS DE TESTE:`);
    console.log(`   "atração":`);
    for (let i = 0; i < char1.length; i++) {
      const char = char1[i];
      const code = char.charCodeAt(0);
      console.log(
        `     '${char}' = U+${code
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")} (${code})`
      );
    }

    console.log(`   "atração":`);
    for (let i = 0; i < char2.length; i++) {
      const char = char2[i];
      const code = char.charCodeAt(0);
      console.log(
        `     '${char}' = U+${code
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")} (${code})`
      );
    }
  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

debugDetection().catch(console.error);

