import { notFound } from "next/navigation";
import FlashTemplate from "#/app/project/components/Templates/Flash";
import MinimalTemplate from "#/app/project/components/Templates/Minimal";
import { getProjectData } from "#/app/project/services/project-data";

type ProjectPageProps = {
  params: Promise<{
    userName: string;
    projectUrl: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userName, projectUrl } = await params;

  const projectData = await getProjectData(userName, projectUrl);

  if (!projectData) {
    notFound();
  }

  // Render appropriate template based on templateType
  if (projectData.templateType === "minimal") {
    return <MinimalTemplate data={projectData} />;
  }

  // Default to Flash template
  return (
    <>
      <FlashTemplate data={projectData} />
    </>
  );
}
