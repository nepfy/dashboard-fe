import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";

import ErrorMessage from "#/components/ErrorMessage";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";
import { useProjects } from "#/hooks/useProjects";

export default function TableView() {
  const {
    projectsData,
    pagination,
    isPaginationLoading,
    isInitialLoading,
    isUpdating,
    isDuplicating,
    error,
    setCurrentPage,
    updateMultipleProjectsStatus,
    duplicateProjects,
  } = useProjects(1, 10);

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

  if (error) {
    return (
      <div className="p-3">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn p-3">
      <div className="rounded-2xs border border-white-neutral-light-300">
        <ProjectsTable
          isLoading={isPaginationLoading}
          isInitialLoading={isInitialLoading}
          isUpdating={isUpdating}
          isDuplicating={isDuplicating}
          data={projectsData}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onBulkDuplicate={handleBulkDuplicate}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="p-3 border-t border-t-white-neutral-light-300 flex items-center justify-between bg-white-neutral-light-100 rounded-2xs">
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              onPageChange={setCurrentPage}
            />
            <PageCounter
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
