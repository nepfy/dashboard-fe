import { NextRequest, NextResponse } from "next/server";
import {
  TemplateType,
  getAgentsByTemplate,
  getAvailableTemplates,
} from "#/modules/ai-generator/agents";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get("template");

    if (template) {
      // Get agents for specific template
      const agents = await getAgentsByTemplate(template as TemplateType);
      return NextResponse.json({ agents });
    } else {
      // Get all agents from all templates
      const availableTemplates = await getAvailableTemplates();
      const allAgents: Record<string, unknown> = {};

      for (const templateType of availableTemplates) {
        const templateAgents = await getAgentsByTemplate(templateType);
        
        // Use template-specific keys to avoid overwriting
        for (const [serviceType, agent] of Object.entries(templateAgents)) {
          const key = `${serviceType}-${templateType}`;
          allAgents[key] = agent;
        }
      }

      return NextResponse.json({ agents: allAgents });
    }
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
