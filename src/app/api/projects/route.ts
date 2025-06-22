import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, desc, count, isNotNull, and, inArray, ne } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

const VALID_STATUSES = [
  "active",
  "approved",
  "negotiation",
  "rejected",
  "draft",
  "expired",
  "archived",
] as const;

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

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

    // Count total projects (excluding archived)
    const totalCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      );

    // Count sent projects (excluding archived)
    const sentProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          isNotNull(projectsTable.projectSentDate),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      );

    // Count approved projects (excluding archived)
    const approvedProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          eq(projectsTable.projectStatus, "approved")
        )
      );

    // Count archived projects
    const archivedProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          eq(projectsTable.projectStatus, "archived")
        )
      );

    const totalCount = totalCountResult[0]?.count || 0;
    const sentProjectsCount = sentProjectsCountResult[0]?.count || 0;
    const approvedProjectsCount = approvedProjectsCountResult[0]?.count || 0;
    const archivedProjectsCount = archivedProjectsCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch projects (excluding archived)
    const projects = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      )
      .orderBy(desc(projectsTable.created_at))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      statistics: {
        sentProjectsCount,
        approvedProjectsCount,
        archivedProjectsCount, // Add archived count to statistics
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

async function validateProjectOwnership(
  projectIds: string[],
  userId: string
): Promise<boolean> {
  const ownedProjects = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(
      and(
        inArray(projectsTable.id, projectIds),
        eq(projectsTable.personId, userId)
      )
    );

  return ownedProjects.length === projectIds.length;
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { projectId, status } = body;

    if (!projectId || !status) {
      return NextResponse.json(
        { success: false, error: "ID do projeto e status são obrigatórios" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status inválido. Valores aceitos: ${VALID_STATUSES.join(
            ", "
          )}`,
        },
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

    const isOwner = await validateProjectOwnership([projectId], userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado ou acesso negado" },
        { status: 404 }
      );
    }

    const updatedProject = await db
      .update(projectsTable)
      .set({
        projectStatus: status,
        updated_at: new Date(),
      })
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao atualizar o projeto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status do projeto atualizado com sucesso",
      data: updatedProject[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { projectIds, status } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Lista de IDs dos projetos é obrigatória" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status é obrigatório" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status inválido. Valores aceitos: ${VALID_STATUSES.join(
            ", "
          )}`,
        },
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

    const isOwner = await validateProjectOwnership(projectIds, userId);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Um ou mais projetos não foram encontrados ou acesso negado",
        },
        { status: 404 }
      );
    }

    const updatedProjects = await db
      .update(projectsTable)
      .set({
        projectStatus: status,
        updated_at: new Date(),
      })
      .where(
        and(
          inArray(projectsTable.id, projectIds),
          eq(projectsTable.personId, userId)
        )
      )
      .returning();

    if (updatedProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao atualizar os projetos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedProjects.length} projeto(s) atualizado(s) com sucesso`,
      data: updatedProjects,
      updatedCount: updatedProjects.length,
    });
  } catch (error) {
    console.error("Error updating projects:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { projectIds } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Lista de IDs dos projetos é obrigatória para duplicação",
        },
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

    // Validate project ownership
    const isOwner = await validateProjectOwnership(projectIds, userId);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Um ou mais projetos não foram encontrados ou acesso negado",
        },
        { status: 404 }
      );
    }

    // Get the original projects to duplicate
    const originalProjects = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          inArray(projectsTable.id, projectIds),
          eq(projectsTable.personId, userId)
        )
      );

    if (originalProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhum projeto encontrado para duplicar" },
        { status: 404 }
      );
    }

    const duplicatedProjects = originalProjects.map((project) => ({
      personId: project.personId,
      projectName: `${project.projectName} - Cópia`,
      clientName: project.clientName,
      projectSentDate: null,
      projectValidUntil: project.projectValidUntil,
      projectStatus: "draft",
      projectVisualizationDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const insertedProjects = await db
      .insert(projectsTable)
      .values(duplicatedProjects)
      .returning();

    if (insertedProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao duplicar os projetos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${insertedProjects.length} projeto(s) duplicado(s) com sucesso`,
      data: insertedProjects,
      duplicatedCount: insertedProjects.length,
    });
  } catch (error) {
    console.error("Error duplicating projects:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
