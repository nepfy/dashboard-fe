import Together from "together-ai";

// Initialize TogetherAI client
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

/**
 * Uses AI to fix malformed JSON responses
 */
export async function fixJsonWithAI(malformedJson: string, expectedStructure: string): Promise<string> {
  try {
    console.log("🤖 Using AI to fix malformed JSON...");
    
    const fixPrompt = `You are a JSON repair specialist. Fix the following malformed JSON to make it valid and properly formatted.

EXPECTED STRUCTURE:
${expectedStructure}

MALFORMED JSON TO FIX:
${malformedJson}

RULES:
1. Fix all JSON syntax errors
2. Remove any extra properties like "_id", "__v", etc.
3. Escape all special characters properly (\\n, \\", etc.)
4. Remove trailing commas
5. Fix unicode characters in values (like \\u00A3 should be £)
6. Ensure all property names are properly quoted
7. Fix any control characters
8. Return ONLY the corrected JSON, no explanations

CORRECTED JSON:`;

    const response = await client.chat.completions.create({
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
      temperature: 0.1, // Low temperature for consistent JSON formatting
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
export async function parseJsonWithAIFallback(
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

// Test the AI JSON fixer
async function testAIJsonFixer() {
  const malformedJson = `{
  "title": "Campanha do Mês LGBT - Investimento Comprovado",
  "deliverables": [
    {
      "title": "Sessões de Fotos Exclusivas",
      "description": "Obtenham sessões exclusivas de fotos com diferentes modelos de diferentes lugares para celebrar o mês LGBT"
    }
  ],
  "plans": [
    {
      "title": "Plano Essencial",
      "description": "- Sessão única de fotos com modelo;
        - Reprodução digital dos arquivos;
        - Acessibilidade às mídias sociais.",
      "value": "\u00A3999,90",
      "topics": ["Experiência Profissional", "+4 horas no dia da foto; ",]
    },
     {
      	"title":"PLANO EXECUTIVO",
	"description":" +Sessões extras por R\$:550 \n+Produção vídeo curta incluindo áudio;\n+Acesso premium nas redes ",
"value ":"\u0050\u00201.799 ,90 "
,
  	"topics":["Oportunidade","Conhecer novas pessoas ","Fazer amizades"]
}
] }`;

  const expectedStructure = `{
  "title": "string",
  "deliverables": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "plans": [
    {
      "title": "string",
      "description": "string",
      "value": "string",
      "topics": ["string"]
    }
  ]
}`;

  const fallbackData = {
    title: "Investimento Flash - Resultados Rápidos",
    deliverables: [
      {
        title: "Projeto Completo",
        description: "Solução completa entregue no prazo estabelecido"
      }
    ],
    plans: [
      {
        title: "Flash Básico",
        description: "Solução essencial com entrega rápida",
        value: "R$ 999",
        topics: ["Entrega em 7 dias", "Suporte básico"]
      }
    ]
  };

  try {
    console.log("🧪 Testing AI JSON fixer...");
    const result = await parseJsonWithAIFallback(malformedJson, expectedStructure, fallbackData);
    console.log("✅ Success! Fixed JSON:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAIJsonFixer()
    .then(() => {
      console.log("🎉 Test completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test failed:", error);
      process.exit(1);
    });
}
