import { db } from "#/lib/db";
import { agentsTable, agentTemplatesTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

async function checkMigrationStatus() {
  try {
    console.log("🔍 Checking migration status...");

    const agentCount = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.isActive, true));
    const templateCount = await db
      .select()
      .from(agentTemplatesTable)
      .where(eq(agentTemplatesTable.isActive, true));

    console.log("📊 Migration Status:");
    console.log(`- Agents migrated: ${agentCount.length}`);
    console.log(`- Templates migrated: ${templateCount.length}`);
    console.log(
      `- Migration successful: ${agentCount.length > 0 ? "✅ YES" : "❌ NO"}`
    );

    if (agentCount.length > 0) {
      console.log("\n🎯 Sample agents:");
      agentCount.slice(0, 3).forEach((agent) => {
        console.log(`  - ${agent.name} (${agent.serviceType})`);
      });
    }
  } catch (error) {
    console.error("❌ Error checking migration:", error);
  }
}

checkMigrationStatus();
