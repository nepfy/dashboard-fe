import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";

import {
  formatVisualizationDate,
  formatValidityDate,
} from "#/helpers/formatDateAndTime";
import CalendarIcon from "#/components/icons/CalendarIcon";

import TableBulkEdit from "./TableBulkEdit";
import { getStatusBadge } from "./getStatusBadge";
import { TableProps } from "./types";

const ProjectsTable: React.FC<TableProps> = ({
  data,
  onRowSelect,
  isLoading,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  const showBulkEdit = selectedRows.size || selectAll;

  if (isLoading) {
    return (
      <div className="w-full p-7 bg-white-neutral-light-100">
        <div className="flex items-center justify-center h-64">
          <LoaderCircle className="animate-spin text-primary-light-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showBulkEdit && <TableBulkEdit />}

      <div className="w-full overflow-x-scroll bg-white-neutral-light-100 rounded-2xs">
        <div className="p-4">
          <table className="w-full p-3 box-border">
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
                    className={`py-4 ${
                      selectedRows.has(row.id)
                        ? "bg-white-neutral-light-200 rounded-2xs"
                        : undefined
                    }`}
                  >
                    <td className="py-4 pl-4 pr-3 text-sm text-white-neutral-light-900 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded-xl border border-white-neutral-light-300 text-blue-600 focus:ring-blue-500 mr-2 flex-shrink-0"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                      <span
                        className="truncate md:whitespace-nowrap max-w-[100px] sm:max-w-none"
                        title={row.clientName}
                      >
                        {row.clientName}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-white-neutral-light-900">
                      <span
                        className="truncate md:whitespace-nowrap max-w-[120px] sm:max-w-none block"
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900">
                      <CalendarIcon
                        width="16"
                        height="16"
                        className="inline mr-1"
                      />
                      {formatValidityDate(row.projectValidUntil)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900">
                      {getStatusBadge(row.projectStatus)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white-neutral-light-900">
                      ...
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
    </div>
  );
};

export default ProjectsTable;
