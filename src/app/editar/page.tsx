"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Flash from "./modules/flash";
import Prime from "./modules/prime";
import { TemplateData } from "#/types/template-data";

export default function EditarPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");
  const templateType = searchParams?.get("templateType");

  const [projectData, setProjectData] = useState<TemplateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError("ID do projeto não fornecido");
      setIsLoading(false);
      return;
    }

    const loadProjectData = async () => {
      try {
        setIsLoading(true);

        const templateDataResponse = await fetch(`/api/projects/${projectId}`);

        const templateDataResult: {
          success: boolean;
          data?: TemplateData[];
          error?: string;
        } = await templateDataResponse.json();

        if (!templateDataResult.success || !templateDataResult.data) {
          throw new Error(
            templateDataResult.error || "Erro ao carregar dados do template"
          );
        }

        setProjectData(templateDataResult.data[0]);
      } catch (err) {
        console.error("Error loading project data:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao carregar projeto"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, templateType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-7">
          <div className="flex items-center justify-center h-64">
            <LoaderCircle className="animate-spin text-primary-light-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Erro</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  if (projectData.templateType === "flash") {
    return <Flash projectData={projectData} />;
  }

  if (projectData.templateType === "prime") {
    return <Prime {...projectData} />;
  }

  // Fallback for unsupported template types
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Template tipo &quot;{templateType}&quot; não suportado</p>
    </div>
  );
}
