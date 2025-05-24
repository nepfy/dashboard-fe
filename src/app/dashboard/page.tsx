"use client";

import { LoaderCircle } from "lucide-react";
import { useProjects } from "#/hooks/useProjects";

import DashboardStartProjectView from "#/app/dashboard/components/DashboardStartProjectView";
import DashboardProjectView from "#/app/dashboard/components/DashboardProjectView";

export default function Dashboard() {
  const {
    projectsData,
    statistics,
    pagination,
    isInitialLoading,
    isPaginationLoading,
    error,
    setCurrentPage,
  } = useProjects(1, 10);

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
    <div className="p-7">
      {projectsData?.length && pagination ? (
        <DashboardProjectView
          projectsData={projectsData}
          pagination={pagination}
          onPageChange={setCurrentPage}
          error={error}
          isInitialLoading={isInitialLoading}
          isPaginationLoading={isPaginationLoading}
          statistics={statistics}
        />
      ) : (
        <DashboardStartProjectView />
      )}
    </div>
  );
}
