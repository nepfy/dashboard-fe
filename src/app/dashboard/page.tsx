"use client";

import { LoaderCircle } from "lucide-react";
import { useProjects } from "#/hooks/useProjectGenerator/useProjects";

import DashboardStartProjectView from "#/app/dashboard/components/DashboardStartProjectView";
import DashboardProjectView from "#/app/dashboard/components/DashboardProjectView";

export default function Dashboard() {
  const {
    projectsData,
    statistics,
    pagination,
    isInitialLoading,
    isPaginationLoading,
    isDuplicating,
    error,
    setCurrentPage,
    updateMultipleProjectsStatus,
    updateProjectStatus,
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

  if (isInitialLoading) {
    return (
      <div className="p-7">
        <div className="flex items-center justify-center h-64">
          <LoaderCircle className="animate-spin text-primary-light-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {projectsData?.length && pagination ? (
        <div className="p-7 h-full">
          <DashboardProjectView
            projectsData={projectsData}
            pagination={pagination}
            onPageChange={setCurrentPage}
            error={error}
            isInitialLoading={isInitialLoading}
            isPaginationLoading={isPaginationLoading}
            isDuplicating={isDuplicating}
            statistics={statistics}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onStatusUpdate={handleStatusUpdate}
            onBulkDuplicate={handleBulkDuplicate}
          />
        </div>
      ) : (
        <DashboardStartProjectView />
      )}
    </div>
  );
}
