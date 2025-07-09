import { db } from "#/lib/db";
import { eq, ne, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    userName: string;
    projectURL: string;
  }>;
};

async function getProjectData(userName: string, projectUrl: string) {
  try {
    const projectWithUser = await db
      .select({
        id: projectsTable.id,
        projectUrl: projectsTable.projectUrl,
        userName: personUserTable.userName,
      })
      .from(projectsTable)
      .innerJoin(
        personUserTable,
        eq(projectsTable.personId, personUserTable.id)
      )
      .where(
        and(
          eq(personUserTable.userName, userName),
          eq(projectsTable.projectUrl, projectUrl),
          ne(projectsTable.projectStatus, "draft"),
          ne(projectsTable.projectStatus, "archived")
        )
      )
      .limit(1);

    return projectWithUser[0] || null;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userName, projectURL } = await params;

  const projectData = await getProjectData(userName, projectURL);

  if (!projectData) {
    notFound();
  }

  return (
    <div>
      <p> {projectData.id} </p>
      <p> {projectData.userName} </p>
      <p> {projectData.projectUrl} </p>
    </div>
  );
}
