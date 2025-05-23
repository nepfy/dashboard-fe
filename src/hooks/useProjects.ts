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

interface UseProjectsReturn {
  projectsData: ProjectsDataProps[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchProjects = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/projects?page=${page}&limit=${limit}`
        );
        const result = await response.json();

        if (result.success) {
          setProjectsData(result.data);
          setPagination(result.pagination);
        } else {
          setError(result.error);
          setProjectsData([]);
          setPagination(null);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Erro ao carregar lista. ${err.message}`);
        } else {
          setError("Erro desconhecido ao carregar projetos");
        }
        setProjectsData([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
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
    isLoading,
    error,
    currentPage,
    setCurrentPage: handlePageChange,
    refetch,
  };
};
