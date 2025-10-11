import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  isValidTemplate,
  getTemplateDisplayName,
} from "#/lib/db/helpers/template-tables";
import { fetchTemplateData } from "#/lib/db/helpers/template-data-fetchers";

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; id: string }> }
) {
  try {
    const { template, id: projectId } = await params;

    // Validate template type
    if (!isValidTemplate(template)) {
      return NextResponse.json(
        {
          success: false,
          error: `Template inválido. Templates válidos: flash, prime, minimal`,
        },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Get the main project
    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.id, projectId),
          eq(projectsTable.personId, userId),
          eq(projectsTable.templateType, template)
        )
      )
      .limit(1);

    if (project.length === 0) {
      const templateDisplayName = getTemplateDisplayName(template);
      return NextResponse.json(
        {
          success: false,
          error: `Projeto ${templateDisplayName} não encontrado`,
        },
        { status: 404 }
      );
    }

    // Fetch template-specific data
    const templateData = await fetchTemplateData(template, projectId);

    return NextResponse.json({
      success: true,
      data: {
        project: project[0],
        template: templateData,
      },
    });
  } catch (error) {
    console.error("Error fetching template project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

