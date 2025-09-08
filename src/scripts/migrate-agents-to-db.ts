import { db } from "#/lib/db";
import { baseServiceAgents } from "#/modules/ai-generator/agents/base/base-agents";
import { flashServiceAgents } from "#/modules/ai-generator/agents/flash/flash-agents";
import { primeServiceAgents } from "#/modules/ai-generator/agents/prime/prime-agents";

// This script migrates all agent configurations from files to database
// Run this once to populate the database with existing agent data

async function migrateAgentsToDatabase() {
  console.log("🚀 Starting agents migration to database...");

  try {
    // Migrate base agents
    console.log("📝 Migrating base agents...");
    for (const [serviceType, agent] of Object.entries(baseServiceAgents)) {
      const agentId = `${serviceType}-base-agent`;

      await db.execute(
        `
        INSERT INTO agents (
          id, name, sector, service_type, system_prompt, 
          expertise, common_services, pricing_model, 
          proposal_structure, key_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          sector = VALUES(sector),
          system_prompt = VALUES(system_prompt),
          expertise = VALUES(expertise),
          common_services = VALUES(common_services),
          pricing_model = VALUES(pricing_model),
          proposal_structure = VALUES(proposal_structure),
          key_terms = VALUES(key_terms),
          updated_at = CURRENT_TIMESTAMP
      `,
        [
          agentId,
          agent.name,
          agent.sector,
          serviceType,
          agent.systemPrompt,
          JSON.stringify(agent.expertise),
          JSON.stringify(agent.commonServices),
          agent.pricingModel,
          JSON.stringify(agent.proposalStructure),
          JSON.stringify(agent.keyTerms),
        ]
      );

      console.log(`✅ Migrated base agent: ${agent.name}`);
    }

    // Migrate flash agents
    console.log("⚡ Migrating flash agents...");
    for (const [agentKey, agent] of Object.entries(flashServiceAgents)) {
      const serviceType = agentKey
        .replace("Flash - ", "")
        .toLowerCase()
        .replace(" ", "-");
      const agentId = `${serviceType}-flash-agent`;

      // Insert base agent data
      await db.execute(
        `
        INSERT INTO agents (
          id, name, sector, service_type, system_prompt, 
          expertise, common_services, pricing_model, 
          proposal_structure, key_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          sector = VALUES(sector),
          system_prompt = VALUES(system_prompt),
          expertise = VALUES(expertise),
          common_services = VALUES(common_services),
          pricing_model = VALUES(pricing_model),
          proposal_structure = VALUES(proposal_structure),
          key_terms = VALUES(key_terms),
          updated_at = CURRENT_TIMESTAMP
      `,
        [
          agentId,
          agent.name,
          agent.sector,
          serviceType,
          agent.systemPrompt,
          JSON.stringify(agent.expertise),
          JSON.stringify(agent.commonServices),
          agent.pricingModel,
          JSON.stringify(agent.proposalStructure),
          JSON.stringify(agent.keyTerms),
        ]
      );

      // Insert flash-specific template data
      if (agent.flashSpecific) {
        await db.execute(
          `
          INSERT INTO agent_templates (
            id, agent_id, template_type, introduction_style,
            about_us_focus, specialties_approach, process_emphasis,
            investment_strategy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            introduction_style = VALUES(introduction_style),
            about_us_focus = VALUES(about_us_focus),
            specialties_approach = VALUES(specialties_approach),
            process_emphasis = VALUES(process_emphasis),
            investment_strategy = VALUES(investment_strategy),
            updated_at = CURRENT_TIMESTAMP
        `,
          [
            `${agentId}-flash`,
            agentId,
            "flash",
            agent.flashSpecific.introductionStyle,
            agent.flashSpecific.aboutUsFocus,
            agent.flashSpecific.specialtiesApproach,
            agent.flashSpecific.processEmphasis,
            agent.flashSpecific.investmentStrategy,
          ]
        );
      }

      console.log(`✅ Migrated flash agent: ${agent.name}`);
    }

    // Migrate prime agents
    console.log("👑 Migrating prime agents...");
    for (const [agentKey, agent] of Object.entries(primeServiceAgents)) {
      const serviceType = agentKey
        .replace("Prime - ", "")
        .toLowerCase()
        .replace(" ", "-");
      const agentId = `${serviceType}-prime-agent`;

      // Insert base agent data
      await db.execute(
        `
        INSERT INTO agents (
          id, name, sector, service_type, system_prompt, 
          expertise, common_services, pricing_model, 
          proposal_structure, key_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          sector = VALUES(sector),
          system_prompt = VALUES(system_prompt),
          expertise = VALUES(expertise),
          common_services = VALUES(common_services),
          pricing_model = VALUES(pricing_model),
          proposal_structure = VALUES(proposal_structure),
          key_terms = VALUES(key_terms),
          updated_at = CURRENT_TIMESTAMP
      `,
        [
          agentId,
          agent.name,
          agent.sector,
          serviceType,
          agent.systemPrompt,
          JSON.stringify(agent.expertise),
          JSON.stringify(agent.commonServices),
          agent.pricingModel,
          JSON.stringify(agent.proposalStructure),
          JSON.stringify(agent.keyTerms),
        ]
      );

      // Insert prime-specific template data
      if (agent.primeSpecific) {
        await db.execute(
          `
          INSERT INTO agent_templates (
            id, agent_id, template_type, introduction_style,
            about_us_focus, specialties_approach, process_emphasis,
            investment_strategy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            introduction_style = VALUES(introduction_style),
            about_us_focus = VALUES(about_us_focus),
            specialties_approach = VALUES(specialties_approach),
            process_emphasis = VALUES(process_emphasis),
            investment_strategy = VALUES(investment_strategy),
            updated_at = CURRENT_TIMESTAMP
        `,
          [
            `${agentId}-prime`,
            agentId,
            "prime",
            agent.primeSpecific.introductionStyle,
            agent.primeSpecific.aboutUsFocus,
            agent.primeSpecific.specialtiesApproach,
            agent.primeSpecific.processEmphasis,
            agent.primeSpecific.investmentStrategy,
          ]
        );
      }

      console.log(`✅ Migrated prime agent: ${agent.name}`);
    }

    console.log("🎉 Migration completed successfully!");
    console.log("📊 Summary:");
    console.log(`- Base agents: ${Object.keys(baseServiceAgents).length}`);
    console.log(`- Flash agents: ${Object.keys(flashServiceAgents).length}`);
    console.log(`- Prime agents: ${Object.keys(primeServiceAgents).length}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAgentsToDatabase()
    .then(() => {
      console.log("✅ Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateAgentsToDatabase };
