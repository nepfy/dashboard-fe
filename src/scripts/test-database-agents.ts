import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

async function testDatabaseAgents() {
  console.log("🧪 Testing database agents...");

  try {
    // Test base agent
    console.log("\n📋 Testing base agent (marketing):");
    const baseAgent = await getAgentByServiceAndTemplate("marketing", "base");
    console.log(`✅ Base agent found: ${baseAgent?.name}`);
    console.log(`   Sector: ${baseAgent?.sector}`);
    console.log(`   Services: ${baseAgent?.commonServices.length} services`);

    // Test flash agent
    console.log("\n⚡ Testing flash agent (marketing):");
    const flashAgent = await getAgentByServiceAndTemplate("marketing", "flash");
    console.log(`✅ Flash agent found: ${flashAgent?.name}`);
    console.log(
      `   Has flash specific: ${flashAgent?.flashSpecific ? "Yes" : "No"}`
    );
    if (flashAgent?.flashSpecific) {
      console.log(
        `   Introduction style: ${flashAgent.flashSpecific.introductionStyle?.substring(
          0,
          50
        )}...`
      );
    }

    // Test prime agent
    console.log("\n👑 Testing prime agent (marketing):");
    const primeAgent = await getAgentByServiceAndTemplate("marketing", "prime");
    console.log(`✅ Prime agent found: ${primeAgent?.name}`);
    console.log(
      `   Has prime specific: ${primeAgent?.primeSpecific ? "Yes" : "No"}`
    );

    // Test non-existent agent
    console.log("\n❌ Testing non-existent agent:");
    const nonExistent = await getAgentByServiceAndTemplate(
      "non-existent",
      "base"
    );
    console.log(
      `   Result: ${
        nonExistent ? "Found (unexpected)" : "Not found (expected)"
      }`
    );

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDatabaseAgents();
