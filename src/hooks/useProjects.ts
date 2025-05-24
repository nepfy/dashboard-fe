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

interface UseProjectsReturn {
  projectsData: ProjectsDataProps[];
  pagination: PaginationInfo | null;
  statistics: ProjectStatistics | null;
  isInitialLoading: boolean; // For first render
  isPaginationLoading: boolean; // For pagination changes
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
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
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const fetchProjects = useCallback(
    async (page: number) => {
      try {
        setError(null);

        // Set appropriate loading state
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
          console.log("result", result.data);
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
        // Clear both loading states
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

  useEffect(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  return {
    projectsData,
    pagination,
    statistics,
    isInitialLoading,
    isPaginationLoading,
    error,
    currentPage,
    setCurrentPage: handlePageChange,
    refetch,
  };
};
