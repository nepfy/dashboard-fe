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

    console.log("Debug - PUT /api/admin/agents/[id] called with:", {
      agentId,
      body: {
        name: body.name,
        sector: body.sector,
        systemPrompt: body.systemPrompt?.substring(0, 100) + "...",
        expertise: body.expertise,
        commonServices: body.commonServices,
        proposalStructure: body.proposalStructure,
        keyTerms: body.keyTerms,
        pricingModel: body.pricingModel,
      },
    });

    // Validar dados básicos
    if (!body.name || !body.sector) {
      console.log("Debug - Validation failed: missing name or sector");
      return NextResponse.json(
        { error: "Nome e setor são obrigatórios" },
        { status: 400 }
      );
    }

    // Atualizar agente no banco
    console.log("Debug - Updating agent in database...");
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

    console.log("Debug - Database update result:", {
      updatedCount: updatedAgent.length,
      updatedAgent: updatedAgent[0]
        ? {
            id: updatedAgent[0].id,
            name: updatedAgent[0].name,
            systemPrompt:
              updatedAgent[0].systemPrompt?.substring(0, 100) + "...",
            updated_at: updatedAgent[0].updated_at,
          }
        : null,
    });

    if (updatedAgent.length === 0) {
      console.log("Debug - No agent found with ID:", agentId);
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    console.log("Debug - Agent updated successfully");
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: agentId } = await params;

    const deletedAgent = await db
      .delete(agentsTable)
      .where(eq(agentsTable.id, agentId))
      .returning();

    if (deletedAgent.length === 0) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Agente removido com sucesso",
      agent: deletedAgent[0],
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
