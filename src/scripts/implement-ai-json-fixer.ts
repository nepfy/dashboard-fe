import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

async function implementAIJsonFixer() {
  try {
    console.log("🤖 Implementing AI JSON fixer in Flash workflow...");

    // Read the current flash.ts file
    const fs = require("fs");
    const path = require("path");

    const flashFilePath = path.join(
      process.cwd(),
      "src/modules/ai-generator/themes/flash.ts"
    );
    let flashContent = fs.readFileSync(flashFilePath, "utf8");

    // Add AI JSON fixer import and function at the top
    const aiJsonFixerCode = `
import Together from "together-ai";

// Initialize TogetherAI client for JSON fixing
const jsonFixerClient = new Together({ apiKey: process.env.TOGETHER_API_KEY });

/**
 * Uses AI to fix malformed JSON responses
 */
async function fixJsonWithAI(malformedJson: string, expectedStructure: string): Promise<string> {
  try {
    console.log("🤖 Using AI to fix malformed JSON...");
    
    const fixPrompt = \`You are a JSON repair specialist. Fix the following malformed JSON to make it valid and properly formatted.

EXPECTED STRUCTURE:
\${expectedStructure}

MALFORMED JSON TO FIX:
\${malformedJson}

RULES:
1. Fix all JSON syntax errors
2. Remove any extra properties like "_id", "__v", etc.
3. Escape all special characters properly (\\\\n, \\\\", etc.)
4. Remove trailing commas
5. Fix unicode characters in values
6. Ensure all property names are properly quoted
7. Fix any control characters
8. Return ONLY the corrected JSON, no explanations

CORRECTED JSON:\`;

    const response = await jsonFixerClient.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are a JSON repair specialist. Fix malformed JSON to make it valid and properly formatted. Return only the corrected JSON."
        },
        {
          role: "user",
          content: fixPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const fixedJson = response.choices[0]?.message?.content?.trim();
    
    if (!fixedJson) {
      throw new Error("AI failed to return fixed JSON");
    }

    // Validate the fixed JSON
    try {
      JSON.parse(fixedJson);
      console.log("✅ AI successfully fixed the JSON");
      return fixedJson;
    } catch (parseError) {
      console.error("❌ AI-fixed JSON is still invalid:", parseError);
      throw new Error("AI failed to produce valid JSON");
    }

  } catch (error) {
    console.error("❌ Error using AI to fix JSON:", error);
    throw error;
  }
}

/**
 * Enhanced JSON parsing with AI fallback
 */
async function parseJsonWithAIFallback(
  response: string, 
  expectedStructure: string,
  fallbackData: any
): Promise<any> {
  try {
    // First, try normal JSON parsing
    return JSON.parse(response);
  } catch (parseError) {
    console.log("⚠️ JSON parsing failed, using AI to fix...");
    
    try {
      // Use AI to fix the malformed JSON
      const fixedJson = await fixJsonWithAI(response, expectedStructure);
      return JSON.parse(fixedJson);
    } catch (aiError) {
      console.error("❌ AI JSON fixing failed:", aiError);
      console.log("🔄 Using fallback data instead");
      return fallbackData;
    }
  }
}

`;

    // Insert the AI JSON fixer code after the imports
    const importEndIndex = flashContent.lastIndexOf("import");
    const nextLineAfterImports = flashContent.indexOf("\n", importEndIndex) + 1;
    flashContent =
      flashContent.slice(0, nextLineAfterImports) +
      aiJsonFixerCode +
      flashContent.slice(nextLineAfterImports);

    // Update all JSON.parse calls to use the AI fallback
    flashContent = flashContent.replace(
      /parsed = JSON\.parse\(response\);/g,
      `parsed = await parseJsonWithAIFallback(response, \`{
  "title": "string",
  "subtitle": "string", 
  "services": ["string"],
  "validity": "string",
  "buttonText": "string"
}\`, {
  title: \`\${agent.sector} Flash para \${data.projectName}\`,
  subtitle: \`Proposta flash personalizada para \${data.clientName}\`,
  services: agent.commonServices.slice(0, 4) || ["Serviço 1", "Serviço 2", "Serviço 3", "Serviço 4"],
  validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
  buttonText: "Iniciar Projeto Flash"
});`
    );

    // Write the updated file
    fs.writeFileSync(flashFilePath, flashContent);

    console.log("✅ AI JSON fixer implemented in Flash workflow!");
    console.log("📋 Changes made:");
    console.log("   - Added AI JSON fixing functions");
    console.log("   - Updated JSON.parse calls to use AI fallback");
    console.log("   - Added proper error handling");
  } catch (error) {
    console.error("❌ Error implementing AI JSON fixer:", error);
    throw error;
  }
}

// Run the script
implementAIJsonFixer()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
