import { notFound } from "next/navigation";
import FlashTemplate from "#/app/project/components/Templates/Flash";
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

  return (
    <>
      <FlashTemplate data={projectData} />
    </>
  );
}
