import { notFound } from "next/navigation";
import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";
import { DatabaseAgentConfig } from "#/modules/ai-generator/agents/database-agents";
import { TemplateConfig } from "#/modules/ai-generator/agents/base/template-config";
import AgentEditor from "./components/AgentEditor";

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Forçar revalidação da página a cada 0 segundos (desabilitar cache)
export const revalidate = 0;

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;

  console.log("Debug - AgentPage loading with ID:", id);

  try {
    // Buscar agente diretamente pelo ID
    const agent = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.id, id))
      .limit(1);

    console.log(
      "Debug - Agent loaded:",
      agent[0]
        ? {
            id: agent[0].id,
            name: agent[0].name,
            systemPrompt: agent[0].systemPrompt?.substring(0, 100) + "...",
          }
        : null
    );

    if (!agent[0]) {
      notFound();
    }

    // Converter o agente do banco para o tipo esperado
    const agentData: DatabaseAgentConfig = {
      ...agent[0],
      expertise: Array.isArray(agent[0].expertise)
        ? (agent[0].expertise as string[])
        : [],
      commonServices: Array.isArray(agent[0].commonServices)
        ? (agent[0].commonServices as string[])
        : [],
      proposalStructure: Array.isArray(agent[0].proposalStructure)
        ? (agent[0].proposalStructure as string[])
        : [],
      keyTerms: Array.isArray(agent[0].keyTerms)
        ? (agent[0].keyTerms as string[])
        : [],
      templateConfig: agent[0].templateConfig as TemplateConfig | undefined,
    };

    console.log("Debug - Converted agent data:", {
      id: agentData.id,
      name: agentData.name,
      expertise: agentData.expertise,
      commonServices: agentData.commonServices,
    });

    return <AgentEditor agent={agentData} />;
  } catch (error) {
    console.error("Error loading agent:", error);
    notFound();
  }
}
