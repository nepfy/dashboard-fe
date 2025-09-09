#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function findDifferences() {
  console.log("🔍 Procurando diferenças entre as duas versões...\n");

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

    // Encontrar todas as ocorrências de "atração" (incorreto)
    const atracaoIncorrectIndexes = [];
    let index = 0;
    while ((index = prompt.indexOf("atração", index)) !== -1) {
      atracaoIncorrectIndexes.push(index);
      index += 7;
    }

    // Encontrar todas as ocorrências de "atração" (correto)
    const atracaoCorrectIndexes = [];
    index = 0;
    while ((index = prompt.indexOf("atração", index)) !== -1) {
      atracaoCorrectIndexes.push(index);
      index += 7;
    }

    console.log(
      `\n🔍 Encontradas ${atracaoIncorrectIndexes.length} ocorrências de "atração" (incorreto):`
    );
    atracaoIncorrectIndexes.forEach((pos, i) => {
      const context = prompt.substring(Math.max(0, pos - 10), pos + 20);
      console.log(`\n${i + 1}. Posição ${pos}:`);
      console.log(`   Contexto: "...${context}..."`);

      const word = prompt.substring(pos, pos + 7);
      console.log(`   Palavra: "${word}"`);
      console.log(`   Códigos Unicode:`);
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        const code = char.charCodeAt(0);
        console.log(
          `     '${char}' = U+${code
            .toString(16)
            .toUpperCase()
            .padStart(4, "0")} (${code})`
        );
      }
    });

    console.log(
      `\n🔍 Encontradas ${atracaoCorrectIndexes.length} ocorrências de "atração" (correto):`
    );
    atracaoCorrectIndexes.forEach((pos, i) => {
      const context = prompt.substring(Math.max(0, pos - 10), pos + 20);
      console.log(`\n${i + 1}. Posição ${pos}:`);
      console.log(`   Contexto: "...${context}..."`);

      const word = prompt.substring(pos, pos + 7);
      console.log(`   Palavra: "${word}"`);
      console.log(`   Códigos Unicode:`);
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        const code = char.charCodeAt(0);
        console.log(
          `     '${char}' = U+${code
            .toString(16)
            .toUpperCase()
            .padStart(4, "0")} (${code})`
        );
      }
    });
  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

findDifferences().catch(console.error);

