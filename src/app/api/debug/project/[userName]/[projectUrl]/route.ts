import { NextRequest, NextResponse } from "next/server";
import { db } from "#/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userName: string; projectUrl: string }> }
) {
  const { userName, projectUrl } = await params;

  console.log("[DEBUG] Buscando projeto:", { userName, projectUrl });

  // Query 1: SEM filtro de deleted_at
  const resultWithoutFilter = await db
    .select({
      id: projectsTable.id,
      projectName: projectsTable.projectName,
      projectUrl: projectsTable.projectUrl,
      deleted_at: projectsTable.deleted_at,
      userName: personUserTable.userName,
    })
    .from(projectsTable)
    .innerJoin(personUserTable, eq(projectsTable.personId, personUserTable.id))
    .where(
      and(
        eq(personUserTable.userName, userName),
        eq(projectsTable.projectUrl, projectUrl)
      )
    )
    .limit(1);

  // Query 2: COM filtro de deleted_at (como está no código)
  const resultWithFilter = await db
    .select({
      id: projectsTable.id,
      projectName: projectsTable.projectName,
      projectUrl: projectsTable.projectUrl,
      deleted_at: projectsTable.deleted_at,
      userName: personUserTable.userName,
    })
    .from(projectsTable)
    .innerJoin(personUserTable, eq(projectsTable.personId, personUserTable.id))
    .where(
      and(
        eq(personUserTable.userName, userName),
        eq(projectsTable.projectUrl, projectUrl),
        isNull(projectsTable.deleted_at)
      )
    )
    .limit(1);

  return NextResponse.json({
    debug: true,
    timestamp: new Date().toISOString(),
    params: { userName, projectUrl },
    results: {
      withoutFilter: {
        found: resultWithoutFilter.length > 0,
        count: resultWithoutFilter.length,
        data: resultWithoutFilter[0] || null,
      },
      withFilter: {
        found: resultWithFilter.length > 0,
        count: resultWithFilter.length,
        data: resultWithFilter[0] || null,
      },
    },
    diagnosis: {
      userNameMatch: resultWithoutFilter[0]?.userName === userName,
      projectUrlMatch: resultWithoutFilter[0]?.projectUrl === projectUrl,
      deleted_at_value: resultWithoutFilter[0]?.deleted_at,
      deleted_at_type: typeof resultWithoutFilter[0]?.deleted_at,
      deleted_at_isNull:
        resultWithoutFilter[0]?.deleted_at === null ||
        resultWithoutFilter[0]?.deleted_at === undefined,
      problem:
        resultWithoutFilter.length > 0 && resultWithFilter.length === 0
          ? "Projeto existe MAS está sendo filtrado pelo deleted_at"
          : resultWithoutFilter.length === 0
            ? "Projeto NÃO EXISTE no banco"
            : "Projeto encontrado com sucesso",
    },
  });
}

