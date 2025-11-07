import { notFound } from "next/navigation";
import FlashTemplate from "#/app/project/components/Templates/Flash";
import { getProjectData } from "#/app/project/services/project-data";

type ProjectPageProps = {
  params: Promise<{
    userName: string;
    projectURL: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userName, projectURL } = await params;

  const projectData = await getProjectData(userName, projectURL);
  console.log("projectData", projectData?.proposalData?.plans);

  if (!projectData) {
    notFound();
  }

  return (
    <>
      <FlashTemplate data={projectData} />
    </>
  );
}
