import { notFound } from "next/navigation";
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
import {
  ServiceType,
  TemplateType,
} from "#/modules/ai-generator/agents/base/types";
import AgentEditor from "./components/AgentEditor";

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  // Extrair service e template do ID (ex: "marketing-flash-agent" -> service: "marketing", template: "flash")
  const { id } = await params;
  const idParts = id.split("-");
  const template = idParts[idParts.length - 2]; // "flash", "prime", "base"
  const service = idParts.slice(0, -2).join("-"); // "marketing", "marketing-digital", etc.

  if (!template || !service) {
    notFound();
  }

  try {
    const agent = await getAgentByServiceAndTemplate(
      service as ServiceType,
      template as TemplateType
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
