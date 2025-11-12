"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CopyLinkData {
  projectUrl: string;
  userName: string;
  fullUrl: string;
  timestamp: number;
}

interface CopyLinkCacheContextType {
  getCachedData: (projectId: string) => CopyLinkData | null;
  setCachedData: (
    projectId: string,
    data: Omit<CopyLinkData, "timestamp">
  ) => void;
  clearCache: () => void;
  isCacheValid: (projectId: string) => boolean;
}

const CopyLinkCacheContext = createContext<
  CopyLinkCacheContextType | undefined
>(undefined);

const CACHE_EXPIRY_TIME = 30 * 1000;

export function CopyLinkCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<{ [projectId: string]: CopyLinkData }>({});

  const getCachedData = (projectId: string): CopyLinkData | null => {
    const cachedData = cache[projectId];
    if (!cachedData) return null;

    const now = Date.now();
    if (now - cachedData.timestamp >= CACHE_EXPIRY_TIME) {
      setCache((prev) => {
        const newCache = { ...prev };
        delete newCache[projectId];
        return newCache;
      });
      return null;
    }

    return cachedData;
  };

  const setCachedData = (
    projectId: string,
    data: Omit<CopyLinkData, "timestamp">
  ) => {
    const timestamp = Date.now();
    setCache((prev) => ({
      ...prev,
      [projectId]: {
        ...data,
        timestamp,
      },
    }));
  };

  const clearCache = () => {
    setCache({});
  };

  const isCacheValid = (projectId: string): boolean => {
    const cachedData = cache[projectId];
    if (!cachedData) return false;

    const now = Date.now();
    return now - cachedData.timestamp < CACHE_EXPIRY_TIME;
  };

  return (
    <CopyLinkCacheContext.Provider
      value={{
        getCachedData,
        setCachedData,
        clearCache,
        isCacheValid,
      }}
    >
      {children}
    </CopyLinkCacheContext.Provider>
  );
}

export function useCopyLinkCache() {
  const context = useContext(CopyLinkCacheContext);
  if (context === undefined) {
    throw new Error(
      "useCopyLinkCache must be used within a CopyLinkCacheProvider"
    );
  }
  return context;
}

export function useCopyLinkWithCache() {
  const { getCachedData, setCachedData } = useCopyLinkCache();

  const copyLinkWithCache = async (projectId: string) => {
    // Verificar cache primeiro
    const cachedData = getCachedData(projectId);

    if (cachedData) {
      console.log("Usando dados do cache para projeto:", projectId);
      await navigator.clipboard.writeText(cachedData.fullUrl);
      return {
        fullUrl: cachedData.fullUrl,
        fromCache: true,
      };
    }

    console.log("Fazendo nova chamada para API para projeto:", projectId);

    const response = await fetch(`/api/projects/${projectId}/copy-link`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Erro ao buscar dados do projeto");
    }

    const { projectUrl, userName } = result.data;

    if (!projectUrl || !userName) {
      throw new Error("Dados insuficientes para gerar o link");
    }

    const fullUrl = `https://${userName}-${projectUrl}.nepfy.com`;

    // Salvar no cache
    setCachedData(projectId, {
      projectUrl,
      userName,
      fullUrl,
    });

    // Copiar para clipboard
    await navigator.clipboard.writeText(fullUrl);

    return {
      fullUrl,
      fromCache: false,
    };
  };

  return { copyLinkWithCache };
}
