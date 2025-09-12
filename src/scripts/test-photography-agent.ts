import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

async function testPhotographyAgent() {
  try {
    console.log("🧪 Testing photography agent...");

    // Test flash template
    console.log("\n📸 Testing Flash Template:");
    const flashAgent = await getAgentByServiceAndTemplate(
      "photography",
      "flash"
    );

    if (flashAgent) {
      console.log("✅ Flash agent found!");
      console.log(`   - Name: ${flashAgent.name}`);
      console.log(`   - Sector: ${flashAgent.sector}`);
      console.log(
        `   - System Prompt (first 100 chars): ${flashAgent.systemPrompt.substring(
          0,
          100
        )}...`
      );
      console.log(
        `   - Expertise: ${flashAgent.expertise.slice(0, 3).join(", ")}...`
      );
      console.log(
        `   - Common Services: ${flashAgent.commonServices
          .slice(0, 3)
          .join(", ")}...`
      );
    } else {
      console.log("❌ Flash agent not found!");
    }

    // Test prime template
    console.log("\n📸 Testing Prime Template:");
    const primeAgent = await getAgentByServiceAndTemplate(
      "photography",
      "prime"
    );

    if (primeAgent) {
      console.log("✅ Prime agent found!");
      console.log(`   - Name: ${primeAgent.name}`);
      console.log(`   - Sector: ${primeAgent.sector}`);
      console.log(
        `   - System Prompt (first 100 chars): ${primeAgent.systemPrompt.substring(
          0,
          100
        )}...`
      );
      console.log(
        `   - Expertise: ${primeAgent.expertise.slice(0, 3).join(", ")}...`
      );
      console.log(
        `   - Common Services: ${primeAgent.commonServices
          .slice(0, 3)
          .join(", ")}...`
      );
    } else {
      console.log("❌ Prime agent not found!");
    }

    console.log("\n🎉 Photography agent test completed!");
  } catch (error) {
    console.error("❌ Error testing photography agent:", error);
    throw error;
  }
}

// Run the test
testPhotographyAgent()
  .then(() => {
    console.log("✅ Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test failed:", error);
    process.exit(1);
  });
