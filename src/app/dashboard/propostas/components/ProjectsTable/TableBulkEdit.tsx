import { useEffect, useState } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

import SelectInput from "#/components/Inputs/SelectInput";
import Archive from "#/components/icons/Archive";
import CopyIcon from "#/components/icons/CopyIcon";
import Modal from "#/components/Modal";

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
  ativa: "active",
} as const;

const activeOptions = [
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

const archivedOptions = [
  {
    value: "ativa",
    label: getStatusBadge("active"),
  },
  {
    value: "rascunho",
    label: getStatusBadge("draft"),
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
  viewMode?: "active" | "archived";
  onRefresh?: () => Promise<void>;
}

export default function TableBulkEdit({
  selectedCount,
  selectedProjectIds = [],
  onStatusUpdate,
  onDuplicateProjects,
  onDeselectAll,
  isUpdating = false,
  isDuplicating = false,
  viewMode = "active",
  onRefresh,
}: TableBulkEditProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isArchiving, setIsArchiving] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  console.log("Selecionados:", selectedCount);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedStatus("");
  }, [viewMode]);

  const getOptions = () => {
    return viewMode === "archived" ? archivedOptions : activeOptions;
  };

  const getPlaceholderText = () => {
    return viewMode === "archived" ? "Restaurar para..." : "Atualizar status";
  };

  const getUpdateButtonText = () => {
    if (isUpdating) {
      return viewMode === "archived" ? "Restaurando..." : "Atualizando...";
    }
    return viewMode === "archived" ? "Restaurar" : "Atualizar";
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      const actionText = viewMode === "archived" ? "restaurar" : "atualizar";
      alert(`Por favor, selecione um status para ${actionText}.`);
      return;
    }

    try {
      const apiStatus =
        statusMapping[selectedStatus as keyof typeof statusMapping];
      await onStatusUpdate(apiStatus);

      if (onRefresh) {
        await onRefresh();
      }

      setSelectedStatus("");
    } catch (error) {
      console.error("Failed to update status:", error);
      const actionText = viewMode === "archived" ? "restaurar" : "atualizar";
      alert(`Erro ao ${actionText} status. Tente novamente.`);
    }
  };

  const handleArchiveClick = () => {
    setShowArchiveModal(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      setIsArchiving(true);
      await onStatusUpdate("archived");

      if (onRefresh) {
        await onRefresh();
      }

      setSelectedStatus("");
      setShowArchiveModal(false);
    } catch (error) {
      console.error("Failed to archive projects:", error);
      alert("Erro ao arquivar projetos. Tente novamente.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleArchiveCancel = () => {
    setShowArchiveModal(false);
  };

  const handleDuplicateClick = () => {
    setShowDuplicateModal(true);
  };

  const handleDuplicateConfirm = async () => {
    try {
      await onDuplicateProjects(selectedProjectIds);

      if (onRefresh) {
        await onRefresh();
      }

      setShowDuplicateModal(false);
    } catch (error) {
      console.error("Failed to duplicate projects:", error);
      alert("Erro ao duplicar projetos. Tente novamente.");
    }
  };

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false);
  };

  const handleDeselectAll = () => {
    onDeselectAll();
    setSelectedStatus("");
  };

  const isOperationInProgress = isUpdating || isArchiving;

  return (
    <>
      <div
        className={`bg-white-neutral-light-100 e0 py-3 sm:py-0 px-4 rounded-[10px] w-full min-h-[78px] transition-all duration-400 ease-in-out flex items-center justify-start sm:justify-center gap-2 flex-wrap mb-2 sm:flex-nowrap ${
          isVisible ? "opacity-100 " : "opacity-0 "
        }`}
      >
        <SelectInput
          className="h-[49px]"
          options={getOptions()}
          placeholder={getPlaceholderText()}
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
              {getUpdateButtonText()}
            </div>
          ) : (
            getUpdateButtonText()
          )}
        </button>

        {/* Only show Archive button in active view */}
        {viewMode === "active" && (
          <button
            onClick={handleArchiveClick}
            className={`px-4 py-2 w-[120px] h-[48px] flex items-center justify-center gap-1 text-sm font-medium rounded-[var(--radius-s)] transition-colors border border-white-neutral-light-300 ${
              isOperationInProgress
                ? "text-white-neutral-light-500 cursor-not-allowed bg-white-neutral-light-100"
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
        )}

        <button
          onClick={handleDuplicateClick}
          className={`px-4 py-2 w-[120px] h-[48px] flex items-center justify-center gap-1 text-sm font-medium rounded-[var(--radius-s)] transition-colors border border-white-neutral-light-300 ${
            isOperationInProgress
              ? "text-white-neutral-light-500 cursor-not-allowed bg-white-neutral-light-100"
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
      </div>

      <Modal
        isOpen={showArchiveModal}
        onClose={handleArchiveCancel}
        title="Confirmar Arquivamento"
        footer={false}
        closeOnClickOutside={!isArchiving}
        showCloseButton={!isArchiving}
        width="340px"
      >
        <div className="w-full p-3">
          <Image
            src="/images/archive-banner.jpg"
            width={800}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            alt="image decorativa"
            priority
          />
        </div>

        <p className="text-white-neutral-light-500 text-sm px-6 py-3 sm:p-6">
          Ao arquivar, o item será movido para a área de itens arquivados e não
          ficará mais visível na lista principal.
        </p>

        <div className="flex justify-start space-x-3 p-5 border-t border-t-white-neutral-light-300">
          <button
            type="button"
            onClick={handleArchiveConfirm}
            disabled={isArchiving}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xs ${
              isArchiving
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-blue-700 cursor-pointer button-inner-inverse"
            }`}
          >
            {isArchiving ? (
              <div className="flex items-center">
                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                Arquivando...
              </div>
            ) : (
              "Arquivar"
            )}
          </button>
          <button
            type="button"
            onClick={handleArchiveCancel}
            disabled={isArchiving}
            className={`px-4 py-2 text-sm font-medium border rounded-xs ${
              isArchiving
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDuplicateModal}
        onClose={handleDuplicateCancel}
        title="Confirmar Duplicação"
        footer={false}
        closeOnClickOutside={!isDuplicating}
        showCloseButton={!isDuplicating}
        width="340px"
      >
        <div className="w-full p-3">
          <Image
            src="/images/duplicate-banner.jpg"
            width={800}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            alt="image decorativa"
            priority
          />
        </div>

        <p className="text-white-neutral-light-500 text-sm px-6 py-3 sm:p-6">
          Tem certeza que deseja duplicar este item? Uma cópia será criada
          imediatamente.
        </p>

        <div className="flex justify-start space-x-3 p-5 border-t border-t-white-neutral-light-300">
          <button
            type="button"
            onClick={handleDuplicateConfirm}
            disabled={isDuplicating}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xs ${
              isDuplicating
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-blue-700 cursor-pointer button-inner-inverse"
            }`}
          >
            {isDuplicating ? (
              <div className="flex items-center">
                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                Duplicando...
              </div>
            ) : (
              "Duplicar"
            )}
          </button>
          <button
            type="button"
            onClick={handleDuplicateCancel}
            disabled={isDuplicating}
            className={`px-4 py-2 text-sm font-medium border rounded-xs ${
              isDuplicating
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
}
