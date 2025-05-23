import { useEffect, useState } from "react";

import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";

import ErrorMessage from "#/components/ErrorMessage";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";

export default function TableView() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [projectsData, setProjectsData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await fetch("/api/projects");
        const result = await response.json();

        if (result.success) {
          setProjectsData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Erro ao carregar lista. ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobTypes();
  }, []);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (isLoading) {
    return (
      <div className="p-7">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn p-3">
      <div className="rounded-2xs border border-white-neutral-light-300">
        <ProjectsTable data={projectsData} />

        <div className="p-3 border-t border-t-white-neutral-light-300 flex items-center justify-between bg-white-neutral-light-100 rounded-2xs">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <PageCounter currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
