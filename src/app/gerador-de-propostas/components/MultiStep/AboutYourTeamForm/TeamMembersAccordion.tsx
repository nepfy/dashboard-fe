import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import { TextField } from "#/components/Inputs";

import { TeamMember } from "#/types/project";

interface TeamMemberAccordionProps {
  teamMembers: TeamMember[];
  onTeamMembersChange: (members: TeamMember[]) => void;
}

export default function TeamMemberAccordion({
  teamMembers,
  onTeamMembersChange,
}: TeamMemberAccordionProps) {
  const [openMember, setOpenMember] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addTeamMember = () => {
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

  const updateMember = (
    memberId: string,
    field: keyof TeamMember,
    value: string
  ) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === memberId ? { ...member, [field]: value } : member
    );
    onTeamMembersChange(updatedMembers);
  };

  const toggleMember = (memberId: string) => {
    setOpenMember(openMember === memberId ? null : memberId);
  };

  const handleFileChange = (memberId: string, file: File | null) => {
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload the file and get a URL
      const imageUrl = URL.createObjectURL(file);
      updateMember(memberId, "photo", imageUrl);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
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
          }`}
        >
          {/* Accordion Header */}
          <div
            className={`flex items-center justify-between py-2 px-4 cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
              draggedIndex === index ? "cursor-grabbing" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (draggedIndex === null) {
                toggleMember(member.id);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center font-medium text-white-neutral-light-900 cursor-grab active:cursor-grabbing"
                  title="Arraste para reordenar"
                >
                  ⋮⋮
                </div>
                <span className="text-sm font-medium text-white-neutral-light-900">
                  Integrante {index + 1}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMember(member.id);
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Remover integrante"
              >
                <Trash2 size={16} />
              </button>
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  openMember === member.id ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {openMember === member.id && (
            <div className="pb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white-neutral-light-700 mb-2">
                  Foto
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full sm:w-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(member.id, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`photo-${member.id}`}
                    />
                    <label
                      htmlFor={`photo-${member.id}`}
                      className="w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border bg-white-neutral-light-100 border-white-neutral-light-300 rounded-2xs cursor-pointer hover:bg-white-neutral-light-200 transition-colors button-inner"
                    >
                      <PictureIcon width="16" height="16" /> Alterar imagem
                    </label>
                  </div>
                  <div className="text-xs text-white-neutral-light-500">
                    {member?.photo}
                  </div>
                </div>
                <div className="text-xs text-white-neutral-light-400 mt-3">
                  Tipo de arquivo: .jpg ou .png. Tamanho: 679×735px e peso entre
                  30 KB e 50 KB
                </div>
              </div>

              {/* Name Field */}
              <div>
                <TextField
                  label="Nome"
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
                <TextField
                  label="Cargo"
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
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
      >
        <Plus size={16} />
        Adicionar Integrante
      </button>
    </div>
  );
}
