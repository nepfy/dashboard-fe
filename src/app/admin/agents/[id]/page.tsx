import { notFound } from "next/navigation";
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
import AgentEditor from "./components/AgentEditor";

interface AgentPageProps {
  params: {
    id: string;
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  // Extrair service e template do ID (ex: "marketing-flash-agent" -> service: "marketing", template: "flash")
  const idParts = params.id.split("-");
  const template = idParts[idParts.length - 2]; // "flash", "prime", "base"
  const service = idParts.slice(0, -2).join("-"); // "marketing", "marketing-digital", etc.

  if (!template || !service) {
    notFound();
  }

  try {
    const agent = await getAgentByServiceAndTemplate(
      service as any,
      template as any
    );

    if (!agent) {
      notFound();
    }

    return <AgentEditor agent={agent} />;
  } catch (error) {
    console.error("Error loading agent:", error);
    notFound();
  }
}

