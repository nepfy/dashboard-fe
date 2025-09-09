#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function findPortugueseErrors() {
  console.log("🔍 Procurando erros de português nos agentes...\n");

  try {
    // Buscar todos os agentes
    const agents = await db.execute(`
      SELECT id, name, system_prompt, expertise, common_services, 
             proposal_structure, key_terms
      FROM agents 
      WHERE is_active = true
      ORDER BY id
    `);

    console.log(`📋 Verificando ${agents.rows.length} agentes...\n`);

    const errors = [];

    for (const agent of agents.rows) {
      const agentErrors = [];

      // Verificar system_prompt
      if (agent.system_prompt) {
        const prompt = agent.system_prompt.toLowerCase();
        
        // "atração" (incorreto) → "atração" (correto)
        if (prompt.includes("atração")) {
          agentErrors.push("❌ 'atração' encontrado em system_prompt");
        }
        
        // "dentro dos próximos 6 semanas" → "dentro das próximas 6 semanas"
        if (prompt.includes("dentro dos próximos") && prompt.includes("semanas")) {
          agentErrors.push("❌ 'dentro dos próximos X semanas' encontrado em system_prompt");
        }
        
        // "mídias influencer" → "mídias de influenciadores"
        if (prompt.includes("mídias influencer")) {
          agentErrors.push("❌ 'mídias influencer' encontrado em system_prompt");
        }
      }

      // Verificar arrays
      const arrays = [
        { name: "expertise", data: agent.expertise },
        { name: "common_services", data: agent.common_services },
        { name: "proposal_structure", data: agent.proposal_structure },
        { name: "key_terms", data: agent.key_terms },
      ];

      for (const array of arrays) {
        if (array.data && Array.isArray(array.data)) {
          for (const item of array.data) {
            if (typeof item === "string") {
              const itemLower = item.toLowerCase();
              
              if (itemLower.includes("atração")) {
                agentErrors.push(`❌ 'atração' encontrado em ${array.name}: "${item}"`);
              }
              
              if (itemLower.includes("dentro dos próximos") && itemLower.includes("semanas")) {
                agentErrors.push(`❌ 'dentro dos próximos X semanas' encontrado em ${array.name}: "${item}"`);
              }
              
              if (itemLower.includes("mídias influencer")) {
                agentErrors.push(`❌ 'mídias influencer' encontrado em ${array.name}: "${item}"`);
              }
            }
          }
        }
      }

      if (agentErrors.length > 0) {
        errors.push({
          agent: agent.name,
          id: agent.id,
          errors: agentErrors,
        });
      }
    }

    if (errors.length === 0) {
      console.log("✅ Nenhum erro de português encontrado!");
    } else {
      console.log(`❌ Encontrados ${errors.length} agentes com erros:\n`);
      
      errors.forEach((agentError, index) => {
        console.log(`${index + 1}. ${agentError.agent} (${agentError.id})`);
        agentError.errors.forEach(error => {
          console.log(`   ${error}`);
        });
        console.log();
      });
    }

  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

findPortugueseErrors().catch(console.error);

