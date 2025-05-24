import { useState, useEffect, useCallback } from "react";
import { ProjectsDataProps } from "#/app/dashboard/propostas/components/ProjectsTable/types";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProjectStatistics {
  sentProjectsCount: number;
  approvedProjectsCount: number;
}

type ProjectStatus =
  | "active"
  | "approved"
  | "negotiation"
  | "rejected"
  | "draft"
  | "expired";

interface UpdateProjectResponse {
  success: boolean;
  message: string;
  data?: ProjectsDataProps;
  error?: string;
}

interface UpdateMultipleProjectsResponse {
  success: boolean;
  message: string;
  data?: ProjectsDataProps[];
  updatedCount?: number;
  error?: string;
}

interface UseProjectsReturn {
  projectsData: ProjectsDataProps[];
  pagination: PaginationInfo | null;
  statistics: ProjectStatistics | null;
  isInitialLoading: boolean;
  isPaginationLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
  updateProjectStatus: (
    projectId: string,
    status: ProjectStatus
  ) => Promise<UpdateProjectResponse>;
  updateMultipleProjectsStatus: (
    projectIds: string[],
    status: ProjectStatus
  ) => Promise<UpdateMultipleProjectsResponse>;
}

export const useProjects = (
  initialPage: number = 1,
  limit: number = 10
): UseProjectsReturn => {
  const [projectsData, setProjectsData] = useState<ProjectsDataProps[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [statistics, setStatistics] = useState<ProjectStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const fetchProjects = useCallback(
    async (page: number) => {
      try {
        setError(null);

        if (!hasInitiallyLoaded) {
          setIsInitialLoading(true);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await fetch(
          `/api/projects?page=${page}&limit=${limit}`
        );
        const result = await response.json();

        if (result.success) {
          setProjectsData(result.data);
          setPagination(result.pagination);
          setStatistics(result.statistics);
        } else {
          setError(result.error);
          setProjectsData([]);
          setPagination(null);
          setStatistics(null);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Erro ao carregar lista. ${err.message}`);
        } else {
          setError("Erro desconhecido ao carregar projetos");
        }
        setProjectsData([]);
        setPagination(null);
        setStatistics(null);
      } finally {
        setIsInitialLoading(false);
        setIsPaginationLoading(false);
        setHasInitiallyLoaded(true);
      }
    },
    [limit, hasInitiallyLoaded]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refetch = useCallback(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  const updateProjectStatus = useCallback(
    async (
      projectId: string,
      status: ProjectStatus
    ): Promise<UpdateProjectResponse> => {
      try {
        setIsUpdating(true);
        setError(null);

        const response = await fetch("/api/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            status,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setProjectsData((prevData) =>
            prevData.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    projectStatus: status,
                    updated_at: new Date().toISOString(),
                  }
                : project
            )
          );

          if (status === "approved") {
            setStatistics((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    approvedProjectsCount: prevStats.approvedProjectsCount + 1,
                  }
                : null
            );
          }

          return {
            success: true,
            message: result.message,
            data: result.data,
          };
        } else {
          setError(result.error);
          return {
            success: false,
            message: result.error,
            error: result.error,
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao atualizar projeto";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const updateMultipleProjectsStatus = useCallback(
    async (
      projectIds: string[],
      status: ProjectStatus
    ): Promise<UpdateMultipleProjectsResponse> => {
      try {
        setIsUpdating(true);
        setError(null);

        const response = await fetch("/api/projects", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectIds,
            status,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setProjectsData((prevData) =>
            prevData.map((project) =>
              projectIds.includes(project.id)
                ? {
                    ...project,
                    projectStatus: status,
                    updated_at: new Date().toISOString(),
                  }
                : project
            )
          );

          if (status === "approved") {
            setStatistics((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    approvedProjectsCount:
                      prevStats.approvedProjectsCount + projectIds.length,
                  }
                : null
            );
          }

          return {
            success: true,
            message: result.message,
            data: result.data,
            updatedCount: result.updatedCount,
          };
        } else {
          setError(result.error);
          return {
            success: false,
            message: result.error,
            error: result.error,
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao atualizar projetos";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  return {
    projectsData,
    pagination,
    statistics,
    isInitialLoading,
    isPaginationLoading,
    isUpdating,
    error,
    currentPage,
    setCurrentPage: handlePageChange,
    refetch,
    updateProjectStatus,
    updateMultipleProjectsStatus,
  };
};
