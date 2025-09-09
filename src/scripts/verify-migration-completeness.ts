#!/usr/bin/env tsx

import { db } from "#/lib/db";
import {
  getAvailableServices,
  getAvailableTemplates,
} from "#/modules/ai-generator/agents";

async function verifyMigrationCompleteness() {
  console.log("🔍 Verificando completude da migração...\n");

  try {
    // 1. Verificar agentes base
    console.log("📋 Verificando agentes base...");
    const baseAgentsInDb = await db.execute(`
      SELECT id, name, sector, service_type 
      FROM agents 
      WHERE id LIKE '%-base-agent' AND is_active = true
      ORDER BY service_type
    `);

    console.log(`   ✅ ${baseAgentsInDb.rows.length} agentes base encontrados`);

    // 2. Verificar agentes Prime
    console.log("👑 Verificando agentes Prime...");
    const primeAgentsInDb = await db.execute(`
      SELECT id, name, sector, service_type 
      FROM agents 
      WHERE id LIKE '%-prime-agent' AND is_active = true
      ORDER BY service_type
    `);

    console.log(
      `   ✅ ${primeAgentsInDb.rows.length} agentes Prime encontrados`
    );

    // 3. Verificar agentes Flash
    console.log("⚡ Verificando agentes Flash...");
    const flashAgentsInDb = await db.execute(`
      SELECT id, name, sector, service_type 
      FROM agents 
      WHERE id LIKE '%-flash-agent' AND is_active = true
      ORDER BY service_type
    `);

    console.log(
      `   ✅ ${flashAgentsInDb.rows.length} agentes Flash encontrados`
    );

    // 4. Verificar templates
    console.log("🎨 Verificando templates...");
    const templatesInDb = await db.execute(`
      SELECT DISTINCT template_type 
      FROM agent_templates 
      WHERE is_active = true
      ORDER BY template_type
    `);

    console.log(
      `   ✅ ${
        templatesInDb.rows.length
      } templates encontrados: ${templatesInDb.rows
        .map((r: any) => r.template_type)
        .join(", ")}`
    );

    // 5. Verificar serviços disponíveis
    console.log("🔧 Verificando serviços disponíveis...");
    const services = await getAvailableServices();
    console.log(
      `   ✅ ${services.length} serviços disponíveis: ${services.join(", ")}`
    );

    // 6. Verificar templates disponíveis
    console.log("📋 Verificando templates disponíveis...");
    const templates = await getAvailableTemplates();
    console.log(
      `   ✅ ${templates.length} templates disponíveis: ${templates.join(", ")}`
    );

    // Resumo final
    const totalAgents =
      baseAgentsInDb.rows.length +
      primeAgentsInDb.rows.length +
      flashAgentsInDb.rows.length;

    console.log("\n🎯 RESUMO DA MIGRAÇÃO:");
    console.log(`   📊 Total de agentes: ${totalAgents}`);
    console.log(`   🎨 Total de templates: ${templatesInDb.rows.length}`);
    console.log(`   🔧 Total de serviços: ${services.length}`);

    if (totalAgents >= 21 && templatesInDb.rows.length >= 2) {
      console.log(
        "\n✅ MIGRAÇÃO COMPLETA! Todos os dados foram migrados com sucesso."
      );
      console.log("🚀 Sistema funcionando 100% com banco de dados.");
    } else {
      console.log(
        "\n⚠️ MIGRAÇÃO INCOMPLETA! Alguns dados podem estar faltando."
      );
    }
  } catch (error) {
    console.error("❌ Erro ao verificar migração:", error);
  }
}

verifyMigrationCompleteness().catch(console.error);
