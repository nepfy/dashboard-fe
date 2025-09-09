import { NextRequest, NextResponse } from "next/server";
import { db } from "#/lib/db";
import { agentsTable } from "#/lib/db/schema/agents";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: agentId } = await params;
    const body = await request.json();

    // Validar dados básicos
    if (!body.name || !body.sector) {
      return NextResponse.json(
        { error: "Nome e setor são obrigatórios" },
        { status: 400 }
      );
    }

    // Atualizar agente no banco
    const updatedAgent = await db
      .update(agentsTable)
      .set({
        name: body.name,
        sector: body.sector,
        systemPrompt: body.systemPrompt,
        expertise: body.expertise || [],
        commonServices: body.commonServices || [],
        proposalStructure: body.proposalStructure || [],
        keyTerms: body.keyTerms || [],
        pricingModel: body.pricingModel,
        updated_at: new Date(),
      })
      .where(eq(agentsTable.id, agentId))
      .returning();

    if (updatedAgent.length === 0) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: updatedAgent[0],
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: agentId } = await params;

    const agent = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.id, agentId))
      .limit(1);

    if (agent.length === 0) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ agent: agent[0] });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
