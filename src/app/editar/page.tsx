"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Flash from "./modules/flash";
import Prime from "./modules/prime";
import {
  Project,
  FlashProjectData,
  PrimeProjectData,
} from "#/types/template-data";

// Type guard functions
function isFlashProjectData(
  data: FlashProjectData | PrimeProjectData
): data is FlashProjectData {
  return data.project.templateType === "flash";
}

function isPrimeProjectData(
  data: FlashProjectData | PrimeProjectData
): data is PrimeProjectData {
  return data.project.templateType === "prime";
}

export default function EditarPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");

  const [projectData, setProjectData] = useState<
    FlashProjectData | PrimeProjectData | null
  >(null);
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

        const projectResponse = await fetch(`/api/projects/${projectId}`);
        const projectResult: { success: boolean; data?: Project; error?: string } =
          await projectResponse.json();

        if (!projectResult.success || !projectResult.data) {
          throw new Error(projectResult.error || "Erro ao carregar projeto");
        }

        const templateType = projectResult.data.templateType;

        let templateDataResponse: Response;
        if (templateType === "flash") {
          templateDataResponse = await fetch(`/api/flash/${projectId}`);
        } else if (templateType === "prime") {
          templateDataResponse = await fetch(`/api/prime/${projectId}`);
        } else {
          throw new Error(`Template tipo "${templateType}" não suportado`);
        }

        const templateDataResult: {
          success: boolean;
          data?: FlashProjectData | PrimeProjectData;
          error?: string;
        } = await templateDataResponse.json();

        if (!templateDataResult.success || !templateDataResult.data) {
          throw new Error(
            templateDataResult.error || "Erro ao carregar dados do template"
          );
        }

        setProjectData(templateDataResult.data);
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
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando projeto...</p>
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

  // Render the appropriate template based on templateType with type guards
  const templateType = projectData.project.templateType;

  if (isFlashProjectData(projectData)) {
    return <Flash projectData={projectData} />;
  }

  if (isPrimeProjectData(projectData)) {
    return <Prime projectData={projectData} />;
  }

  // Fallback for unsupported template types
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Template tipo &quot;{templateType}&quot; não suportado</p>
    </div>
  );
}
