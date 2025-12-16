"use server";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { proposalTemplatesTable } from "#/lib/db/schema/proposal-templates";
import { getPersonIdByEmail } from "#/lib/user";
import { prepareProjectSlug } from "#/lib/project-slug";
import type { ProposalData as ProjectProposalData } from "#/types/proposal-data";
import type { ProposalData as TemplateProposalData } from "#/types/template-data";

async function getAuthenticatedPersonId() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const emailAddress = user.emailAddresses[0]?.emailAddress;
  if (!emailAddress) {
    throw new Error("Email not found");
  }

  const personId = await getPersonIdByEmail(emailAddress);
  if (!personId) {
    throw new Error("Person record not found");
  }

  return personId;
}

function parseDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(request: Request) {
  try {
    const personId = await getAuthenticatedPersonId();
    const body = await request.json();

    const {
      templateId,
      clientName,
      projectName,
      originalPageUrl,
      pagePassword,
      validUntil,
    } = body;

    if (!templateId || !clientName || !projectName) {
      return NextResponse.json(
        {
          success: false,
          error: "Template, nome do cliente e nome do projeto são obrigatórios",
        },
        { status: 400 }
      );
    }

    const [templateRecord] = await db
      .select()
      .from(proposalTemplatesTable)
      .where(
        and(
          eq(proposalTemplatesTable.id, templateId),
          eq(proposalTemplatesTable.personId, personId)
        )
      )
      .limit(1);

    if (!templateRecord || !templateRecord.templateData?.proposalData) {
      return NextResponse.json(
        { success: false, error: "Template não encontrado" },
        { status: 404 }
      );
    }

    const slug = await prepareProjectSlug({
      userId: personId,
      desiredSlug: originalPageUrl,
      fallbackValue: clientName,
    });

    // Convert template ProposalData to project ProposalData format
    // The template type doesn't have buttonTitle in introduction, but project type requires it
    const templateProposalData = templateRecord.templateData
      .proposalData as unknown as TemplateProposalData;
    const projectProposalData: ProjectProposalData = {
      ...templateProposalData,
      introduction: templateProposalData.introduction
        ? {
            ...templateProposalData.introduction,
            buttonTitle:
              (
                templateProposalData.introduction as unknown as {
                  buttonTitle?: string;
                }
              ).buttonTitle || "Entre em contato",
          }
        : undefined,
    } as unknown as ProjectProposalData;

    const [createdProject] = await db
      .insert(projectsTable)
      .values({
        personId,
        clientName,
        projectName,
        projectStatus: "draft",
        projectSentDate: null,
        projectValidUntil: parseDate(validUntil),
        projectVisualizationDate: null,
        templateType: templateRecord.templateType,
        mainColor: templateRecord.mainColor,
        projectUrl: slug,
        pagePassword: pagePassword || null,
        isPublished: false,
        isProposalGenerated: true,
        proposalData: projectProposalData,
        buttonConfig: templateRecord.templateData.buttonConfig || null,
        viewCount: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: createdProject,
    });
  } catch (error) {
    console.error("Error creating project from template:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
