import React, { useState, useRef } from "react";
import { LoaderCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  formatVisualizationDate,
  formatValidityDate,
} from "#/helpers/formatDateAndTime";
import CalendarIcon from "#/components/icons/CalendarIcon";
import AnchorLinkIcon from "#/components/icons/AnchorLinkIcon";

import RowEditMenu from "./RowEditMenu";
import { getStatusBadge } from "./getStatusBadge";
import { TableProps } from "./types";
import { useCopyLinkWithCache } from "#/contexts/CopyLinkCacheContext";
import { trackProposalShared } from "#/lib/analytics/track";

interface EnhancedTableProps extends TableProps {
  isUpdating?: boolean;
  isDuplicating?: boolean;
  onBulkStatusUpdate?: (projectIds: string[], status: string) => Promise<void>;
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
  onBulkDuplicate?: (projectIds: string[]) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
  viewMode?: "active" | "archived";
  onRefresh?: () => Promise<void>;
}

interface CopyLinkIconProps {
  projectId: string;
  isVisible: boolean;
}

const CopyLinkIcon: React.FC<CopyLinkIconProps> = ({
  projectId,
  isVisible,
}) => {
  const { copyLinkWithCache } = useCopyLinkWithCache();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCopyClick = async (e: React.MouseEvent) => {
    if (!isVisible) return;

    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await copyLinkWithCache(projectId);

      await navigator.clipboard.writeText(result.fullUrl);

      // Track proposal shared
      trackProposalShared({
        proposal_id: projectId,
        share_method: "link",
      });

      const successMessage = result.fromCache
        ? "Link copiado! (cache)"
        : "Link copiado!";

      setMessage(successMessage);

      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      setMessage("Erro ao copiar link. URL foi gerada?");

      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopyClick}
        disabled={isLoading}
        className={`inline-flex items-center justify-center rounded-full p-1 transition-all duration-200 ${
          isVisible
            ? "hover:bg-white-neutral-light-300 cursor-pointer opacity-100"
            : "pointer-events-none cursor-default opacity-0"
        } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        title="Copiar link do projeto"
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <AnchorLinkIcon width="16" height="16" />
        )}
      </button>

      {message && (
        <div
          className={`absolute top-full left-1/2 z-10 mt-1 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap ${
            message.includes("Erro")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

const ProjectsTable: React.FC<EnhancedTableProps> = ({
  data,
  onRowSelect,
  isLoading,
  isInitialLoading,
  isUpdating = false,
  isDuplicating = false,
  onStatusUpdate,
  onBulkDuplicate,
  onDelete,
  viewMode = "active",
  onRefresh,
}) => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [menuTriggerElement, setMenuTriggerElement] =
    useState<HTMLElement | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["draft"])
  );

  // Store refs for each row's trigger button
  const triggerRefs = useRef<Record<string, HTMLButtonElement>>({});

  // Agrupar propostas por status
  const groupedProposals = React.useMemo(() => {
    const groups: Record<
      string,
      { label: string; badge: string; items: typeof data }
    > = {
      draft: {
        label: "Rascunho",
        badge: "bg-gray-100 text-gray-700",
        items: [],
      },
      active: {
        label: "Enviada",
        badge: "bg-purple-100 text-purple-700",
        items: [],
      },
      negotiation: {
        label: "Negociação",
        badge: "bg-orange-100 text-orange-700",
        items: [],
      },
      approved: {
        label: "Aprovada",
        badge: "bg-green-100 text-green-700",
        items: [],
      },
      rejected: {
        label: "Recusada",
        badge: "bg-red-100 text-red-700",
        items: [],
      },
    };

    (data ?? []).forEach((item) => {
      const status = item.projectStatus || "draft";
      const group = groups[status];
      if (group?.items) {
        group.items.push(item);
      }
    });

    return groups;
  }, [data]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));

    setSelectAll(newSelected.size === data?.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIds = (data ?? [])
        .map((row) => row.id)
        .filter((id): id is string => id !== undefined);
      setSelectedRows(new Set(allIds));
      onRowSelect?.(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/dashboard/propostas/${projectId}`);
  };

  const handleMenuToggle = (rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const triggerElement = triggerRefs.current[rowId];
    setMenuTriggerElement(triggerElement);
    setOpenMenuRowId(openMenuRowId === rowId ? null : rowId);
  };

  const handleMenuClose = () => {
    setOpenMenuRowId(null);
    setMenuTriggerElement(null);
  };

  const handleRowStatusUpdate = async (projectId: string, status: string) => {
    if (onStatusUpdate) {
      try {
        await onStatusUpdate(projectId, status);
        setOpenMenuRowId(null);
        setMenuTriggerElement(null);
      } catch (error) {
        console.error("Falha ao atualizar proposta:", error);
      }
    }
  };

  const handleRowDuplicate = async (projectId: string) => {
    if (onBulkDuplicate) {
      try {
        await onBulkDuplicate([projectId]);
        setOpenMenuRowId(null);
        setMenuTriggerElement(null);
      } catch (error) {
        console.error("Falha ao duplicar proposta:", error);
      }
    }
  };

  const handleRowDelete = async (projectId: string) => {
    if (onDelete) {
      try {
        await onDelete(projectId);
        setOpenMenuRowId(null);
        setMenuTriggerElement(null);
      } catch (error) {
        console.error("Falha ao excluir proposta:", error);
      }
    }
  };

  const isOperationInProgress = isUpdating || isDuplicating;

  if (isLoading || isInitialLoading) {
    return (
      <div className="bg-white-neutral-light-100 rounded-2xs w-full p-7">
        <div className="flex h-64 items-center justify-center">
          <LoaderCircle className="text-primary-light-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Mobile Accordion View */}
      <div className="block overflow-hidden rounded-xl sm:hidden lg:p-3">
        {/* Mobile Selection Bar */}
        {selectedRows.size > 0 && (
          <div className="mb-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-900">
                {selectedRows.size}{" "}
                {selectedRows.size === 1
                  ? "item selecionado"
                  : "itens selecionados"}
              </span>
              <button
                onClick={() => {
                  setSelectedRows(new Set());
                  onRowSelect?.([]);
                  setSelectAll(false);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Limpar
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z" />
                </svg>
                Arquivar
              </button>
              <button className="flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Duplicar
              </button>
              <button className="flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-xs font-medium text-red-600 shadow-sm hover:bg-gray-50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        )}

        {(data ?? []).length > 0 ? (
          <div className="">
            {Object.entries(groupedProposals).map(([status, group]) => {
              if (group.items?.length === 0) return null;

              const isExpanded = expandedSections.has(status);

              return (
                <div
                  key={status}
                  className="overflow-hidden border-b border-gray-200 bg-white last:border-b-0"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(status)}
                    className="flex w-full items-center justify-between px-4 py-5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${group.badge}`}
                      >
                        {group.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {group.items?.length}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && group.items && (
                    <div className="space-y-2 border-t border-gray-200 p-3">
                      {group.items.map((row) => (
                        <div
                          key={row.id}
                          onClick={() => handleRowClick(row.id)}
                          className={`rounded-lg border border-gray-100 bg-white p-3 transition-colors ${
                            selectedRows.has(row.id)
                              ? "bg-gray-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {/* Checkbox and Menu */}
                          <div className="mb-2 flex items-start justify-between">
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedRows.has(row.id)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRowSelect(row.id);
                              }}
                              disabled={isOperationInProgress}
                            />
                            <button
                              ref={(el) => {
                                if (el) {
                                  triggerRefs.current[row.id] = el;
                                }
                              }}
                              onClick={(e) => handleMenuToggle(row.id, e)}
                              className="rounded p-1 hover:bg-gray-100"
                              disabled={isOperationInProgress}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-gray-600"
                              >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                          </div>

                          {/* Cliente and Copy Link */}
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              <span className="truncate font-medium text-gray-900">
                                {row.clientName}
                              </span>
                              <CopyLinkIcon
                                projectId={row.id}
                                isVisible={true}
                              />
                            </div>
                          </div>

                          {/* Project Name */}
                          <div className="mb-2 text-sm text-gray-600">
                            {row.projectName}
                          </div>

                          {/* Date Info */}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <CalendarIcon width="12" height="12" />
                            <span>
                              {row.projectVisualizationDate
                                ? formatVisualizationDate(
                                    row.projectVisualizationDate
                                  )
                                : "Agora mesmo"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-gray-500">
            Nenhum dado disponível
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="bg-white-neutral-light-100 rounded-2xs hidden w-full overflow-x-auto sm:block">
        <div className="p-4">
          <table className="relative box-border h-full w-full p-3">
            <thead className="bg-white-neutral-light-200 rounded-2xs">
              <tr>
                <th
                  scope="col"
                  className="text-white-neutral-light-900 flex items-center gap-2 py-3.5 pr-3 pl-4 text-left text-sm font-semibold"
                >
                  <input
                    type="checkbox"
                    id="select-all"
                    name="select-all"
                    className="mr-2 h-4 w-4 rounded-[var(--radius-l)] border-[var(--color-white-neutral-light-300)] text-[var(--color-primary-light-400)] focus:ring-[var(--color-primary-light-400)]"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span className="-mt-2">Cliente</span>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Projeto
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Visualizado
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Validade
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                ></th>
              </tr>
            </thead>
            <tbody className="bg-white-neutral-light-100">
              {(data ?? []).length > 0 ? (
                data!.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    onMouseEnter={() => setHoveredRowId(row.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    className={`hover:bg-white-neutral-light-200 cursor-pointer py-3 ${
                      selectedRows.has(row.id)
                        ? "bg-white-neutral-light-200 rounded-2xs"
                        : undefined
                    }`}
                  >
                    <td className="text-white-neutral-light-900 flex items-center justify-start py-4 pr-3 pl-4 align-middle text-sm">
                      <div onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="border-white-neutral-light-300 mt-1 mr-2 h-4 w-4 flex-shrink-0 rounded-xl border text-blue-600 focus:ring-blue-500"
                          checked={selectedRows.has(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(row.id);
                          }}
                          disabled={isOperationInProgress}
                        />
                      </div>
                      <span
                        className="flex max-w-[100px] items-center gap-2 truncate sm:max-w-none md:whitespace-nowrap"
                        title={row.clientName}
                      >
                        {row.clientName}
                        <CopyLinkIcon
                          projectId={row.id}
                          isVisible={
                            hoveredRowId === row.id || selectedRows.has(row.id)
                          }
                        />
                      </span>
                    </td>
                    <td className="text-white-neutral-light-900 px-3 py-4 align-middle text-sm">
                      <span
                        className="block max-w-[120px] truncate sm:max-w-none md:whitespace-nowrap"
                        title={row.projectName}
                      >
                        {row.projectName}
                      </span>
                    </td>
                    <td className="text-white-neutral-light-900 flex items-center justify-start gap-1 px-3 py-4 text-sm whitespace-nowrap">
                      <CalendarIcon width="16" height="16" />
                      {formatVisualizationDate(row.projectVisualizationDate) ??
                        "Não visualizado"}
                    </td>
                    <td className="text-white-neutral-light-900 px-3 py-4 align-middle text-sm whitespace-nowrap">
                      <CalendarIcon
                        width="16"
                        height="16"
                        className="mr-1 inline"
                      />
                      {formatValidityDate(
                        row.projectValidUntil instanceof Date
                          ? row.projectValidUntil.toISOString()
                          : row.projectValidUntil
                      )}
                    </td>
                    <td className="text-white-neutral-light-900 px-3 py-4 align-middle text-sm whitespace-nowrap">
                      {getStatusBadge(row.projectStatus)}
                    </td>
                    <td className="text-white-neutral-light-900 px-3 py-2 align-middle text-sm whitespace-nowrap">
                      <button
                        ref={(el) => {
                          if (el) {
                            triggerRefs.current[row.id] = el;
                          }
                        }}
                        onClick={(e) => handleMenuToggle(row.id, e)}
                        className="cursor-pointer rounded p-1 hover:bg-gray-100"
                        disabled={isOperationInProgress}
                      >
                        ...
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-white-neutral-light-900 py-4 text-center text-sm"
                  >
                    Nenhum dado disponível
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openMenuRowId && (
        <RowEditMenu
          isOpen={true}
          onClose={handleMenuClose}
          projectId={openMenuRowId}
          templateType={
            data?.find((row) => row.id === openMenuRowId)?.templateType
          }
          currentStatus={
            data?.find((row) => row.id === openMenuRowId)?.projectStatus
          }
          viewMode={viewMode}
          onStatusUpdate={handleRowStatusUpdate}
          onDuplicate={handleRowDuplicate}
          onDelete={handleRowDelete}
          isUpdating={isUpdating}
          triggerElement={menuTriggerElement}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default ProjectsTable;
