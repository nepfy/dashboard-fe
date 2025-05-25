import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import SelectInput from "#/components/Inputs/SelectInput";
import Archive from "#/components/icons/Archive";
import CopyIcon from "#/components/icons/CopyIcon";

import { getStatusBadge } from "./getStatusBadge";

const BASE_STYLE = `
px-4 py-2 w-[120px] h-[48px] 
flex items-center justify-center gap-1 
text-white-neutral-light-900 text-sm font-medium 
rounded-[var(--radius-s)] cursor-pointer 
bg-white-neutral-light-100 hover:bg-white-neutral-light-200 
border border-white-neutral-light-300 button-inner
`;

const DISABLED_STYLE = `
px-4 py-2 w-[120px] h-[48px] 
flex items-center justify-center gap-1 
text-white-neutral-light-500 text-sm font-medium 
rounded-[var(--radius-s)] cursor-not-allowed
bg-white-neutral-light-100 opacity-50
border border-white-neutral-light-300
`;

const statusMapping = {
  enviada: "active",
  aprovada: "approved",
  negociacao: "negotiation",
  rascunho: "draft",
  expirada: "expired",
  rejeitada: "rejected",
  arquivada: "archived",
} as const;

const options = [
  {
    value: "enviada",
    label: getStatusBadge("active"),
  },
  {
    value: "aprovada",
    label: getStatusBadge("approved"),
  },
  {
    value: "negociacao",
    label: getStatusBadge("negotiation"),
  },
  {
    value: "rascunho",
    label: getStatusBadge("draft"),
  },
  {
    value: "expirada",
    label: getStatusBadge("expired"),
  },
  {
    value: "rejeitada",
    label: getStatusBadge("rejected"),
  },
  {
    value: "arquivada",
    label: getStatusBadge("archived"),
  },
];

interface TableBulkEditProps {
  selectedCount?: number;
  selectedProjectIds?: string[];
  onStatusUpdate: (status: string) => Promise<void>;
  onDuplicateProjects: (projectIds: string[]) => Promise<void>;
  onDeselectAll: () => void;
  isUpdating?: boolean;
  isDuplicating?: boolean;
}

export default function TableBulkEdit({
  selectedCount,
  selectedProjectIds = [],
  onStatusUpdate,
  onDuplicateProjects,
  onDeselectAll,
  isUpdating = false,
  isDuplicating = false,
}: TableBulkEditProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isArchiving, setIsArchiving] = useState(false);

  console.log("Selecionados:", selectedCount);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      alert("Por favor, selecione um status para atualizar.");
      return;
    }

    try {
      const apiStatus =
        statusMapping[selectedStatus as keyof typeof statusMapping];
      await onStatusUpdate(apiStatus);

      setSelectedStatus("");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const handleArchive = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Tem certeza que deseja arquivar ${selectedCount} item${
        selectedCount !== 1 ? "s" : ""
      }? Esta ação pode ser revertida posteriormente.`
    );

    if (!confirmed) return;

    try {
      setIsArchiving(true);
      await onStatusUpdate("archived");

      // Reset selection after successful archive
      setSelectedStatus("");
    } catch (error) {
      console.error("Failed to archive projects:", error);
      alert("Erro ao arquivar projetos. Tente novamente.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDuplicate = async () => {
    const confirmed = window.confirm(
      `Tem certeza que deseja duplicar ${selectedCount} projeto${
        selectedCount !== 1 ? "s" : ""
      }? ${
        selectedCount === 1 ? "Uma cópia será criada" : "Cópias serão criadas"
      } como rascunho${selectedCount !== 1 ? "s" : ""}.`
    );

    if (!confirmed) return;

    try {
      await onDuplicateProjects(selectedProjectIds);
    } catch (error) {
      console.error("Failed to duplicate projects:", error);
      alert("Erro ao duplicar projetos. Tente novamente.");
    }
  };

  const handleDeselectAll = () => {
    onDeselectAll();
    setSelectedStatus("");
  };

  const isOperationInProgress = isUpdating || isArchiving;

  return (
    <div
      className={`bg-white-neutral-light-100 e0 py-3 sm:py-0 px-4 rounded-[10px] w-full min-h-[78px] transition-all duration-400 ease-in-out flex items-center justify-start sm:justify-center gap-2 flex-wrap mb-2 sm:flex-nowrap ${
        isVisible ? "opacity-100 " : "opacity-0 "
      }`}
    >
      <SelectInput
        className="h-[49px]"
        options={options}
        placeholder="Atualizar status"
        value={selectedStatus}
        onChange={setSelectedStatus}
      />

      <button
        onClick={handleStatusUpdate}
        disabled={isUpdating || !selectedStatus}
        className={`px-4 py-2 h-[48px] text-sm font-medium text-white rounded-[var(--radius-s)] transition-colors border border-primary-light-25 ${
          isUpdating || !selectedStatus
            ? "bg-gray-400 cursor-not-allowed opacity-50"
            : "bg-primary-light-400 hover:bg-primary-light-500 cursor-pointer button-inner-inverse"
        }`}
      >
        {isUpdating ? (
          <div className="flex items-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin" />
            Atualizando...
          </div>
        ) : (
          "Atualizar"
        )}
      </button>

      <button
        onClick={handleArchive}
        className={`px-4 py-2 w-[120px] h-[48px] flex items-center justify-center gap-1 text-sm font-medium rounded-[var(--radius-s)] transition-colors border border-white-neutral-light-300 ${
          isOperationInProgress
            ? "text-white-neutral-light-500 cursor-not-allowed bg-white-neutral-light-100 opacity-50"
            : "text-white-neutral-light-900 cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner"
        }`}
        disabled={isOperationInProgress}
      >
        {isArchiving ? (
          <>
            <LoaderCircle className="w-4 h-4 animate-spin" />
            Arquivando...
          </>
        ) : (
          <>
            <Archive width="16px" height="16px" />
            Arquivar
          </>
        )}
      </button>

      <button
        onClick={handleDuplicate}
        className={`px-4 py-2 w-[120px] h-[48px] flex items-center justify-center gap-1 text-sm font-medium rounded-[var(--radius-s)] transition-colors border border-white-neutral-light-300 ${
          isOperationInProgress
            ? "text-white-neutral-light-500 cursor-not-allowed bg-white-neutral-light-100 opacity-50"
            : "text-white-neutral-light-900 cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner"
        }`}
        disabled={isOperationInProgress}
      >
        {isDuplicating ? (
          <>
            <LoaderCircle className="w-4 h-4 animate-spin" />
            Duplicando...
          </>
        ) : (
          <>
            <CopyIcon width="16px" height="16px" />
            Duplicar
          </>
        )}
      </button>

      <button
        onClick={handleDeselectAll}
        className={isOperationInProgress ? DISABLED_STYLE : BASE_STYLE}
        disabled={isOperationInProgress}
      >
        Deselecionar
      </button>

      {/* <div className="ml-auto hidden sm:block">
        <span className="text-sm text-white-neutral-light-600">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selecionado
          {selectedCount !== 1 ? "s" : ""}
        </span>
      </div> */}
    </div>
  );
}
