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
  archivedProjectsCount?: number; // Add archived count to statistics
}

// Valid project statuses - should match your API
type ProjectStatus =
  | "active"
  | "approved"
  | "negotiation"
  | "rejected"
  | "draft"
  | "expired"
  | "archived";

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

interface DuplicateProjectsResponse {
  success: boolean;
  message: string;
  data?: ProjectsDataProps[];
  duplicatedCount?: number;
  error?: string;
}

interface ArchivedProjectsResponse {
  success: boolean;
  data: ProjectsDataProps[];
  pagination: PaginationInfo;
  error?: string;
}

interface UseProjectsReturn {
  projectsData: ProjectsDataProps[];
  archivedProjectsData: ProjectsDataProps[];
  pagination: PaginationInfo | null;
  archivedPagination: PaginationInfo | null;
  statistics: ProjectStatistics | null;
  isInitialLoading: boolean;
  isPaginationLoading: boolean;
  isUpdating: boolean;
  isDuplicating: boolean;
  isLoadingArchived: boolean;
  error: string | null;
  archivedError: string | null;
  currentPage: number;
  archivedCurrentPage: number;
  setCurrentPage: (page: number) => void;
  setArchivedCurrentPage: (page: number) => void;
  refetch: () => void;
  refetchArchived: () => void;
  updateProjectStatus: (
    projectId: string,
    status: ProjectStatus
  ) => Promise<UpdateProjectResponse>;
  updateMultipleProjectsStatus: (
    projectIds: string[],
    status: ProjectStatus
  ) => Promise<UpdateMultipleProjectsResponse>;
  duplicateProjects: (
    projectIds: string[]
  ) => Promise<DuplicateProjectsResponse>;
  fetchArchivedProjects: (page?: number) => Promise<ArchivedProjectsResponse>;
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
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const [archivedProjectsData, setArchivedProjectsData] = useState<
    ProjectsDataProps[]
  >([]);
  const [archivedPagination, setArchivedPagination] =
    useState<PaginationInfo | null>(null);
  const [archivedError, setArchivedError] = useState<string | null>(null);
  const [isLoadingArchived, setIsLoadingArchived] = useState(false);
  const [archivedCurrentPage, setArchivedCurrentPage] = useState(1);

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

  const fetchArchivedProjects = useCallback(
    async (
      page: number = archivedCurrentPage
    ): Promise<ArchivedProjectsResponse> => {
      try {
        setIsLoadingArchived(true);
        setArchivedError(null);

        const response = await fetch(
          `/api/projects/archived?page=${page}&limit=${limit}`
        );
        const result = await response.json();

        if (result.success) {
          setArchivedProjectsData(result.data);
          setArchivedPagination(result.pagination);

          return {
            success: true,
            data: result.data,
            pagination: result.pagination,
          };
        } else {
          setArchivedError(result.error);
          setArchivedProjectsData([]);
          setArchivedPagination(null);

          return {
            success: false,
            data: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalCount: 0,
              limit,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            error: result.error,
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? `Erro ao carregar projetos arquivados. ${err.message}`
            : "Erro desconhecido ao carregar projetos arquivados";

        setArchivedError(errorMessage);
        setArchivedProjectsData([]);
        setArchivedPagination(null);

        return {
          success: false,
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            limit,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          error: errorMessage,
        };
      } finally {
        setIsLoadingArchived(false);
      }
    },
    [archivedCurrentPage, limit]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleArchivedPageChange = useCallback((page: number) => {
    setArchivedCurrentPage(page);
  }, []);

  const refetch = useCallback(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  const refetchArchived = useCallback(() => {
    fetchArchivedProjects(archivedCurrentPage);
  }, [fetchArchivedProjects, archivedCurrentPage]);

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
          if (status === "archived") {
            setProjectsData((prevData) =>
              prevData.filter((project) => project.id !== projectId)
            );

            setStatistics((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    archivedProjectsCount:
                      (prevStats.archivedProjectsCount || 0) + 1,
                  }
                : null
            );
          } else {
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
                      approvedProjectsCount:
                        prevStats.approvedProjectsCount + 1,
                    }
                  : null
              );
            }
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
          if (status === "archived") {
            setProjectsData((prevData) =>
              prevData.filter((project) => !projectIds.includes(project.id))
            );

            // Update statistics
            setStatistics((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    archivedProjectsCount:
                      (prevStats.archivedProjectsCount || 0) +
                      projectIds.length,
                  }
                : null
            );
          } else {
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

  const duplicateProjects = useCallback(
    async (projectIds: string[]): Promise<DuplicateProjectsResponse> => {
      try {
        setIsDuplicating(true);
        setError(null);

        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectIds,
          }),
        });

        const result = await response.json();

        if (result.success) {
          await fetchProjects(currentPage);

          return {
            success: true,
            message: result.message,
            data: result.data,
            duplicatedCount: result.duplicatedCount,
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
            : "Erro desconhecido ao duplicar projetos";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setIsDuplicating(false);
      }
    },
    [fetchProjects, currentPage]
  );

  useEffect(() => {
    if (archivedCurrentPage > 1) {
      fetchArchivedProjects(archivedCurrentPage);
    }
  }, [archivedCurrentPage, fetchArchivedProjects]);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  return {
    projectsData,
    archivedProjectsData,
    pagination,
    archivedPagination,
    statistics,
    isInitialLoading,
    isPaginationLoading,
    isUpdating,
    isDuplicating,
    isLoadingArchived,
    error,
    archivedError,
    currentPage,
    archivedCurrentPage,
    setCurrentPage: handlePageChange,
    setArchivedCurrentPage: handleArchivedPageChange,
    refetch,
    refetchArchived,
    updateProjectStatus,
    updateMultipleProjectsStatus,
    duplicateProjects,
    fetchArchivedProjects,
  };
};
