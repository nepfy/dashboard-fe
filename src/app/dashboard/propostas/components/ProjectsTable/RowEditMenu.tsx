import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import UpdateIcon from "#/components/icons/UpdateIcon";
import CopyIcon from "#/components/icons/CopyIcon";
import EditIcon from "#/components/icons/EditIcon";
import Archive from "#/components/icons/Archive";
import AnchorLinkIcon from "#/components/icons/AnchorLinkIcon";
import Modal from "#/components/Modal";
import Portal from "#/components/Portal";

import ArchiveIcon from "./ArchiveIcon";
import DuplicateIcon from "./DuplicateIcon";
import DeleteIcon from "./DeleteIcon";
import PasswordManagerModal from "./PasswordManagerModal";
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
  onDelete?: (projectId: string) => Promise<void>;
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
  onDelete,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      proposal_status: currentStatus || undefined,
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
      case "delete":
        setShowDeleteModal(true);
        break;
      case "manage-password":
        handleManagePassword();
        break;
      default:
        onClose();
    }
  };

  const handleManagePassword = async () => {
    try {
      // Fetch current password
      const response = await fetch(`/api/projects/${projectId}`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        setCurrentPassword(result.data[0].pagePassword || null);
        setShowPasswordModal(true);
      } else {
        setCurrentPassword(null);
        setShowPasswordModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch password:", error);
      setCurrentPassword(null);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    try {
      // First, get the current project data
      const getResponse = await fetch(`/api/projects/${projectId}`);
      const getResult = await getResponse.json();

      if (
        !getResult.success ||
        !getResult.data ||
        getResult.data.length === 0
      ) {
        throw new Error("Failed to fetch project data");
      }

      const currentProject = getResult.data[0];

      // Update only the password field, keeping all other fields unchanged
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProject,
          pagePassword: newPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update password");
      }

      setCurrentPassword(newPassword);

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
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

  const handleDeleteConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(projectId);

      if (onRefresh) {
        await onRefresh();
      }

      // Mostra o toast primeiro
      toast.success("Proposta excluída com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        style: {
          borderRadius: "12px",
        },
      });

      // Pequeno delay para garantir que o toast apareça antes de fechar o modal
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Só fecha o modal DEPOIS do toast aparecer
      setIsDeleting(false);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsDeleting(false);

      toast.error("Erro ao excluir a proposta. Tente novamente.", {
        position: "top-right",
        autoClose: 3000,
        style: {
          borderRadius: "12px",
        },
      });
      // Não fecha o modal em caso de erro, para o usuário ver o toast
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const getStatusOptions = () => {
    return viewMode === "archived" ? archivedStatusOptions : statusOptions;
  };

  const getArchiveButtonText = () => {
    return viewMode === "archived" ? "Restaurar" : "Arquivar";
  };

  const isMenuDisabled =
    isUpdating ||
    isProcessing ||
    isArchiving ||
    isDuplicating ||
    isDeleting ||
    isCopyingLink;
  const hasStatusChanged = selectedStatus !== currentStatus;

  return (
    <>
      {!showArchiveModal &&
        !showDuplicateModal &&
        !showDeleteModal &&
        !showPasswordModal && (
          <Portal>
            <div
              ref={menuRef}
              className="border-white-neutral-light-300 bg-white-neutral-light-100 fixed z-50 min-w-[230px] rounded-[12px] border shadow-lg sm:min-w-[280px]"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                display:
                  showArchiveModal ||
                  showDuplicateModal ||
                  showDeleteModal ||
                  showPasswordModal
                    ? "none"
                    : "block",
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
                      ? "pointer-events-none opacity-0"
                      : "opacity-100"
                  } transition-opacity duration-200`}
                >
                  <p className="text-white-neutral-light-900 px-4 py-4 font-medium">
                    Opções
                  </p>
                  <div className="flex cursor-pointer flex-col gap-1 px-2">
                    <button
                      onClick={() => handleMenuItemClick("update-status")}
                      disabled={isMenuDisabled}
                      className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                        isMenuDisabled
                          ? "cursor-not-allowed opacity-50"
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
                      className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                        isMenuDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-white-neutral-light-300 cursor-pointer"
                      }`}
                    >
                      <CopyIcon width="16" height="16" />
                      Duplicar
                    </button>

                    <button
                      onClick={() => handleMenuItemClick("copy-link")}
                      disabled={isMenuDisabled}
                      className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                        isMenuDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-white-neutral-light-300 cursor-pointer"
                      }`}
                    >
                      {isCopyingLink ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <AnchorLinkIcon width="16" height="16" />
                      )}
                      Copiar Link
                    </button>

                    {copyLinkMessage && (
                      <div
                        className={`mx-2 rounded px-2 py-1 text-xs ${
                          copyLinkMessage.includes("sucesso")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {copyLinkMessage}
                      </div>
                    )}

                    {viewMode === "active" && (
                      <button
                        onClick={() => handleMenuItemClick("manage-password")}
                        disabled={isMenuDisabled}
                        className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                          isMenuDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-white-neutral-light-300 cursor-pointer"
                        }`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                        Gerenciar senha
                      </button>
                    )}

                    {viewMode === "active" && (
                      <button
                        onClick={() => handleMenuItemClick("edit")}
                        disabled={isMenuDisabled}
                        className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                          isMenuDisabled
                            ? "cursor-not-allowed opacity-50"
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
                        className={`text-white-neutral-light-900 my-1 flex items-center gap-1 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors ${
                          isMenuDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-white-neutral-light-300 cursor-pointer"
                        }`}
                      >
                        <Archive width="16" height="16" />
                        {getArchiveButtonText()}
                      </button>
                    )}

                    {viewMode === "active" && (
                      <button
                        onClick={() => handleMenuItemClick("delete")}
                        disabled={isMenuDisabled}
                        className={`text-white-neutral-light-900 my-1 mb-2 flex items-center gap-1 rounded-lg px-2 pt-3 pb-4 text-left text-sm font-medium transition-colors ${
                          isMenuDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-white-neutral-light-300 cursor-pointer"
                        }`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                        Excluir proposta
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Update Panel */}
                <div
                  className={`bg-white-neutral-light-100 absolute top-0 flex h-[350px] w-full flex-col justify-between rounded-[12px] transition-opacity duration-200 ${
                    showStatusPanel
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-white-neutral-light-900 border-white-neutral-light-300 border-b p-3 font-medium">
                      {viewMode === "archived"
                        ? "Restaurar Status"
                        : "Atualizar Status"}
                    </p>

                    <div className="max-h-[240px] space-y-3 overflow-y-auto px-3 py-4">
                      {getStatusOptions().map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center space-x-3 rounded-lg p-2 transition-colors ${
                            isProcessing
                              ? "cursor-not-allowed opacity-50"
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
                            className="text-primary-light-400 border-white-neutral-light-300 h-4 w-4"
                          />
                          <div className="flex items-center gap-2">
                            {getStatusBadge(option.value)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-white-neutral-light-300 flex gap-2 border-t p-3">
                    <button
                      onClick={handleStatusSave}
                      disabled={isProcessing || !hasStatusChanged}
                      className={`h-[36px] flex-1 rounded-[var(--radius-s)] text-sm font-medium transition-colors ${
                        isProcessing || !hasStatusChanged
                          ? "cursor-not-allowed bg-gray-400 opacity-50"
                          : "bg-primary-light-400 hover:bg-primary-light-500 button-inner-inverse text-white-neutral-light-100 cursor-pointer"
                      }`}
                    >
                      {isProcessing ? "Salvando..." : "Salvar"}
                    </button>

                    <button
                      onClick={handleStatusCancel}
                      disabled={isProcessing}
                      className={`border-white-neutral-light-300 button-inner h-[36px] flex-1 rounded-[var(--radius-s)] border text-sm font-medium transition-colors ${
                        isProcessing
                          ? "bg-white-neutral-light-100 cursor-not-allowed opacity-50"
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

        <p className="text-white-neutral-light-500 px-6 py-2 text-sm sm:p-6">
          {viewMode === "archived" ? (
            <>
              Ao restaurar, o item voltará para a lista principal e ficará
              visível novamente.
            </>
          ) : (
            <>
              Ao arquivar, o item será movido para a área de itens arquivados e
              não ficará mais visível na lista principal.
            </>
          )}
        </p>

        <div className="border-t-white-neutral-light-300 flex justify-start space-x-3 border-t p-6">
          <button
            type="button"
            onClick={handleArchiveCancel}
            disabled={isArchiving}
            className={`rounded-xs border px-4 py-2 text-sm font-medium ${
              isArchiving
                ? "border-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner cursor-pointer"
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleArchiveConfirm}
            disabled={isArchiving}
            className={`rounded-xs px-4 py-2 text-sm font-medium text-white ${
              isArchiving
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-primary-light-600 button-inner-inverse cursor-pointer"
            }`}
          >
            {isArchiving ? (
              <div className="flex items-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {viewMode === "archived" ? "Restaurando..." : "Arquivando..."}
              </div>
            ) : viewMode === "archived" ? (
              "Restaurar item"
            ) : (
              "Arquivar item"
            )}
          </button>
        </div>
      </Modal>

      {/* Duplicate Confirmation Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={handleDuplicateCancel}
        title="Duplicar este item?"
        footer={false}
        closeOnClickOutside={!isDuplicating}
        showCloseButton={!isDuplicating}
        width="340px"
      >
        <div className="w-full px-2 pt-4 pb-0">
          <DuplicateIcon />
        </div>

        <p className="text-white-neutral-light-500 px-6 py-2 text-sm sm:p-6">
          Tem certeza que deseja duplicar este item? Uma cópia será criada
          imediatamente.
        </p>

        <div className="border-t-white-neutral-light-300 flex justify-start space-x-3 border-t p-6">
          <button
            type="button"
            onClick={handleDuplicateCancel}
            disabled={isDuplicating}
            className={`rounded-xs border px-4 py-2 text-sm font-medium ${
              isDuplicating
                ? "border-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner cursor-pointer"
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDuplicateConfirm}
            disabled={isDuplicating}
            className={`rounded-xs px-4 py-2 text-sm font-medium text-white ${
              isDuplicating
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-primary-light-600 button-inner-inverse cursor-pointer"
            }`}
          >
            {isDuplicating ? (
              <div className="flex items-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Duplicando...
              </div>
            ) : (
              "Duplicar item"
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Excluir este item?"
        footer={false}
        closeOnClickOutside={!isDeleting}
        showCloseButton={!isDeleting}
        width="340px"
      >
        <div className="w-full px-2 pt-4 pb-0">
          <DeleteIcon />
        </div>

        <p className="text-white-neutral-light-500 px-6 py-2 text-sm sm:p-6">
          Tem certeza que deseja excluir este item? Essa ação não poderá ser
          desfeita.
        </p>

        <div className="border-t-white-neutral-light-300 flex justify-start space-x-3 border-t p-6">
          <button
            type="button"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
            className={`rounded-xs border px-4 py-2 text-sm font-medium ${
              isDeleting
                ? "border-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
                : "text-white-neutral-light-800 border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner cursor-pointer"
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className={`rounded-xs px-4 py-2 text-sm font-medium text-white ${
              isDeleting
                ? "bg-white-neutral-light-300 cursor-not-allowed"
                : "bg-primary-light-500 hover:bg-primary-light-600 button-inner-inverse cursor-pointer"
            }`}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </div>
            ) : (
              "Excluir item"
            )}
          </button>
        </div>
      </Modal>

      {/* Password Manager Modal */}
      <PasswordManagerModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          onClose();
        }}
        projectId={projectId}
        currentPassword={currentPassword}
        onPasswordChange={handlePasswordChange}
      />
    </>
  );
}
