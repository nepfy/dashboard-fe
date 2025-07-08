import { useState, useCallback } from "react";
import { ProposalFormData, TemplateType } from "#/types/project";

interface SaveDraftResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    projectName: string;
  };
  error?: string;
}

export const useSaveDraft = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const saveDraft = useCallback(
    async (
      formData: ProposalFormData,
      templateType: TemplateType | null,
      projectId?: string | null
    ): Promise<SaveDraftResponse> => {
      try {
        setIsSaving(true);

        const idToUse = projectId || currentProjectId;

        const response = await fetch("/api/projects/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            templateType,
            projectId: idToUse,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setLastSaved(new Date());
          if (result.data?.id) {
            setCurrentProjectId(result.data.id);
          }
          return {
            success: true,
            message: result.message,
            data: result.data,
          };
        } else {
          return {
            success: false,
            message: result.error || "Erro ao salvar rascunho",
            error: result.error,
          };
        }
      } catch (error) {
        console.error("Error saving draft:", error);
        return {
          success: false,
          message: "Erro ao salvar rascunho",
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      } finally {
        setIsSaving(false);
      }
    },
    [currentProjectId]
  );

  const setProjectId = useCallback((projectId: string | null) => {
    setCurrentProjectId(projectId);
  }, []);

  const clearDraftData = useCallback(() => {
    setLastSaved(null);
    setCurrentProjectId(null);
  }, []);

  const getLastSavedText = useCallback((): string => {
    if (!lastSaved) return "";

    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastSaved.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Salvo agora mesmo";
    } else if (diffInMinutes < 60) {
      return `Salvo há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `Salvo há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    }
  }, [lastSaved]);

  return {
    saveDraft,
    isSaving,
    lastSaved,
    currentProjectId,
    setProjectId,
    clearDraftData,
    getLastSavedText,
  };
};
