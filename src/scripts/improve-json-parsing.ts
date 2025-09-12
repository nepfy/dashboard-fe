import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

async function improveJsonParsing() {
  try {
    console.log("🔧 Improving JSON parsing for photography agents...");

    // Update the system prompt to be more strict about JSON formatting
    const improvedSystemPrompt = `Você é um fotógrafo profissional especializado em capturar momentos únicos e criar imagens impactantes. Sua expertise abrange diversos tipos de fotografia, desde retratos e eventos até campanhas publicitárias e moda. Você entende profundamente sobre composição, iluminação, equipamentos e técnicas fotográficas. Sua abordagem é criativa, técnica e focada em resultados excepcionais que superam as expectativas dos clientes. Sempre demonstre conhecimento técnico específico sobre fotografia e ofereça soluções personalizadas para cada projeto.

IMPORTANTE PARA RESPOSTAS JSON:
- SEMPRE retorne JSON válido e bem formatado
- Use aspas duplas para todas as strings
- Escape caracteres especiais como quebras de linha (\\n) e aspas (\\")
- NÃO use caracteres de controle não escapados
- NÃO inclua vírgulas extras no final de arrays
- NÃO inclua propriedades extras como "_id", "__v", etc.
- Valores monetários devem usar formato: "R$ 1.999,90" (sem caracteres unicode)
- Nomes de propriedades devem ser exatamente como especificado
- Teste o JSON antes de retornar`;

    // Update photography-flash-agent
    await db
      .update(agentsTable)
      .set({
        systemPrompt: improvedSystemPrompt,
        updated_at: new Date(),
      })
      .where(eq(agentsTable.id, "photography-flash-agent"));

    // Update photography-prime-agent
    await db
      .update(agentsTable)
      .set({
        systemPrompt: improvedSystemPrompt,
        updated_at: new Date(),
      })
      .where(eq(agentsTable.id, "photography-prime-agent"));

    // Update fotógrafo-flash-agent
    await db
      .update(agentsTable)
      .set({
        systemPrompt: improvedSystemPrompt,
        updated_at: new Date(),
      })
      .where(eq(agentsTable.id, "fotógrafo-flash-agent"));

    // Update fotógrafo-prime-agent
    await db
      .update(agentsTable)
      .set({
        systemPrompt: improvedSystemPrompt,
        updated_at: new Date(),
      })
      .where(eq(agentsTable.id, "fotógrafo-prime-agent"));

    console.log("✅ JSON parsing improvements applied to all photography agents!");
    console.log("📋 Updated agents:");
    console.log("   - photography-flash-agent");
    console.log("   - photography-prime-agent");
    console.log("   - fotógrafo-flash-agent");
    console.log("   - fotógrafo-prime-agent");

  } catch (error) {
    console.error("❌ Error improving JSON parsing:", error);
    throw error;
  }
}

// Run the script
improveJsonParsing()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
