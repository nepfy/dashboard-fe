"use server";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "#/lib/db";
import { proposalTemplatesTable } from "#/lib/db/schema/proposal-templates";
import { getPersonIdByEmail } from "#/lib/user";

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

function sanitizeTemplateData(templateData: unknown) {
  if (!templateData || typeof templateData !== "object") {
    return null;
  }

  const clone =
    typeof structuredClone === "function"
      ? structuredClone(templateData)
      : JSON.parse(JSON.stringify(templateData));

  delete (clone as Record<string, unknown>).id;
  delete (clone as Record<string, unknown>).personId;
  delete (clone as Record<string, unknown>).created_at;
  delete (clone as Record<string, unknown>).updated_at;
  delete (clone as Record<string, unknown>).deleted_at;

  return clone;
}

export async function GET() {
  try {
    const personId = await getAuthenticatedPersonId();

    const templates = await db
      .select({
        id: proposalTemplatesTable.id,
        name: proposalTemplatesTable.name,
        description: proposalTemplatesTable.description,
        templateType: proposalTemplatesTable.templateType,
        mainColor: proposalTemplatesTable.mainColor,
        templateData: proposalTemplatesTable.templateData,
        createdAt: proposalTemplatesTable.createdAt,
        updatedAt: proposalTemplatesTable.updatedAt,
      })
      .from(proposalTemplatesTable)
      .where(eq(proposalTemplatesTable.personId, personId))
      .orderBy(desc(proposalTemplatesTable.createdAt));

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const personId = await getAuthenticatedPersonId();
    const body = await request.json();

    const { name, description, templateType, mainColor, templateData } = body;

    if (!name || !templateData) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome do template e dados devem ser fornecidos",
        },
        { status: 400 }
      );
    }

    const sanitizedTemplateData = sanitizeTemplateData(templateData);

    if (!sanitizedTemplateData) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos do template" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(proposalTemplatesTable)
      .values({
        personId,
        name,
        description: description ?? null,
        templateType: templateType ?? null,
        mainColor: mainColor ?? null,
        templateData: sanitizedTemplateData,
      })
      .returning({
        id: proposalTemplatesTable.id,
        name: proposalTemplatesTable.name,
        description: proposalTemplatesTable.description,
        templateType: proposalTemplatesTable.templateType,
        mainColor: proposalTemplatesTable.mainColor,
        templateData: proposalTemplatesTable.templateData,
        createdAt: proposalTemplatesTable.createdAt,
        updatedAt: proposalTemplatesTable.updatedAt,
      });

    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("Error saving template:", error);
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

