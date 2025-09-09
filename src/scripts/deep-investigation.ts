#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function deepInvestigation() {
  console.log("🔍 Investigação profunda dos caracteres...\n");

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
      index += 7;
    }

    console.log(
      `\n🔍 Encontradas ${atracaoIndexes.length} ocorrências de "atração":`
    );

    atracaoIndexes.forEach((pos, i) => {
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

      // Verificar se é igual à string de referência
      const reference = "atração";
      const isEqual = word === reference;
      console.log(`   É igual a "atração": ${isEqual}`);

      if (!isEqual) {
        console.log(`   Diferença encontrada!`);
        console.log(`   Referência: "${reference}"`);
        console.log(`   Códigos da referência:`);
        for (let j = 0; j < reference.length; j++) {
          const char = reference[j];
          const code = char.charCodeAt(0);
          console.log(
            `     '${char}' = U+${code
              .toString(16)
              .toUpperCase()
              .padStart(4, "0")} (${code})`
          );
        }
      }
    });

    // Testar diferentes formas de busca
    console.log(`\n🧪 TESTES DE BUSCA:`);
    console.log(`   prompt.includes("atração"): ${prompt.includes("atração")}`);
    console.log(`   prompt.includes("atração"): ${prompt.includes("atração")}`);
    console.log(`   prompt.indexOf("atração"): ${prompt.indexOf("atração")}`);
    console.log(`   prompt.indexOf("atração"): ${prompt.indexOf("atração")}`);

    // Testar regex
    const regex1 = /atração/g;
    const regex2 = /atração/g;
    const matches1 = prompt.match(regex1) || [];
    const matches2 = prompt.match(regex2) || [];
    console.log(`   regex /atração/g: ${matches1.length} matches`);
    console.log(`   regex /atração/g: ${matches2.length} matches`);
  } catch (error) {
    console.error("❌ Erro na investigação:", error);
  }
}

deepInvestigation().catch(console.error);

