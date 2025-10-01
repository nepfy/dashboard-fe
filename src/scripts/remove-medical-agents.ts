import { db } from "#/lib/db";
import { agentsTable, agentTemplatesTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

async function removeMedicalAgents() {
  try {
    console.log("🔍 Searching for medical agents...");

    // Find all agents with service type 'medical'
    const medicalAgents = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.serviceType, "medical"));

    console.log(
      `Found ${medicalAgents.length} medical agents:`,
      medicalAgents.map((a) => ({ id: a.id, name: a.name }))
    );

    if (medicalAgents.length === 0) {
      console.log("✅ No medical agents found to remove");
      return;
    }

    // Remove agent templates first (due to foreign key constraint)
    for (const agent of medicalAgents) {
      console.log(
        `🗑️ Removing templates for agent: ${agent.name} (${agent.id})`
      );
      await db
        .delete(agentTemplatesTable)
        .where(eq(agentTemplatesTable.agentId, agent.id));
    }

    // Remove the agents
    for (const agent of medicalAgents) {
      console.log(`🗑️ Removing agent: ${agent.name} (${agent.id})`);
      await db.delete(agentsTable).where(eq(agentsTable.id, agent.id));
    }

    console.log(
      "✅ Successfully removed all medical agents and their templates"
    );
  } catch (error) {
    console.error("❌ Error removing medical agents:", error);
    throw error;
  }
}

async function main() {
  try {
    await removeMedicalAgents();
    console.log("🏁 Script completed successfully");
  } catch (error) {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }
}

main();
