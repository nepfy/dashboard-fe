import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import UpdateIcon from "#/components/icons/UpdateIcon";
import CopyIcon from "#/components/icons/CopyIcon";
import EditIcon from "#/components/icons/EditIcon";
import Archive from "#/components/icons/Archive";
import AnchorLinkIcon from "#/components/icons/AnchorLinkIcon";
import Modal from "#/components/Modal";
import Portal from "#/components/Portal";

import ArchiveIcon from "./ArchiveIcon";
import DuplicateIcon from "./DuplicateIcon";
import { useCopyLinkWithCache } from "#/contexts/CopyLinkCacheContext";
import { getStatusBadge } from "../ProjectsTable/getStatusBadge";
import { trackProposalClicked } from "#/lib/analytics/track";

interface RowEditMenuProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  templateType?: "flash" | "prime" | "essencial" | "grid" | "minimal" | null;
  currentStatus?: string;
  viewMode?: "active" | "archived";
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
  onDuplicate?: (projectId: string) => Promise<void>;
  isUpdating?: boolean;
  triggerElement?: HTMLElement | null;
  onRefresh?: () => Promise<void>;
}

type ProjectStatus =
  | "active"
  | "approved"
  | "negotiation"
  | "rejected"
  | "draft"
  | "expired"
  | "archived";

const statusOptions: {
  value: ProjectStatus;
  label: string;
  displayName: string;
}[] = [
  { value: "active", label: "Enviada", displayName: "Enviada" },
  { value: "approved", label: "Aprovada", displayName: "Aprovada" },
  {
    value: "negotiation",
    label: "Em negociação",
    displayName: "Em negociação",
  },
  { value: "rejected", label: "Rejeitada", displayName: "Rejeitada" },
  { value: "draft", label: "Rascunho", displayName: "Rascunho" },
  { value: "expired", label: "Expirada", displayName: "Expirada" },
];

const archivedStatusOptions: {
  value: ProjectStatus;
  label: string;
  displayName: string;
}[] = [
  { value: "active", label: "Enviada", displayName: "Restaurar como Enviada" },
  { value: "draft", label: "Rascunho", displayName: "Restaurar como Rascunho" },
];

export default function RowEditMenu({
  isOpen,
  onClose,
  projectId,
  templateType,
  currentStatus,
  viewMode = "active",
  onStatusUpdate,
  onDuplicate,
  isUpdating = false,
  triggerElement,
  onRefresh,
}: RowEditMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(
    (currentStatus as ProjectStatus) || "draft"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const [copyLinkMessage, setCopyLinkMessage] = useState<string | null>(null);

  const { copyLinkWithCache } = useCopyLinkWithCache();

  const calculatePosition = useCallback(() => {
    if (!triggerElement || !isOpen) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuWidth = 280;
    const menuHeight = showStatusPanel ? 390 : 320;

    let top = triggerRect.bottom + 5;
    let left = triggerRect.left;

    if (left + menuWidth > window.innerWidth) {
      left = triggerRect.right - menuWidth;
    }

    if (top + menuHeight > window.innerHeight) {
      top = triggerRect.top - menuHeight - 5;
    }

    if (left < 5) left = 5;
    if (top < 5) top = 5;

    setMenuPosition({ top, left });
  }, [triggerElement, isOpen, showStatusPanel]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);

      return () => {
        window.removeEventListener("resize", calculatePosition);
        window.removeEventListener("scroll", calculatePosition);
      };
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerElement?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, triggerElement]);

  const handleEditClick = () => {
    // Track proposal clicked
    trackProposalClicked({
      proposal_id: projectId,
      template_type: templateType || undefined,
      current_status: currentStatus || undefined,
    });

    router.push(`/editar?projectId=${projectId}&templateType=${templateType}`);
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      setIsCopyingLink(true);
      const result = await copyLinkWithCache(projectId);

      const message = result.fromCache
        ? "Link copiado novamente com sucesso!"
        : "Link copiado com sucesso!";

      setCopyLinkMessage(message);

      setTimeout(() => {
        setCopyLinkMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      setCopyLinkMessage("Erro ao copiar link. URL foi gerada?");

      setTimeout(() => {
        setCopyLinkMessage(null);
      }, 3000);
    } finally {
      setIsCopyingLink(false);
    }
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Action: ${action} for project: ${projectId}`);

    switch (action) {
      case "update-status":
        setShowStatusPanel(true);
        break;
      case "duplicate":
        setShowDuplicateModal(true);
        break;
      case "copy-link":
        handleCopyLink();
        break;
      case "edit":
        handleEditClick();
        break;
      case "archive":
        setShowArchiveModal(true);
        break;
      default:
        onClose();
    }
  };

  const handleStatusSave = async () => {
    if (onStatusUpdate && selectedStatus && selectedStatus !== currentStatus) {
      setIsProcessing(true);
      try {
        await onStatusUpdate(projectId, selectedStatus);
        setShowStatusPanel(false);
        onClose();
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStatusCancel = () => {
    setShowStatusPanel(false);
    setSelectedStatus((currentStatus as ProjectStatus) || "draft");
  };

  const handleArchiveConfirm = async () => {
    if (onStatusUpdate) {
      try {
        setIsArchiving(true);

        const targetStatus = viewMode === "archived" ? "active" : "archived";

        await onStatusUpdate(projectId, targetStatus);

        if (onRefresh) {
          await onRefresh();
        }

        setShowArchiveModal(false);
        onClose();
      } catch (error) {
        console.error("Failed to archive/restore project:", error);
      } finally {
        setIsArchiving(false);
      }
    } else {
      console.error("onStatusUpdate is not available");
    }
  };

  const handleArchiveCancel = () => {
    setShowArchiveModal(false);
  };

  const handleDuplicateConfirm = async () => {
    if (onDuplicate) {
      try {
        setIsDuplicating(true);
        await onDuplicate(projectId);

        if (onRefresh) {
          await onRefresh();
        }

        setShowDuplicateModal(false);
        onClose();
      } catch (error) {
        console.error("Failed to duplicate project:", error);
      } finally {
        setIsDuplicating(false);
      }
    }
  };

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false);
  };

  const getStatusOptions = () => {
    return viewMode === "archived" ? archivedStatusOptions : statusOptions;
  };

  const getArchiveButtonText = () => {
    return viewMode === "archived" ? "Restaurar" : "Arquivar";
  };

  const isMenuDisabled =
    isUpdating || isProcessing || isArchiving || isDuplicating || isCopyingLink;
  const hasStatusChanged = selectedStatus !== currentStatus;

  return (
    <>
      {!showArchiveModal && !showDuplicateModal && (
        <Portal>
          <div
            ref={menuRef}
            className="fixed shadow-lg border border-white-neutral-light-300 rounded-[12px] bg-white-neutral-light-100 z-50 min-w-[230px] sm:min-w-[280px]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              display:
                showArchiveModal || showDuplicateModal ? "none" : "block",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative ${showStatusPanel ? "h-[390px]" : "h-full"}`}
            >
              {/* Main Menu */}
              <div
                className={`${
                  showStatusPanel
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                } transition-opacity duration-200`}
              >
                <p className="font-medium text-white-neutral-light-900 px-4 py-4">
                  Opções
                </p>
                <div className="flex flex-col gap-1 cursor-pointer px-2">
                  <button
                    onClick={() => handleMenuItemClick("update-status")}
                    disabled={isMenuDisabled}
                    className={`text-left py-3 px-2 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 transition-colors ${
                      isMenuDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white-neutral-light-300 cursor-pointer"
                    }`}
                  >
                    <UpdateIcon width="16" height="16" />
                    {viewMode === "archived"
                      ? "Restaurar Status"
                      : "Atualizar Status"}
                  </button>

                  <button
                    onClick={() => handleMenuItemClick("duplicate")}
                    disabled={isMenuDisabled}
                    className={`text-left py-3 px-2 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 transition-colors ${
                      isMenuDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white-neutral-light-300 cursor-pointer"
                    }`}
                  >
                    <CopyIcon width="16" height="16" />
                    Duplicar
                  </button>

                  <button
                    onClick={() => handleMenuItemClick("copy-link")}
                    disabled={isMenuDisabled}
                    className={`text-left py-3 px-2 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 transition-colors ${
                      isMenuDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white-neutral-light-300 cursor-pointer"
                    }`}
                  >
                    {isCopyingLink ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <AnchorLinkIcon width="16" height="16" />
                    )}
                    Copiar Link
                  </button>

                  {copyLinkMessage && (
                    <div
                      className={`text-xs px-2 py-1 mx-2 rounded ${
                        copyLinkMessage.includes("sucesso")
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {copyLinkMessage}
                    </div>
                  )}

                  {viewMode === "active" && (
                    <button
                      onClick={() => handleMenuItemClick("edit")}
                      disabled={isMenuDisabled}
                      className={`text-left py-3 px-2 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 transition-colors ${
                        isMenuDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white-neutral-light-300 cursor-pointer"
                      }`}
                    >
                      <EditIcon width="16" height="16" />
                      Editar
                    </button>
                  )}

                  {viewMode === "active" && (
                    <button
                      onClick={() => handleMenuItemClick("archive")}
                      disabled={isMenuDisabled}
                      className={`text-left pb-4 pt-3 px-2 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 mb-2 transition-colors ${
                        isMenuDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white-neutral-light-300 cursor-pointer"
                      }`}
                    >
                      <Archive width="16" height="16" />
                      {getArchiveButtonText()}
                    </button>
                  )}
                </div>
              </div>

              {/* Status Update Panel */}
              <div
                className={`absolute top-0 h-[350px] w-full bg-white-neutral-light-100 flex flex-col justify-between rounded-[12px] transition-opacity duration-200 ${
                  showStatusPanel
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-white-neutral-light-900 p-3 border-b border-white-neutral-light-300">
                    {viewMode === "archived"
                      ? "Restaurar Status"
                      : "Atualizar Status"}
                  </p>

                  <div className="px-3 py-4 space-y-3 max-h-[240px] overflow-y-auto">
                    {getStatusOptions().map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                          isProcessing
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-white-neutral-light-200 cursor-pointer"
                        }`}
                      >
                        <input
                          type="radio"
                          name="projectStatus"
                          value={option.value}
                          checked={selectedStatus === option.value}
                          onChange={(e) =>
                            setSelectedStatus(e.target.value as ProjectStatus)
                          }
                          disabled={isProcessing}
                          className="w-4 h-4 text-primary-light-400 border-white-neutral-light-300"
                        />
                        <div className="flex items-center gap-2">
                          {getStatusBadge(option.value)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-t border-white-neutral-light-300 flex gap-2">
                  <button
                    onClick={handleStatusSave}
                    disabled={isProcessing || !hasStatusChanged}
                    className={`flex-1 h-[36px] text-sm font-medium rounded-[var(--radius-s)] transition-colors ${
                      isProcessing || !hasStatusChanged
                        ? "bg-gray-400 cursor-not-allowed opacity-50"
                        : "bg-primary-light-400 hover:bg-primary-light-500 cursor-pointer button-inner-inverse text-white-neutral-light-100"
                    }`}
                  >
                    {isProcessing ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    onClick={handleStatusCancel}
                    disabled={isProcessing}
                    className={`flex-1 h-[36px] text-sm font-medium border rounded-[var(--radius-s)] border-white-neutral-light-300 button-inner transition-colors ${
                      isProcessing
                        ? "bg-white-neutral-light-100 opacity-50 cursor-not-allowed"
                        : "bg-white-neutral-light-100 hover:bg-white-neutral-light-200 cursor-pointer"
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={showArchiveModal}
        onClose={handleArchiveCancel}
        title={
          viewMode === "archived"
            ? "Restaurar este item?"
            : "Arquivar este item?"
        }
        footer={false}
        closeOnClickOutside={!isArchiving}
        showCloseButton={!isArchiving}
        width="340px"
      >
        <div className="w-full px-2 pt-4 pb-0">
          <ArchiveIcon />
        </div>

        <div className="p-6 mb-2">
          <p className="text-white-neutral-light-500 text-sm leading-relaxed">
            {viewMode === "archived" ? (
              <>
                Ao restaurar, o item voltará para a <br />
                lista principal e ficará visível <br />
                novamente.
              </>
            ) : (
              <>
                Ao arquivar, o item será movido para a<br /> área de itens
                arquivados e não ficará <br /> mais visível na lista principal.
              </>
            )}
          </p>
        </div>

        <div className="flex justify-start space-x-3 p-6 border-t border-t-white-neutral-light-300">
          <button
            type="button"
            onClick={handleArchiveConfirm}
            disabled={isArchiving}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xs ${
              isArchiving
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-primary-light-600 cursor-pointer button-inner-inverse"
            }`}
          >
            {isArchiving ? (
              <div className="flex items-center">
                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                {viewMode === "archived" ? "Restaurando..." : "Arquivando..."}
              </div>
            ) : (
              getArchiveButtonText()
            )}
          </button>
          <button
            type="button"
            onClick={handleArchiveCancel}
            disabled={isArchiving}
            className={`px-4 py-2 text-sm font-medium border rounded-xs ${
              isArchiving
                ? "text-white border-white-neutral-light-300 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 cursor-pointer button-inner"
            }`}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Duplicate Confirmation Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={handleDuplicateCancel}
        title="Confirmar Duplicação"
        footer={false}
        closeOnClickOutside={!isDuplicating}
        showCloseButton={!isDuplicating}
        width="340px"
      >
        <div className="w-full px-2 pt-4 pb-0">
          <DuplicateIcon />
        </div>

        <p className="text-white-neutral-light-500 text-sm px-6 py-2 sm:p-6">
          Tem certeza que deseja duplicar esta proposta? Uma cópia será criada
          imediatamente e você poderá editar todas as informações conforme
          necessário.
        </p>

        <div className="flex justify-start space-x-3 p-6 border-t border-t-white-neutral-light-300">
          <button
            type="button"
            onClick={handleDuplicateConfirm}
            disabled={isDuplicating}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xs ${
              isDuplicating
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-primary-light-600 cursor-pointer button-inner-inverse"
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
                ? "text-white border-white-neutral-light-300 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 cursor-pointer button-inner"
            }`}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
}
