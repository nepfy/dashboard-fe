/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { generateSubdomainUrl } from "#/lib/subdomain";

interface SubdomainUrlData {
  userName: string;
  projectUrl: string;
  fullUrl: string;
}

export function useSubdomainUrl(projectId: string) {
  const [data, setData] = useState<SubdomainUrlData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubdomainUrl = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/copy-link`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro ao buscar dados do projeto");
      }

      const { projectUrl, userName } = result.data;
      const fullUrl = generateSubdomainUrl(userName, projectUrl);

      setData({
        userName,
        projectUrl,
        fullUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSubdomainUrl();
    }
  }, [projectId]);

  return { data, loading, error, refetch: fetchSubdomainUrl };
}
