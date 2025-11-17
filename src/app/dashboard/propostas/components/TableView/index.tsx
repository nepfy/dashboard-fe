import { useEffect } from "react";
import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";

import ErrorMessage from "#/components/ErrorMessage";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";
import { useProjects } from "#/hooks/useProjectGenerator/useProjects";

interface TableViewProps {
  viewMode: "active" | "archived";
}

export default function TableView({ viewMode }: TableViewProps) {
  const {
    projectsData,
    archivedProjectsData,
    pagination,
    archivedPagination,
    isPaginationLoading,
    isInitialLoading,
    isLoadingArchived,
    isUpdating,
    isDuplicating,
    error,
    archivedError,
    setCurrentPage,
    setArchivedCurrentPage,
    updateProjectStatus,
    updateMultipleProjectsStatus,
    duplicateProjects,
    fetchArchivedProjects,
    refetch,
    refetchArchived,
  } = useProjects(1, 10);

  useEffect(() => {
    if (viewMode === "archived" && archivedProjectsData.length === 0) {
      fetchArchivedProjects(1);
    }
  }, [viewMode, archivedProjectsData.length, fetchArchivedProjects]);

  const handleRefresh = async () => {
    await refetch();
    await refetchArchived();
  };

  const handleBulkStatusUpdate = async (
    projectIds: string[],
    status: string
  ) => {
    try {
      const result = await updateMultipleProjectsStatus(
        projectIds,
        status as
          | "active"
          | "approved"
          | "negotiation"
          | "rejected"
          | "draft"
          | "expired"
          | "archived"
      );

      if (result.success) {
        console.log(`Successfully updated ${result.updatedCount} projects`);
      } else {
        throw new Error(result.error || "Failed to update projects");
      }
    } catch (error) {
      console.error("Bulk update failed:", error);
      throw error;
    }
  };

  const handleStatusUpdate = async (projectId: string, status: string) => {
    try {
      const result = await updateProjectStatus(
        projectId,
        status as
          | "active"
          | "approved"
          | "negotiation"
          | "rejected"
          | "draft"
          | "expired"
          | "archived"
      );

      if (result.success) {
        console.log(`Successfully updated ${result.data} projects`);
        await handleRefresh();
      } else {
        throw new Error(result.error || "Failed to update projects");
      }
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const handleBulkDuplicate = async (projectIds: string[]) => {
    try {
      const result = await duplicateProjects(projectIds);

      if (result.success) {
        console.log(
          `Successfully duplicated ${result.duplicatedCount} projects`
        );
      } else {
        throw new Error(result.error || "Failed to duplicate projects");
      }
    } catch (error) {
      console.error("Bulk duplicate failed:", error);
      throw error;
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await handleRefresh();
      } else {
        throw new Error(result.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  };

  const currentData =
    viewMode === "archived" ? archivedProjectsData : projectsData;
  const currentPagination =
    viewMode === "archived" ? archivedPagination : pagination;
  const currentError = viewMode === "archived" ? archivedError : error;
  const currentIsLoading =
    viewMode === "archived"
      ? isLoadingArchived
      : isPaginationLoading || isInitialLoading;
  const currentSetPage =
    viewMode === "archived" ? setArchivedCurrentPage : setCurrentPage;

  if (currentError) {
    return (
      <div className="p-3">
        <ErrorMessage error={currentError} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn w-full p-3">
      <div className="rounded-2xs border-white-neutral-light-300 bg-white-neutral-light-100 border p-2">
        <ProjectsTable
          isLoading={currentIsLoading}
          isInitialLoading={viewMode === "active" ? isInitialLoading : false}
          isUpdating={isUpdating}
          isDuplicating={isDuplicating}
          data={currentData}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onStatusUpdate={handleStatusUpdate}
          onBulkDuplicate={handleBulkDuplicate}
          onDelete={handleDelete}
          viewMode={viewMode}
          onRefresh={handleRefresh}
        />

        {currentPagination && currentPagination.totalPages > 1 && (
          <div className="border-t-white-neutral-light-300 bg-white-neutral-light-100 rounded-2xs flex items-center justify-between border-t p-3">
            <Pagination
              totalPages={currentPagination.totalPages}
              currentPage={currentPagination.currentPage}
              onPageChange={currentSetPage}
            />
            <PageCounter
              currentPage={currentPagination.currentPage}
              totalPages={currentPagination.totalPages}
            />
          </div>
        )}
      </div>

      {viewMode === "archived" &&
        currentData.length === 0 &&
        !currentIsLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg
                width="32"
                height="32"
                fill="currentColor"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z" />
                <path d="M9.5 11h5v2h-5z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Nenhuma proposta arquivada
            </h3>
            <p className="text-gray-500">
              Você ainda não arquivou nenhuma proposta.
            </p>
          </div>
        )}
    </div>
  );
}
