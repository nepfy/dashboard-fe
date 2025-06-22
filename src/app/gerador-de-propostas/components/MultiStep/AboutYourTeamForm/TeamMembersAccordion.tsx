import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import { TextField } from "#/components/Inputs";
import Modal from "#/components/Modal";
import { useImageUpload } from "#/hooks/useImageUpload";

import { TeamMember } from "#/types/project";

interface TeamMemberAccordionProps {
  teamMembers: TeamMember[];
  onTeamMembersChange: (members: TeamMember[]) => void;
  disabled: boolean;
}

export default function TeamMemberAccordion({
  teamMembers,
  onTeamMembersChange,
  disabled = false,
}: TeamMemberAccordionProps) {
  const [openMember, setOpenMember] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [uploadingMembers, setUploadingMembers] = useState<Set<string>>(
    new Set()
  );

  const { uploadImage, uploadError, clearError } = useImageUpload();

  const addTeamMember = () => {
    if (disabled) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: "",
      role: "",
      sortOrder: teamMembers.length,
    };

    const updatedMembers = [...teamMembers, newMember];
    onTeamMembersChange(updatedMembers);
    setOpenMember(newMember.id);
  };

  const removeMember = (memberId: string) => {
    if (disabled) return;
    const updatedMembers = teamMembers.filter(
      (member) => member.id !== memberId
    );
    // Update sort orders after removal
    const reorderedMembers = updatedMembers.map((member, index) => ({
      ...member,
      sortOrder: index,
    }));
    onTeamMembersChange(reorderedMembers);

    if (openMember === memberId) {
      setOpenMember(null);
    }
  };

  const handleRemoveClick = (memberId: string) => {
    if (disabled) return;
    setMemberToRemove(memberId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeMember(memberToRemove);
    }
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

  const updateMember = (
    memberId: string,
    field: keyof TeamMember,
    value: string
  ) => {
    if (disabled) return;
    const updatedMembers = teamMembers.map((member) =>
      member.id === memberId ? { ...member, [field]: value } : member
    );
    onTeamMembersChange(updatedMembers);
  };

  const toggleMember = (memberId: string) => {
    if (disabled) return;
    setOpenMember(openMember === memberId ? null : memberId);
  };

  const handleFileChange = async (memberId: string, file: File | null) => {
    if (!file) return;

    try {
      clearError();

      setUploadingMembers((prev) => new Set(prev).add(memberId));

      const result = await uploadImage(file);

      if (result.success && result.data) {
        updateMember(memberId, "photo", result.data.url);
      } else {
        console.error("Upload failed:", result.error);
        alert(result.error || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploadingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const isUploadingForMember = (memberId: string) => {
    return uploadingMembers.has(memberId);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (disabled) return;
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedMembers = [...teamMembers];
    const draggedMember = reorderedMembers[draggedIndex];

    // Remove the dragged item
    reorderedMembers.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedMembers.splice(dropIndex, 0, draggedMember);

    // Update sort orders
    const updatedMembers = reorderedMembers.map((member, index) => ({
      ...member,
      sortOrder: index,
    }));

    onTeamMembersChange(updatedMembers);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {teamMembers.map((member, index) => (
        <div
          key={member.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            draggedIndex === index ? "opacity-50 scale-95" : ""
          } ${
            dragOverIndex === index && draggedIndex !== index
              ? "border-2 border-primary-light-400 border-dashed"
              : ""
          } ${disabled ? "opacity-60" : ""}`}
        >
          {/* Accordion Header */}
          <div className="flex justify-center gap-4 w-full">
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                disabled
                  ? "cursor-not-allowed"
                  : draggedIndex === index
                  ? "cursor-grabbing"
                  : "cursor-grab hover:bg-white-neutral-light-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (!disabled && draggedIndex === null) {
                  toggleMember(member.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center font-medium text-white-neutral-light-900 ${
                      disabled
                        ? "cursor-not-allowed"
                        : "cursor-grab active:cursor-grabbing"
                    }`}
                    title={disabled ? "Desabilitado" : "Arraste para reordenar"}
                  >
                    ⋮⋮
                  </div>
                  <span className="text-sm font-medium text-white-neutral-light-900">
                    Integrante {index + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    openMember === member.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(member.id);
              }}
              disabled={disabled}
              className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-red-50"
              }`}
              title={disabled ? "Desabilitado" : "Remover integrante"}
            >
              <Trash2 size={16} />
            </button>
          </div>

          {openMember === member.id && (
            <div className="pb-4 space-y-4">
              <div>
                <label
                  className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Foto
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(member.id, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`photo-${member.id}`}
                      disabled={isUploadingForMember(member.id)}
                    />
                    <label
                      htmlFor={`photo-${member.id}`}
                      className={`w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white-neutral-light-300 rounded-2xs transition-colors button-inner ${
                        isUploadingForMember(member.id)
                          ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                          : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                      }`}
                    >
                      {isUploadingForMember(member.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <PictureIcon width="16" height="16" />
                          Alterar imagem
                        </>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-white-neutral-light-500">
                    {member.photo
                      ? "Imagem carregada"
                      : "Nenhuma imagem selecionada"}
                  </div>
                </div>

                <div className="text-xs text-white-neutral-light-400 mt-3">
                  Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo: 5MB
                </div>

                {/* Show upload error if exists */}
                {uploadError && isUploadingForMember(member.id) && (
                  <div className="text-xs text-red-500 mt-2">{uploadError}</div>
                )}
              </div>

              {/* Name Field */}
              <div>
                <p
                  className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Nome
                </p>
                <TextField
                  inputName={`name-${member.id}`}
                  id={`name-${member.id}`}
                  type="text"
                  placeholder="Nome do integrante"
                  value={member.name}
                  onChange={(e) =>
                    updateMember(member.id, "name", e.target.value)
                  }
                />
              </div>

              {/* Role Field */}
              <div>
                <p
                  className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Cargo
                </p>
                <TextField
                  inputName={`role-${member.id}`}
                  id={`role-${member.id}`}
                  type="text"
                  placeholder="Cargo do integrante"
                  value={member.role}
                  onChange={(e) =>
                    updateMember(member.id, "role", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addTeamMember}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Integrante
      </button>

      <Modal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        title="Tem certeza de que deseja excluir este item?"
        footer={false}
      >
        <p className="text-white-neutral-light-500 text-sm mb-6 p-6">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex items-center gap-3 border-t border-white-neutral-light-300 p-6">
          <button
            type="button"
            onClick={handleConfirmRemove}
            className="px-4 py-2 text-sm font-medium bg-primary-light-500 button-inner-inverse border rounded-[12px] text-white-neutral-light-100 border-white-neutral-light-300 hover:bg-primary-light-600 cursor-pointer"
          >
            Remover
          </button>
          <button
            type="button"
            onClick={handleCancelRemove}
            className="px-4 py-2 text-sm font-medium border rounded-[12px] text-gray-700 border-white-neutral-light-300 hover:bg-gray-50 cursor-pointer button-inner"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
