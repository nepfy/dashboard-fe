"use client";

import { useEffect, useState, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Flash from "./modules/flash";
// import Minimal from "./modules/minimal"; // Temporarily disabled
import Prime from "./modules/prime";
import { TemplateData } from "#/types/template-data";
import { useEditor } from "./contexts/EditorContext";
import { trackEditorOpened, trackEditorLoadTime } from "#/lib/analytics/track";
import ProposalActions from "../project/components/ProposalActions";
import Minimal from "./modules/minimal";

export default function EditarPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");
  const templateId = searchParams?.get("templateId");
  const templateType = searchParams?.get("templateType");
  const { user } = useUser();

  const { projectData, setProjectData, setTemplateMode, isLoading, error } =
    useEditor();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const editorLoadStartTime = useRef<number | null>(null);
  const hasTrackedOpened = useRef(false);

  useEffect(() => {
    if (!projectId && !templateId) {
      setLocalError("ID do projeto/template não fornecido");
      setLocalLoading(false);
      return;
    }

    // Template mode: skip proposal analytics (keeps dashboards clean)
    if (templateId) {
      setTemplateMode(templateId);
    } else {
      setTemplateMode(null);

      // Track editor opened (proposals only)
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
    }

    const loadProjectData = async () => {
      try {
        setLocalLoading(true);

        if (templateId) {
          const response = await fetch(`/api/templates/${templateId}`);
          const result: {
            success: boolean;
            data?: {
              templateData: TemplateData;
            };
            error?: string;
          } = await response.json();

          if (!result.success || !result.data?.templateData) {
            throw new Error(result.error || "Erro ao carregar dados do template");
          }

          setProjectData(result.data.templateData);
          return;
        }

        const templateDataResponse = await fetch(`/api/projects/${projectId}`);

        const templateDataResult: {
          success: boolean;
          data?: TemplateData[];
          error?: string;
        } = await templateDataResponse.json();

        if (!templateDataResult.success || !templateDataResult.data) {
          throw new Error(
            templateDataResult.error || "Erro ao carregar dados do projeto"
          );
        }

        setProjectData(templateDataResult.data[0]);

        // Track editor load time (proposals only)
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
  }, [projectId, templateId, templateType, setProjectData, setTemplateMode, user]);

  if (localLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-7">
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle className="text-primary-light-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (localError || error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-2 text-xl font-semibold">Erro</p>
          <p>{localError || error}</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  if (projectData.templateType === "flash") {
    return (
      <>
        <Flash />
        <ProposalActions projectData={projectData} isEditing />
      </>
    );
  }

  if (projectData.templateType === "minimal") {
    // Temporarily disable minimal template editing
    return (
      <>
        <Minimal />
        <ProposalActions projectData={projectData} isEditing />
      </>
    );
  }

  if (projectData.templateType === "prime") {
    return <Prime />;
  }

  // Fallback for unsupported template types
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Template tipo &quot;{templateType}&quot; não suportado</p>
    </div>
  );
}
