"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import DashboardStartProjectView from "#/app/dashboard/components/DashboardStartProjectView";
import DashboardProjectView from "#/app/dashboard/components/DashboardProjectView";

export default function Dashboard() {
  const [hasProjects, setHasProjects] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfUserHasProjects = async () => {
      try {
        const response = await fetch("/api/projects?page=1&limit=1");
        const result = await response.json();

        if (result.success) {
          setHasProjects(result.data.length > 0);
        } else {
          setHasProjects(false);
        }
      } catch (error) {
        console.error("Error checking projects:", error);
        setHasProjects(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfUserHasProjects();
  }, []);

  if (isLoading) {
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
      {hasProjects ? <DashboardProjectView /> : <DashboardStartProjectView />}
    </div>
  );
}
