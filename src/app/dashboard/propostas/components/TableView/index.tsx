import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";

import ErrorMessage from "#/components/ErrorMessage";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";
import { useProjects } from "#/hooks/useProjects";

export default function TableView() {
  const { projectsData, pagination, isLoading, error, setCurrentPage } =
    useProjects(1, 10);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="w-full animate-fadeIn p-3">
      <div className="rounded-2xs border border-white-neutral-light-300">
        <ProjectsTable isLoading={isLoading} data={projectsData} />

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
