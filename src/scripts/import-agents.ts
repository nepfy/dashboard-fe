#!/usr/bin/env tsx
/**
 * Import agents and agent templates from JSON files to the database
 */

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

interface Agent {
  id: string;
  name: string;
  sector: string;
  service_type: string;
  system_prompt: string;
  expertise: string[];
  common_services: string[];
  pricing_model: string;
  proposal_structure: string[];
  key_terms: string[];
  is_active: boolean;
  updated_at: string | null;
  created_at: string;
  deleted_at: string | null;
  template_config: Record<string, unknown> | null;
}

interface AgentTemplate {
  id: string;
  agent_id: string;
  template_type: string;
  introduction_style: string | null;
  about_us_focus: string | null;
  specialties_approach: string | null;
  process_emphasis: string | null;
  investment_strategy: string | null;
  additional_prompt: string | null;
  is_active: boolean;
  updated_at: string | null;
  created_at: string;
  deleted_at: string | null;
}

async function importAgents() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🚀 Starting import process...\n");

  const sql = neon(databaseUrl);

  // Read JSON files from Downloads folder
  const agentsFilePath = path.join(
    process.env.HOME || "",
    "Downloads",
    "Neon Console Agents.json"
  );
  const templatesFilePath = path.join(
    process.env.HOME || "",
    "Downloads",
    "Agent Templates.json"
  );

  if (!fs.existsSync(agentsFilePath)) {
    console.error(`❌ Agents file not found: ${agentsFilePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(templatesFilePath)) {
    console.error(`❌ Templates file not found: ${templatesFilePath}`);
    process.exit(1);
  }

  // Read and parse JSON files
  const agentsData: Agent[] = JSON.parse(
    fs.readFileSync(agentsFilePath, "utf-8")
  );
  const templatesData: AgentTemplate[] = JSON.parse(
    fs.readFileSync(templatesFilePath, "utf-8")
  );

  console.log(`📦 Found ${agentsData.length} agents to import`);
  console.log(`📦 Found ${templatesData.length} agent templates to import\n`);

  let agentsImported = 0;
  let templatesImported = 0;
  let errors = 0;

  // Import agents
  console.log("📝 Importing agents...\n");
  for (const agent of agentsData) {
    try {
      const query = `
        INSERT INTO agents (
          id, name, sector, service_type, system_prompt, 
          expertise, common_services, pricing_model, 
          proposal_structure, key_terms, template_config,
          is_active, updated_at, created_at, deleted_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          sector = EXCLUDED.sector,
          service_type = EXCLUDED.service_type,
          system_prompt = EXCLUDED.system_prompt,
          expertise = EXCLUDED.expertise,
          common_services = EXCLUDED.common_services,
          pricing_model = EXCLUDED.pricing_model,
          proposal_structure = EXCLUDED.proposal_structure,
          key_terms = EXCLUDED.key_terms,
          template_config = EXCLUDED.template_config,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `;

      await sql(query, [
        agent.id,
        agent.name,
        agent.sector,
        agent.service_type,
        agent.system_prompt,
        JSON.stringify(agent.expertise),
        JSON.stringify(agent.common_services),
        agent.pricing_model,
        JSON.stringify(agent.proposal_structure),
        JSON.stringify(agent.key_terms),
        agent.template_config ? JSON.stringify(agent.template_config) : null,
        agent.is_active,
        agent.updated_at,
        agent.created_at,
        agent.deleted_at,
      ]);

      console.log(`✅ Imported agent: ${agent.id}`);
      agentsImported++;
    } catch (error) {
      console.error(`❌ Error importing agent ${agent.id}:`, error);
      errors++;
    }
  }

  console.log(`\n📝 Importing agent templates...\n`);
  // Import agent templates
  for (const template of templatesData) {
    try {
      const query = `
        INSERT INTO agent_templates (
          id, agent_id, template_type, introduction_style,
          about_us_focus, specialties_approach, process_emphasis,
          investment_strategy, additional_prompt, is_active,
          updated_at, created_at, deleted_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        ON CONFLICT (id) 
        DO UPDATE SET
          agent_id = EXCLUDED.agent_id,
          template_type = EXCLUDED.template_type,
          introduction_style = EXCLUDED.introduction_style,
          about_us_focus = EXCLUDED.about_us_focus,
          specialties_approach = EXCLUDED.specialties_approach,
          process_emphasis = EXCLUDED.process_emphasis,
          investment_strategy = EXCLUDED.investment_strategy,
          additional_prompt = EXCLUDED.additional_prompt,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `;

      await sql(query, [
        template.id,
        template.agent_id,
        template.template_type,
        template.introduction_style,
        template.about_us_focus,
        template.specialties_approach,
        template.process_emphasis,
        template.investment_strategy,
        template.additional_prompt,
        template.is_active,
        template.updated_at,
        template.created_at,
        template.deleted_at,
      ]);

      console.log(`✅ Imported template: ${template.id}`);
      templatesImported++;
    } catch (error) {
      console.error(`❌ Error importing template ${template.id}:`, error);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Import Summary:");
  console.log(`✅ Agents imported: ${agentsImported}/${agentsData.length}`);
  console.log(`✅ Templates imported: ${templatesImported}/${templatesData.length}`);
  console.log(`❌ Errors: ${errors}`);
  console.log("=".repeat(50));

  if (errors > 0) {
    console.log("\n⚠️  Some imports failed. Please check the errors above.");
    process.exit(1);
  } else {
    console.log("\n🎉 All data imported successfully!");
    process.exit(0);
  }
}

importAgents().catch((error) => {
  console.error("💥 Fatal error during import:", error);
  process.exit(1);
});

