#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function checkUnicode() {
  console.log("🔍 Verificando códigos Unicode...\n");

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

    // Encontrar todas as ocorrências de "atração"
    const atracaoIndexes = [];
    let index = 0;
    while ((index = prompt.indexOf("atração", index)) !== -1) {
      atracaoIndexes.push(index);
      index += 7; // "atração".length
    }

    console.log(
      `\n🔍 Encontradas ${atracaoIndexes.length} ocorrências de "atração":`
    );

    atracaoIndexes.forEach((pos, i) => {
      const context = prompt.substring(Math.max(0, pos - 10), pos + 20);
      console.log(`\n${i + 1}. Posição ${pos}:`);
      console.log(`   Contexto: "...${context}..."`);

      // Mostrar códigos Unicode de cada caractere
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

checkUnicode().catch(console.error);

