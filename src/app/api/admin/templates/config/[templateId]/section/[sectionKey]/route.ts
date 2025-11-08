import { NextRequest, NextResponse } from "next/server";
import { templateConfigManager } from "#/modules/ai-generator/config/template-prompts";

// PUT /api/admin/templates/config/[templateId]/section/[sectionKey] - Update section configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; sectionKey: string }> }
) {
  try {
    const { templateId, sectionKey } = await params;
    const body = await request.json();

    if (!templateId || !sectionKey) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and sectionKey are required",
        },
        { status: 400 }
      );
    }

    const success = templateConfigManager.updateSectionConfig(
      templateId,
      sectionKey,
      body
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Template or section not found",
        },
        { status: 404 }
      );
    }

    const updatedConfig = templateConfigManager.getConfig(templateId);

    return NextResponse.json({
      success: true,
      message: "Section configuration updated successfully",
      data: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating section config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update section configuration",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/templates/config/[templateId]/section/[sectionKey] - Get section configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; sectionKey: string }> }
) {
  try {
    const { templateId, sectionKey } = await params;

    if (!templateId || !sectionKey) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and sectionKey are required",
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

    const sectionConfig = (config.sections as Record<string, unknown>)[
      sectionKey
    ];

    if (!sectionConfig) {
      return NextResponse.json(
        {
          success: false,
          error: "Section not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sectionConfig,
    });
  } catch (error) {
    console.error("Error fetching section config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch section configuration",
      },
      { status: 500 }
    );
  }
}
