import { db } from "#/lib/db";
import { eq, ne, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

type ProjectPageProps = {
  params: Promise<{
    userName: string;
    projectURL: string;
  }>;
};

async function getProjectData(userName: string, projectUrl: string) {
  try {
    console.log("=== PROJECT PAGE DEBUG ===");
    console.log("Searching for:", { userName, projectUrl });

    const projectWithUser = await db
      .select({
        id: projectsTable.id,
        projectUrl: projectsTable.projectUrl,
        userName: personUserTable.userName,
        projectStatus: projectsTable.projectStatus,
        projectName: projectsTable.projectName,
        clientName: projectsTable.clientName,
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

    console.log("Database query result:", projectWithUser);
    console.log("========================");

    return projectWithUser[0] || null;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Get headers to see what middleware passed
  const headersList = await headers();
  const xSubdomain = headersList.get("x-subdomain");
  const xUsername = headersList.get("x-username");
  const xProjectUrl = headersList.get("x-project-url");

  console.log("=== PROJECT PAGE HEADERS ===");
  console.log("x-subdomain:", xSubdomain);
  console.log("x-username:", xUsername);
  console.log("x-project-url:", xProjectUrl);
  console.log("===========================");

  const { userName, projectURL } = await params;

  console.log("=== PROJECT PAGE PARAMS ===");
  console.log("userName from params:", userName);
  console.log("projectURL from params:", projectURL);
  console.log("===========================");

  const projectData = await getProjectData(userName, projectURL);

  if (!projectData) {
    console.log("Project not found, calling notFound()");
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Project Found!</h1>
      <div className="space-y-2">
        <p>
          <strong>Project ID:</strong> {projectData.id}
        </p>
        <p>
          <strong>Project Name:</strong> {projectData.projectName}
        </p>
        <p>
          <strong>Client Name:</strong> {projectData.clientName}
        </p>
        <p>
          <strong>User Name:</strong> {projectData.userName}
        </p>
        <p>
          <strong>Project URL:</strong> {projectData.projectUrl}
        </p>
        <p>
          <strong>Status:</strong> {projectData.projectStatus}
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Debug Info:</h2>
        <p>
          Middleware passed: {xUsername}-{xProjectUrl}
        </p>
        <p>
          Page params: {userName}-{projectURL}
        </p>
      </div>
    </div>
  );
}
