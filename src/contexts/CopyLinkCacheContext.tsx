"use client";

import { generateSubdomainUrl } from "#/lib/subdomain";
import { ReactNode } from "react";

interface CopyLinkResponse {
  success: boolean;
  data?: {
    projectUrl?: string;
    userName?: string;
  };
  error?: string;
}

export function CopyLinkCacheProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCopyLinkWithCache() {
  const copyLinkWithCache = async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}/copy-link`);
    const result = (await response.json()) as CopyLinkResponse;

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Erro ao buscar dados do projeto");
    }

    const { projectUrl, userName } = result.data;

    if (!projectUrl || !userName) {
      throw new Error("Dados insuficientes para gerar o link");
    }

    const fullUrl = generateSubdomainUrl(userName, projectUrl);

    await navigator.clipboard.writeText(fullUrl);

    return {
      fullUrl,
      fromCache: false,
    };
  };

  return { copyLinkWithCache };
}
