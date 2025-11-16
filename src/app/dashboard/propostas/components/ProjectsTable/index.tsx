import React, { useState, useRef } from "react";
import { LoaderCircle } from "lucide-react";

import {
  formatVisualizationDate,
  formatValidityDate,
} from "#/helpers/formatDateAndTime";
import CalendarIcon from "#/components/icons/CalendarIcon";
import AnchorLinkIcon from "#/components/icons/AnchorLinkIcon";

import TableBulkEdit from "./TableBulkEdit";
import RowEditMenu from "./RowEditMenu";
import { getStatusBadge } from "./getStatusBadge";
import { TableProps } from "./types";
import { useCopyLinkWithCache } from "#/contexts/CopyLinkCacheContext";
import ProposalModals from "../ProposalModals";

interface EnhancedTableProps extends TableProps {
  isUpdating?: boolean;
  isDuplicating?: boolean;
  onBulkStatusUpdate?: (projectIds: string[], status: string) => Promise<void>;
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
  onBulkDuplicate?: (projectIds: string[]) => Promise<void>;
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
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await copyLinkWithCache(projectId);

      await navigator.clipboard.writeText(result.fullUrl);

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
        className={`inline-flex items-center justify-center p-1 rounded-full transition-all duration-200 ${
          isVisible
            ? "opacity-100 cursor-pointer hover:bg-white-neutral-light-300"
            : "opacity-0 cursor-default"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Copiar link do projeto"
      >
        {isLoading ? (
          <LoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <AnchorLinkIcon width="16" height="16" />
        )}
      </button>

      {message && (
        <div
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded whitespace-nowrap z-10 ${
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
  onBulkStatusUpdate,
  onStatusUpdate,
  onBulkDuplicate,
  viewMode = "active",
  onRefresh,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [menuTriggerElement, setMenuTriggerElement] =
    useState<HTMLElement | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Store refs for each row's trigger button
  const triggerRefs = useRef<Record<string, HTMLButtonElement>>({});

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

  const handleBulkStatusUpdate = async (status: string) => {
    const selectedIds = Array.from(selectedRows);
    if (selectedIds.length > 0 && onBulkStatusUpdate) {
      try {
        await onBulkStatusUpdate(selectedIds, status);
        setSelectedRows(new Set());
        setSelectAll(false);
        onRowSelect?.([]);
      } catch (error) {
        console.error("Failed to update projects:", error);
      }
    }
  };

  const handleBulkDuplicate = async () => {
    const selectedIds = Array.from(selectedRows);
    if (selectedIds.length > 0 && onBulkDuplicate) {
      try {
        await onBulkDuplicate(selectedIds);
        setSelectedRows(new Set());
        setSelectAll(false);
        onRowSelect?.([]);
      } catch (error) {
        console.error("Falha ao duplicar proposta:", error);
      }
    }
  };

  const handleDeselectAll = () => {
    setSelectedRows(new Set());
    setSelectAll(false);
    onRowSelect?.([]);
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

  const isOperationInProgress = isUpdating || isDuplicating;
  const showBulkEdit = selectedRows.size > 0;

  if (isLoading || isInitialLoading) {
    return (
      <div className="w-full p-7 bg-white-neutral-light-100 rounded-2xs">
        <div className="flex items-center justify-center h-64">
          <LoaderCircle className="animate-spin text-primary-light-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {showBulkEdit && (
        <TableBulkEdit
          selectedCount={selectedRows.size}
          selectedProjectIds={Array.from(selectedRows)}
          onStatusUpdate={handleBulkStatusUpdate}
          onDuplicateProjects={handleBulkDuplicate}
          onDeselectAll={handleDeselectAll}
          isUpdating={isUpdating}
          isDuplicating={isDuplicating}
          viewMode={viewMode}
          onRefresh={onRefresh}
        />
      )}

      <div className="w-full overflow-x-auto bg-white-neutral-light-100 rounded-2xs">
        <div className="p-4">
          <table className="w-full h-full p-3 box-border relative">
            <thead className="bg-white-neutral-light-200 rounded-2xs">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white-neutral-light-900"
                >
                  <input
                    type="checkbox"
                    id="select-all"
                    name="select-all"
                    className="w-4 h-4 rounded-[var(--radius-l)] border-[var(--color-white-neutral-light-300)] text-[var(--color-primary-light-400)] focus:ring-[var(--color-primary-light-400)] mr-2"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Cliente
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
                    onClick={() => handleRowSelect(row.id)}
                    onMouseEnter={() => setHoveredRowId(row.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    className={`py-4 hover:bg-white-neutral-light-200 cursor-pointer ${
                      selectedRows.has(row.id)
                        ? "bg-white-neutral-light-200 rounded-2xs"
                        : undefined
                    }`}
                  >
                    <td className="py-4 pl-4 pr-3 text-sm text-white-neutral-light-900 flex align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded-xl border border-white-neutral-light-300 text-blue-600 focus:ring-blue-500 mr-2 flex-shrink-0 self-baseline mt-0.5"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        disabled={isOperationInProgress}
                      />
                      <span
                        className="flex justify-center gap-2 truncate md:whitespace-nowrap max-w-[100px] sm:max-w-none"
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
                    <td className="px-3 py-4 text-sm text-white-neutral-light-900 align-middle">
                      <span
                        className="truncate md:whitespace-nowrap max-w-[120px] sm:max-w-none block mb-2"
                        title={row.projectName}
                      >
                        {row.projectName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900 flex items-center justify-start gap-1">
                      <CalendarIcon width="16" height="16" />
                      {formatVisualizationDate(row.projectVisualizationDate) ??
                        "Não visualizado"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900 align-top">
                      <CalendarIcon
                        width="16"
                        height="16"
                        className="inline mr-1 mb-1"
                      />
                      {formatValidityDate(
                        row.projectValidUntil instanceof Date
                          ? row.projectValidUntil.toISOString()
                          : row.projectValidUntil
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900 align-top">
                      {getStatusBadge(row.projectStatus)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-white-neutral-light-900 align-top">
                      <button
                        ref={(el) => {
                          if (el) {
                            triggerRefs.current[row.id] = el;
                          }
                        }}
                        onClick={(e) => handleMenuToggle(row.id, e)}
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
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
                    className="py-4 text-center text-sm text-white-neutral-light-900"
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
          isUpdating={isUpdating}
          triggerElement={menuTriggerElement}
          onRefresh={onRefresh}
        />
      )}

      {/* Proposal Modals - Show for all projects to handle adjustments and acceptances */}
      {data && data.length > 0 && (
        <>
          {data.map((row) => (
            <ProposalModals
              key={row.id}
              projectId={row.id}
              projectName={row.projectName}
              projectStatus={row.projectStatus}
              templateType={row.templateType}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ProjectsTable;
