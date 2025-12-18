"use server";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
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

  const record = clone as Record<string, unknown>;
  // Remove identifiers/audit fields that should not be stored inside templateData
  delete record.id;
  delete record.personId;
  delete record.created_at;
  delete record.updated_at;
  delete record.deleted_at;
  delete record.createdAt;
  delete record.updatedAt;

  return clone;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const personId = await getAuthenticatedPersonId();
    const { templateId } = await params;

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
      .where(
        and(
          eq(proposalTemplatesTable.id, templateId),
          eq(proposalTemplatesTable.personId, personId)
        )
      );

    if (templates.length === 0) {
      return NextResponse.json(
        { success: false, error: "Template não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: templates[0] });
  } catch (error) {
    console.error("Error fetching template:", error);
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const personId = await getAuthenticatedPersonId();
    const { templateId } = await params;
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Body inválido" },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      templateType,
      mainColor,
      templateData,
    } = body as {
      name?: unknown;
      description?: unknown;
      templateType?: unknown;
      mainColor?: unknown;
      templateData?: unknown;
    };

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nome do template deve ser fornecido" },
        { status: 400 }
      );
    }

    if (!templateData) {
      return NextResponse.json(
        { success: false, error: "Dados do template devem ser fornecidos" },
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

    const updated = await db
      .update(proposalTemplatesTable)
      .set({
        name: name.trim(),
        description: typeof description === "string" ? description.trim() : null,
        templateType: typeof templateType === "string" ? templateType : null,
        mainColor: typeof mainColor === "string" ? mainColor : null,
        templateData: sanitizedTemplateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(proposalTemplatesTable.id, templateId),
          eq(proposalTemplatesTable.personId, personId)
        )
      )
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

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Template não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error updating template:", error);
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

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const personId = await getAuthenticatedPersonId();
    const { templateId } = await params;

    const deleted = await db
      .delete(proposalTemplatesTable)
      .where(
        and(
          eq(proposalTemplatesTable.id, templateId),
          eq(proposalTemplatesTable.personId, personId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Template não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
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

