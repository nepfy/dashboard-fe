#!/usr/bin/env tsx
/**
 * Verify agents and agent templates in the database
 */

import { neon } from "@neondatabase/serverless";

async function verifyAgents() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔍 Verifying agents in database...\n");

  const sql = neon(databaseUrl);

  // Count agents
  const agentsCount = await sql`SELECT COUNT(*) as count FROM agents`;
  console.log(`📊 Total agents: ${agentsCount[0].count}`);

  // Count agent templates
  const templatesCount = await sql`SELECT COUNT(*) as count FROM agent_templates`;
  console.log(`📊 Total agent templates: ${templatesCount[0].count}`);

  // Show agents by service type
  const agentsByService = await sql`
    SELECT service_type, COUNT(*) as count 
    FROM agents 
    GROUP BY service_type 
    ORDER BY service_type
  `;
  
  console.log("\n📋 Agents by service type:");
  agentsByService.forEach((row) => {
    console.log(`  - ${row.service_type}: ${row.count}`);
  });

  // Show templates by template type
  const templatesByType = await sql`
    SELECT template_type, COUNT(*) as count 
    FROM agent_templates 
    GROUP BY template_type 
    ORDER BY template_type
  `;
  
  console.log("\n📋 Templates by type:");
  templatesByType.forEach((row) => {
    console.log(`  - ${row.template_type}: ${row.count}`);
  });

  // Sample some agents
  const sampleAgents = await sql`
    SELECT id, name, service_type, is_active 
    FROM agents 
    LIMIT 5
  `;
  
  console.log("\n📝 Sample agents:");
  sampleAgents.forEach((agent) => {
    console.log(`  - ${agent.id} (${agent.service_type}) - Active: ${agent.is_active}`);
  });

  console.log("\n✅ Verification complete!");
}

verifyAgents().catch((error) => {
  console.error("💥 Fatal error during verification:", error);
  process.exit(1);
});

