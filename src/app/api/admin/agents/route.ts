import { NextRequest, NextResponse } from "next/server";
import { getAgentsByTemplate, getAvailableTemplates } from "#/modules/ai-generator/agents";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get("template");

    if (template) {
      // Get agents for specific template
      const agents = await getAgentsByTemplate(template as any);
      return NextResponse.json({ agents });
    } else {
      // Get all agents from all templates
      const availableTemplates = await getAvailableTemplates();
      const allAgents: Record<string, any> = {};

      for (const templateType of availableTemplates) {
        const templateAgents = await getAgentsByTemplate(templateType);
        Object.assign(allAgents, templateAgents);
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
