import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import UpdateIcon from "#/components/icons/UpdateIcon";
import CopyIcon from "#/components/icons/CopyIcon";
import EditIcon from "#/components/icons/EditIcon";
import Archive from "#/components/icons/Archive";
import AnchorLinkIcon from "#/components/icons/AnchorLinkIcon";
import Modal from "#/components/Modal";
import Portal from "#/components/Portal"; // Import the Portal component
import { getStatusBadge } from "../ProjectsTable/getStatusBadge";

interface RowEditMenuProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentStatus?: string;
  viewMode?: "active" | "archived";
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
  onDuplicate?: (projectId: string) => Promise<void>;
  onArchive?: (projectId: string) => Promise<void>;
  isUpdating?: boolean;
  triggerElement?: HTMLElement | null; // Reference to the button that triggered the menu
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
  currentStatus,
  viewMode = "active",
  onStatusUpdate,
  onDuplicate,
  onArchive,
  isUpdating = false,
  triggerElement,
}: RowEditMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(
    (currentStatus as ProjectStatus) || "draft"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Modal states
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Calculate menu position based on trigger element
  const calculatePosition = useCallback(() => {
    if (!triggerElement || !isOpen) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuWidth = 280; // min-w-[280px]
    const menuHeight = showStatusPanel ? 390 : 280; // Approximate heights

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = triggerRect.right - menuWidth;
    let top = triggerRect.bottom + 4;

    // Adjust if menu would go off the right edge
    if (left < 8) {
      left = 8;
    }

    // Adjust if menu would go off the left edge
    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8;
    }

    // Adjust if menu would go off the bottom edge
    if (top + menuHeight > viewportHeight - 8) {
      top = triggerRect.top - menuHeight - 4;

      // If still off-screen, position it at the top with some margin
      if (top < 8) {
        top = 8;
      }
    }

    setMenuPosition({ top, left });
  }, [triggerElement, isOpen, showStatusPanel]);

  // Calculate position when menu opens or status panel changes
  useEffect(() => {
    if (isOpen) {
      calculatePosition();

      // Recalculate on scroll and resize
      const handleScroll = () => calculatePosition();
      const handleResize = () => calculatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, calculatePosition]);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Also check if click is on the trigger element to prevent immediate reopening
        if (triggerElement && !triggerElement.contains(event.target as Node)) {
          // Only close if no modals are open
          if (!showArchiveModal && !showDuplicateModal) {
            onClose();
          }
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showArchiveModal) {
          setShowArchiveModal(false);
        } else if (showDuplicateModal) {
          setShowDuplicateModal(false);
        } else if (showStatusPanel) {
          setShowStatusPanel(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [
    isOpen,
    onClose,
    showStatusPanel,
    showArchiveModal,
    showDuplicateModal,
    triggerElement,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setShowStatusPanel(false);
      setIsProcessing(false);
      setShowArchiveModal(false);
      setShowDuplicateModal(false);
      setIsArchiving(false);
      setIsDuplicating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus as ProjectStatus);
    }
  }, [currentStatus]);

  if (!isOpen) {
    return null;
  }

  const handleEditClick = () => {
    router.push(`/gerador-de-propostas?editId=${projectId}`);
    onClose();
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
        navigator.clipboard.writeText(
          `${window.location.origin}/propostas/${projectId}`
        );
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

  // Archive modal handlers
  const handleArchiveConfirm = async () => {
    if (onArchive) {
      try {
        setIsArchiving(true);
        await onArchive(projectId);
        setShowArchiveModal(false);
        onClose();
      } catch (error) {
        console.error("Failed to archive/unarchive project:", error);
      } finally {
        setIsArchiving(false);
      }
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
    return viewMode === "archived" ? "Restaurar" : "Confirmar";
  };

  const isMenuDisabled =
    isUpdating || isProcessing || isArchiving || isDuplicating;
  const hasStatusChanged = selectedStatus !== currentStatus;

  return (
    <>
      <Portal>
        <div
          ref={menuRef}
          className="fixed shadow-lg border border-white-neutral-light-300 rounded-[12px] bg-white-neutral-light-100 z-50 min-w-[230px] sm:min-w-[280px]"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
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
                  <AnchorLinkIcon width="16" height="16" />
                  Copiar Link
                </button>

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
                    ? "Restaurar status"
                    : "Atualizar status"}
                </p>

                <div className="p-3 bg-white-neutral-light-100">
                  <div className="space-y-2">
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
                          className="w-4 h-4 text-primary-light-400 border-white-neutral-light-300 focus:ring-primary-light-400 focus:ring-2"
                        />
                        <div className="flex items-center gap-2">
                          {getStatusBadge(option.value)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 flex items-center gap-2 border-t border-t-white-neutral-light-300 bg-white-neutral-light-50 rounded-b-[12px] bg-white-neutral-light-100">
                <button
                  onClick={handleStatusSave}
                  disabled={isProcessing || !hasStatusChanged}
                  className={`flex-1 h-[36px] text-sm font-medium text-white rounded-[var(--radius-s)] border border-primary-light-25 transition-colors ${
                    isProcessing || !hasStatusChanged
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-primary-light-400 hover:bg-primary-light-500 cursor-pointer button-inner-inverse"
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

        <p className="text-white-neutral-light-500 text-sm px-6 py-2 sm:p-6">
          Tem certeza que deseja duplicar esta proposta? Uma cópia será criada
          imediatamente e você poderá editar todas as informações conforme
          necessário.
        </p>

        <div className="flex justify-start space-x-3 p-6 border-t border-t-white-neutral-light-300">
          <button
            type="button"
            onClick={handleDuplicateCancel}
            disabled={isDuplicating}
            className={`px-4 py-2 text-sm font-medium border rounded-xs ${
              isDuplicating
                ? "text-gray-400 border-white-neutral-light-300 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 cursor-pointer button-inner"
            }`}
          >
            Cancelar
          </button>
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
              "Confirmar"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
