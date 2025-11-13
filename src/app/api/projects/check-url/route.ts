import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { projectsTable } from "#/lib/db/schema/projects";
import { eq, and } from "drizzle-orm";
import { slugify } from "#/lib/slug";

const sanitizeProjectUrl = (value: string): string => slugify(value);

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const projectUrlParam = searchParams.get("projectUrl");

    if (!projectUrlParam) {
      return NextResponse.json(
        { success: false, error: "Parâmetro projectUrl é obrigatório" },
        { status: 400 }
      );
    }

    const projectUrl = sanitizeProjectUrl(projectUrlParam);

    if (projectUrl.length === 0) {
      return NextResponse.json(
        { success: false, error: "projectUrl não pode ser vazio" },
        { status: 400 }
      );
    }

    const [person] = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (!person) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const [existingProject] = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, person.id),
          eq(projectsTable.projectUrl, projectUrl)
        )
      )
      .limit(1);

    return NextResponse.json({ success: true, exists: !!existingProject });
  } catch (error) {
    console.error("Error checking project URL uniqueness", error);
    return NextResponse.json(
      { success: false, error: "Erro ao verificar URL" },
      { status: 500 }
    );
  }
}
