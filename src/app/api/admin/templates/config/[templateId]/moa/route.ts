import { NextRequest, NextResponse } from "next/server";
import { templateConfigManager } from "#/modules/ai-generator/config/template-prompts";

// PUT /api/admin/templates/config/[templateId]/moa - Update MoA configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    const body = await request.json();

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId is required",
        },
        { status: 400 }
      );
    }

    const success = templateConfigManager.updateMoAConfig(templateId, body);

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
      message: "MoA configuration updated successfully",
      data: updatedConfig?.moa,
    });
  } catch (error) {
    console.error("Error updating MoA config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update MoA configuration",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/templates/config/[templateId]/moa - Get MoA configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId is required",
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

    return NextResponse.json({
      success: true,
      data: config.moa,
    });
  } catch (error) {
    console.error("Error fetching MoA config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch MoA configuration",
      },
      { status: 500 }
    );
  }
}
