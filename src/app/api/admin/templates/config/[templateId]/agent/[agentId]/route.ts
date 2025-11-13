import { NextRequest, NextResponse } from "next/server";
import { templateConfigManager } from "#/modules/ai-generator/config/template-prompts";

// PUT /api/admin/templates/config/[templateId]/agent/[agentId] - Update agent override
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; agentId: string }> }
) {
  try {
    const { templateId, agentId } = await params;
    const body = await request.json();

    if (!templateId || !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and agentId are required",
        },
        { status: 400 }
      );
    }

    const success = templateConfigManager.addAgentOverride(
      templateId,
      agentId,
      body
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    const updatedConfig = templateConfigManager.getConfig(templateId);

    return NextResponse.json({
      success: true,
      message: "Agent override updated successfully",
      data: updatedConfig?.agentOverrides[agentId],
    });
  } catch (error) {
    console.error("Error updating agent override:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update agent override",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/templates/config/[templateId]/agent/[agentId] - Get agent override
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; agentId: string }> }
) {
  try {
    const { templateId, agentId } = await params;

    if (!templateId || !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and agentId are required",
        },
        { status: 400 }
      );
    }

    const config = templateConfigManager.getConfig(templateId);

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    const agentOverride = config.agentOverrides[agentId];

    if (!agentOverride) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent override not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: agentOverride,
    });
  } catch (error) {
    console.error("Error fetching agent override:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agent override",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/templates/config/[templateId]/agent/[agentId] - Remove agent override
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; agentId: string }> }
) {
  try {
    const { templateId, agentId } = await params;

    if (!templateId || !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and agentId are required",
        },
        { status: 400 }
      );
    }

    const config = templateConfigManager.getConfig(templateId);

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    if (config.agentOverrides[agentId]) {
      delete config.agentOverrides[agentId];
    }

    return NextResponse.json({
      success: true,
      message: "Agent override removed successfully",
    });
  } catch (error) {
    console.error("Error removing agent override:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove agent override",
      },
      { status: 500 }
    );
  }
}
