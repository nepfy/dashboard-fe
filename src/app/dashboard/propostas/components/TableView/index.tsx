import { useEffect, useState } from "react";
import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";

import ErrorMessage from "#/components/ErrorMessage";
import { useProjects } from "#/hooks/useProjectGenerator/useProjects";
import { ChevronDown } from "lucide-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface TableViewProps {
  viewMode: "active" | "archived";
  onCountUpdate?: (count: number) => void;
  onPaginationUpdate?: (
    info: PaginationInfo | null,
    callback?: (page: number) => void
  ) => void;
  setViewMode: (viewMode: "active" | "archived") => void;
}

export default function TableView({
  viewMode,
  onCountUpdate,
  onPaginationUpdate,
}: TableViewProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(["1", "2"]); // Mock para visualizar
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Aprovada"); // Mock

  const {
    projectsData,
    archivedProjectsData,
    pagination,
    archivedPagination,
    isPaginationLoading,
    isInitialLoading,
    isLoadingArchived,
    isUpdating,
    isDuplicating,
    error,
    archivedError,
    setCurrentPage,
    setArchivedCurrentPage,
    updateProjectStatus,
    updateMultipleProjectsStatus,
    duplicateProjects,
    fetchArchivedProjects,
    refetch,
    refetchArchived,
  } = useProjects(1, 10);

  useEffect(() => {
    if (viewMode === "archived" && archivedProjectsData.length === 0) {
      fetchArchivedProjects(1);
    }
  }, [viewMode, archivedProjectsData.length, fetchArchivedProjects]);

  useEffect(() => {
    if (onCountUpdate) {
      const count =
        viewMode === "archived"
          ? archivedPagination?.totalCount || 0
          : pagination?.totalCount || 0;
      onCountUpdate(count);
    }
  }, [
    viewMode,
    pagination?.totalCount,
    archivedPagination?.totalCount,
    onCountUpdate,
  ]);

  useEffect(() => {
    if (onPaginationUpdate) {
      const currentPagination =
        viewMode === "archived" ? archivedPagination : pagination;
      const currentSetPage =
        viewMode === "archived" ? setArchivedCurrentPage : setCurrentPage;

      if (currentPagination) {
        onPaginationUpdate(
          {
            currentPage: currentPagination.currentPage,
            totalPages: currentPagination.totalPages,
            totalCount: currentPagination.totalCount,
          },
          currentSetPage
        );
      } else {
        onPaginationUpdate(null);
      }
    }
  }, [
    viewMode,
    pagination,
    archivedPagination,
    onPaginationUpdate,
    setCurrentPage,
    setArchivedCurrentPage,
  ]);

  const handleRefresh = async () => {
    await refetch();
    await refetchArchived();
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
        await handleRefresh();
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
        await handleRefresh();
      } else {
        throw new Error(result.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  };

  const currentData =
    viewMode === "archived" ? archivedProjectsData : projectsData;
  const currentError = viewMode === "archived" ? archivedError : error;
  const currentIsLoading =
    viewMode === "archived"
      ? isLoadingArchived
      : isPaginationLoading || isInitialLoading;

  if (currentError) {
    return (
      <div className="p-3">
        <ErrorMessage error={currentError} />
      </div>
    );
  }

  return (
    <>
      <div className="animate-fadeIn w-full">
        {/* Barra de ações quando há itens selecionados */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            {/* Dropdown Atualizar status - Esquerda */}
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex h-10 min-w-[566px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>Atualizar status</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 w-[566px] rounded-lg border border-gray-200 bg-white py-3 shadow-lg">
                  {[
                    "Rascunho",
                    "Enviada",
                    "Negociação",
                    "Aprovada",
                    "Recusada",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`flex w-full items-center gap-3 px-6 py-3 text-left text-base transition-colors ${
                        selectedStatus === status
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Radio button */}
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selectedStatus === status
                            ? "border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedStatus === status && (
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <span className="text-gray-900">{status}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de ação - Direita */}
            <div className="flex items-center gap-2">
              {/* Salvar alterações */}
              <button className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">
                Salvar alterações
              </button>

              {/* Arquivar */}
              <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z" />
                </svg>
                Arquivar
              </button>

              {/* Excluir */}
              <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Excluir
              </button>

              {/* Cancelar */}
              <button
                onClick={() => setSelectedItems([])}
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ProjectsTable
          isLoading={currentIsLoading}
          isInitialLoading={viewMode === "active" ? isInitialLoading : false}
          isUpdating={isUpdating}
          isDuplicating={isDuplicating}
          data={currentData}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onStatusUpdate={handleStatusUpdate}
          onBulkDuplicate={handleBulkDuplicate}
          onDelete={handleDelete}
          viewMode={viewMode}
          onRefresh={handleRefresh}
        />
      </div>

      {viewMode === "archived" &&
        currentData.length === 0 &&
        !currentIsLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg
                width="32"
                height="32"
                fill="currentColor"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z" />
                <path d="M9.5 11h5v2h-5z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Nenhuma proposta arquivada
            </h3>
            <p className="text-gray-500">
              Você ainda não arquivou nenhuma proposta.
            </p>
          </div>
        )}
    </>
  );
}
