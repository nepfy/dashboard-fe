"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useProjects } from "#/hooks/useProjectGenerator/useProjects";

// import DashboardStartProjectView from "#/app/dashboard/components/DashboardStartProjectView";
import DashboardProjectView from "#/app/dashboard/components/DashboardProjectView";
import SuccessModal from "#/app/dashboard/components/SuccessModal";
import { trackDashboardViewed } from "#/lib/analytics/track";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  // Track dashboard viewed
  useEffect(() => {
    trackDashboardViewed();
  }, []);

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
    refetch,
  } = useProjects(1, 10);

  // Check for success parameter when component mounts
  useEffect(() => {
    const success = searchParams?.get("success");
    const project = searchParams?.get("project");
    const projectIdParam = searchParams?.get("projectId");

    if (success !== null && project && projectIdParam) {
      setProjectName(project ? decodeURIComponent(project) : "Nova Proposta");
      setProjectId(projectIdParam ?? null);
      setShowSuccessModal(true);

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setProjectName("");
    setProjectId(null);
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
        await refetch();
      } else {
        throw new Error(result.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    await refetch();
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
    <div>
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onCloseAction={handleCloseSuccessModal}
        projectName={projectName}
        projectId={projectId ?? undefined}
      />

      <div className="p-7">
        <DashboardProjectView
          projectsData={projectsData}
          pagination={
            pagination ?? {
              currentPage: 1,
              totalPages: 1,
              totalCount: 0,
              limit: 10,
              hasNextPage: false,
              hasPreviousPage: false,
            }
          }
          onPageChange={setCurrentPage}
          error={error}
          isInitialLoading={isInitialLoading}
          isPaginationLoading={isPaginationLoading}
          isDuplicating={isDuplicating}
          statistics={statistics}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onStatusUpdate={handleStatusUpdate}
          onBulkDuplicate={handleBulkDuplicate}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      </div>

      {/* {projectsData?.length && pagination ? (
      <div className="p-7">
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
      )} */}
    </div>
  );
}
