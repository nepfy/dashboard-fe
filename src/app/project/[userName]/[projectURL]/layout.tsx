import type { Metadata } from "next";
import localFont from "next/font/local";
import { getProjectData } from "#/app/project/services/project-data";

const manrope = localFont({
  src: [
    {
      path: "../../../../../public/fonts/manrope.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../../../public/fonts/manrope.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    userName: string;
    projectURL: string;
  }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { userName, projectURL } = await params;

  const projectData = await getProjectData(userName, projectURL);

  if (!projectData) {
    return {
      title: "Proposta",
      description: "Proposta não encontrada",
    };
  }

  const title = projectData.clientName;
  const description = projectData.companyName || `Detalhes da Proposta`;

  return {
    title: title,
    description: description,
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <div className={`${manrope.variable} font-manrope`}>{children}</div>;
}
