"use client";

import { useEffect, useState } from "react";
import ErrorMessage from "#/components/ErrorMessage";

import DashboardStartProjectView from "#/app/dashboard/components/DashboardStartProjectView";
import DashboardProjectView from "#/app/dashboard/components/DashboardProjectView";

export default function Dashboard() {
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
    <div className="p-7">
      {projectsData?.length ? (
        <DashboardProjectView data={projectsData} />
      ) : (
        <DashboardStartProjectView />
      )}
    </div>
  );
}
