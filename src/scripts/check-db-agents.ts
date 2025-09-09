#!/usr/bin/env tsx

import { db } from "#/lib/db";

async function checkDbAgents() {
  console.log("🔍 Verificando agentes no banco de dados...\n");

  try {
    // Listar todos os agentes
    const allAgents = await db.execute(`
      SELECT id, name, sector, service_type, is_active
      FROM agents 
      ORDER BY service_type, id
    `);

    console.log("📋 TODOS OS AGENTES NO BANCO:");
    console.log(`Total: ${allAgents.rows?.length || 0} agentes\n`);

    if (allAgents.rows && allAgents.rows.length > 0) {
      allAgents.rows.forEach((row: any, index: number) => {
        console.log(`${index + 1}. ${row.id}`);
        console.log(`   Nome: ${row.name}`);
        console.log(`   Setor: ${row.sector}`);
        console.log(`   Serviço: ${row.service_type}`);
        console.log(`   Ativo: ${row.is_active ? '✅' : '❌'}`);
        console.log("");
      });
    }

    // Verificar por tipo
    const baseAgents = await db.execute(`
      SELECT COUNT(*) as count FROM agents 
      WHERE id LIKE '%-base-agent' AND is_active = true
    `);

    const primeAgents = await db.execute(`
      SELECT COUNT(*) as count FROM agents 
      WHERE id LIKE '%-prime-agent' AND is_active = true
    `);

    const flashAgents = await db.execute(`
      SELECT COUNT(*) as count FROM agents 
      WHERE id LIKE '%-flash-agent' AND is_active = true
    `);

    console.log("📊 RESUMO POR TIPO:");
    console.log(`  - Agentes Base: ${baseAgents.rows?.[0]?.count || 0}`);
    console.log(`  - Agentes Prime: ${primeAgents.rows?.[0]?.count || 0}`);
    console.log(`  - Agentes Flash: ${flashAgents.rows?.[0]?.count || 0}`);

    // Verificar templates
    const templates = await db.execute(`
      SELECT agent_id, template_type, COUNT(*) as count
      FROM agent_templates 
      WHERE is_active = true
      GROUP BY agent_id, template_type
      ORDER BY template_type, agent_id
    `);

    console.log(`\n📋 TEMPLATES: ${templates.rows?.length || 0} registros`);

    if (templates.rows && templates.rows.length > 0) {
      templates.rows.forEach((row: any) => {
        console.log(`  - ${row.agent_id} (${row.template_type})`);
      });
    }

    console.log("\n✅ Verificação concluída!");

  } catch (error) {
    console.error("❌ Erro ao verificar agentes:", error);
  }
}

checkDbAgents().catch(console.error);

