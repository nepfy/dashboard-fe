import { useState, useEffect, useCallback } from "react";

export interface ProjectDetails {
  id: string;
  clientName: string;
  projectName: string;
  projectStatus: string;
  projectValidUntil: Date | null;
  projectSentDate: Date | null;
  projectVisualizationDate: Date | null;
  templateType: string | null;
  mainColor: string | null;
  projectUrl: string | null;
  isPublished: boolean | null;
  proposalData: Record<string, unknown>;
  buttonConfig: Record<string, unknown>;
  created_at: Date;
  updated_at: Date | null;
}

export interface ProjectAdjustment {
  id: string;
  projectId: string;
  type: string;
  description: string;
  status: string;
  clientName: string | null;
  requestedBy: string | null;
  metadata: Record<string, unknown>;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  created_at: Date;
  updated_at: Date | null;
}

interface UseProjectDetailsReturn {
  project: ProjectDetails | null;
  adjustments: ProjectAdjustment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjectDetails(projectId: string): UseProjectDetailsReturn {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [adjustments, setAdjustments] = useState<ProjectAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      const projectResult = await projectResponse.json();

      if (!projectResult.success) {
        throw new Error(projectResult.error || "Erro ao carregar projeto");
      }

      // The API returns an array with one project
      const projectData = projectResult.data[0];
      setProject(projectData);

      // Fetch adjustments
      const adjustmentsResponse = await fetch(
        `/api/projects/${projectId}/adjustments`
      );
      const adjustmentsResult = await adjustmentsResponse.json();

      if (adjustmentsResult.success) {
        setAdjustments(adjustmentsResult.adjustments || []);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar detalhes"
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, fetchProjectDetails]);

  return {
    project,
    adjustments,
    isLoading,
    error,
    refetch: fetchProjectDetails,
  };
}
