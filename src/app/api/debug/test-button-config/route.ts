import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema/projects";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({
        error: "projectId query parameter is required",
      }, { status: 400 });
    }

    // Try to select a project with button_config
    const project = await db
      .select({
        id: projects.id,
        projectName: projects.projectName,
        buttonConfig: projects.buttonConfig,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({
        error: "Project not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: project[0],
      buttonConfigType: typeof project[0].buttonConfig,
      hasButtonConfig: project[0].buttonConfig !== null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

