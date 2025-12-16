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

