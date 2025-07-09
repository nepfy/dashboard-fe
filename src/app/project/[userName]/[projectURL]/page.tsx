import { db } from "#/lib/db";
import { eq, ne, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    userName: string;
    projectUrl: string;
  }>;
};

async function getProjectData(userName: string, projectUrl: string) {
  try {
    const projectWithUser = await db
      .select({
        id: projectsTable.id,
        projectUrl: projectsTable.projectUrl,
        userName: personUserTable.userName,
        // Add more fields as needed
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
  const { userName, projectUrl } = await params;

  const projectData = await getProjectData(userName, projectUrl);

  if (!projectData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Projeto: {projectData.projectUrl}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Criado por:{" "}
            <span className="font-semibold">{projectData.userName}</span>
          </p>
          <p className="text-sm text-gray-500">
            ID do Projeto: {projectData.id}
          </p>

          {/* Add your project content here */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Conteúdo do Projeto</h2>
            {/* Your project display logic goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
