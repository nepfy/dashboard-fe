// src/app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // Await params before accessing its properties
    const { id: projectId } = await params;

    // Get the user's person ID
    const personResult = await db
      .select({
        id: personUserTable.id,
      })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress));

    if (!personResult[0]?.id) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = personResult[0].id;

    // Fetch the specific project
    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project[0],
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
