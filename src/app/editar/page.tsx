"use client";

import { useEffect, useState, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Flash from "./modules/flash";
import Minimal from "./modules/minimal";
import Prime from "./modules/prime";
import { TemplateData } from "#/types/template-data";
import { useEditor } from "./contexts/EditorContext";
import { trackEditorOpened, trackEditorLoadTime } from "#/lib/analytics/track";

export default function EditarPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");
  const templateType = searchParams?.get("templateType");
  const { user } = useUser();

  const { projectData, setProjectData, isLoading, error } = useEditor();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const editorLoadStartTime = useRef<number | null>(null);
  const hasTrackedOpened = useRef(false);

  useEffect(() => {
    if (!projectId) {
      setLocalError("ID do projeto não fornecido");
      setLocalLoading(false);
      return;
    }

    // Track editor opened
    if (!hasTrackedOpened.current && projectId) {
      trackEditorOpened({
        proposal_id: projectId,
        user_id: user?.id,
        workspace_id: user?.id, // Using user ID as workspace ID for now
        template_type: templateType || undefined,
      });
      hasTrackedOpened.current = true;
      editorLoadStartTime.current = Date.now();
    }

    const loadProjectData = async () => {
      try {
        setLocalLoading(true);

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

        // Track editor load time
        if (editorLoadStartTime.current && projectId) {
          const loadTime = Date.now() - editorLoadStartTime.current;
          trackEditorLoadTime({
            duration_ms: loadTime,
            proposal_id: projectId,
          });
        }
      } catch (err) {
        console.error("Error loading project data:", err);
        setLocalError(
          err instanceof Error ? err.message : "Erro ao carregar projeto"
        );
      } finally {
        setLocalLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, templateType, setProjectData, user]);

  if (localLoading || isLoading) {
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

  if (localError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Erro</p>
          <p>{localError || error}</p>
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
    return <Flash />;
  }

  if (projectData.templateType === "minimal") {
    return <Minimal />;
  }

  if (projectData.templateType === "prime") {
    return <Prime />;
  }

  // Fallback for unsupported template types
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Template tipo &quot;{templateType}&quot; não suportado</p>
    </div>
  );
}
