import { NextRequest, NextResponse } from "next/server";
import {
  templateConfigManager,
  type TemplateConfig,
} from "#/modules/ai-generator/config/template-config";

// GET /api/admin/templates/config - Get all template configurations
export async function GET() {
  try {
    const configs = templateConfigManager.getAllConfigs();

    return NextResponse.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error("Error fetching template configs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch template configurations",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/templates/config - Create or update template configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, config } = body as {
      templateId: string;
      config: TemplateConfig;
    };

    if (!templateId || !config) {
      return NextResponse.json(
        {
          success: false,
          error: "templateId and config are required",
        },
        { status: 400 }
      );
    }

    templateConfigManager.setConfig(templateId, config);

    return NextResponse.json({
      success: true,
      message: "Template configuration updated successfully",
      data: config,
    });
  } catch (error) {
    console.error("Error updating template config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update template configuration",
      },
      { status: 500 }
    );
  }
}
