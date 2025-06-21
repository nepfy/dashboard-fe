// src/app/api/projects/[id]/copy-link/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq } from "drizzle-orm";
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
        { success: false, error: "Não autorizado" },
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

    // Aguardar os parâmetros antes de usar
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "ID do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar o projeto com join para obter os dados do usuário
    const projectWithUser = await db
      .select({
        projectUrl: projectsTable.projectUrl,
        userName: personUserTable.userName,
        personId: projectsTable.personId,
        userEmail: personUserTable.email,
      })
      .from(projectsTable)
      .innerJoin(
        personUserTable,
        eq(projectsTable.personId, personUserTable.id)
      )
      .where(eq(projectsTable.id, projectId))
      .limit(1);

    if (projectWithUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    const project = projectWithUser[0];

    // Verificar se o usuário logado é o dono do projeto
    if (project.userEmail !== emailAddress) {
      return NextResponse.json(
        { success: false, error: "Acesso negado ao projeto" },
        { status: 403 }
      );
    }

    // Verificar se os dados necessários existem
    if (!project.projectUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "URL do projeto não encontrada. Finalize o projeto primeiro.",
        },
        { status: 400 }
      );
    }

    if (!project.userName) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome de usuário não encontrado. Complete o seu perfil.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        projectUrl: project.projectUrl,
        userName: project.userName,
      },
    });
  } catch (error) {
    console.error("Error fetching project copy link data:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro interno do servidor: ${error}`,
      },
      { status: 500 }
    );
  }
}
