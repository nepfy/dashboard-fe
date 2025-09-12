import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
import { FlashTemplateWorkflow } from "#/modules/ai-generator/themes/flash";

async function testImprovedPrompts() {
  try {
    console.log("🧪 Testing improved JSON prompts...");

    // Get the photography agent
    const agent = await getAgentByServiceAndTemplate("photography", "flash");

    if (!agent) {
      console.log("❌ Agent not found!");
      return;
    }

    console.log("✅ Agent found:", agent.name);

    // Test data
    const testData = {
      selectedService: "photography" as const,
      companyInfo: "Fotógrafo com mais de 10 anos de experiência",
      clientName: "Instituto ABC",
      projectName: "Campanha do mês LGBT",
      projectDescription:
        "Sessão de fotos com diferentes modelos para celebrar o mês LGBT",
      selectedPlans: ["Plano Essencial", "Plano Executivo"],
      planDetails:
        "Plano Essencial: Soluções personalizadas\nPlano Executivo: Soluções personalizadas",
      includeTerms: true,
      includeFAQ: true,
      templateType: "flash" as const,
      mainColor: "#4F21A1",
    };

    console.log("🚀 Testing Flash workflow with improved prompts...");

    const flashWorkflow = new FlashTemplateWorkflow();

    try {
      const result = await flashWorkflow.execute(testData);
      console.log("✅ Flash workflow executed successfully!");
      console.log("📊 Result metadata:", {
        success: result.success,
        templateType: result.templateType,
        agent: result.metadata?.agent,
        generationType: result.metadata?.generationType,
      });

      if (result.data) {
        console.log("📋 Generated sections:");
        console.log("- Introduction:", !!result.data.introduction);
        console.log("- About Us:", !!result.data.aboutUs);
        console.log("- Specialties:", !!result.data.specialties);
        console.log("- Steps:", !!result.data.steps);
        console.log("- Investment:", !!result.data.investment);
        console.log("- Terms:", !!result.data.terms);
        console.log("- FAQ:", !!result.data.faq);
      }
    } catch (error) {
      console.error("❌ Flash workflow failed:", error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testImprovedPrompts()
  .then(() => {
    console.log("🎉 Test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test failed:", error);
    process.exit(1);
  });
