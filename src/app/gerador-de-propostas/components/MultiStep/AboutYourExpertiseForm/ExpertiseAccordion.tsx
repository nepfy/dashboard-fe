import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { Expertise } from "#/types/project";
import DiamondIcon from "./iconsList/DiamondIcon";
import CircleIcon from "./iconsList/CircleIcon";
import BubblesIcon from "./iconsList/BubblesIcon";
import ClockIcon from "./iconsList/CircleIcon";
import GearIcon from "./iconsList/GearIcon";
import HexagonalIcon from "./iconsList/HexagonalIcon";
import SwitchIcon from "./iconsList/SwitchIcon";
import ThunderIcon from "./iconsList/ThunderIcon";
import GlobeIcon from "./iconsList/GlobeIcon";
import BellIcon from "./iconsList/BellIcon";
import BulbIcon from "./iconsList/BulbIcon";
import StarIcon from "./iconsList/StarIcon";
import HeartIcon from "./iconsList/HeartIcon";
import AwardIcon from "./iconsList/AwardIcon";
import CrownIcon from "./iconsList/CrownIcon";
import KeyIcon from "./iconsList/KeyIcon";
import EyeIcon from "./iconsList/EyeIcon";
import FolderIcon from "./iconsList/FolderIcon";
import PlayIcon from "./iconsList/PlayIcon";
import CubeIcon from "./iconsList/CubeIcon";

interface ExpertiseAccordionProps {
  expertise: Expertise[];
  onExpertiseChange: (expertise: Expertise[]) => void;
}

const iconOptions = [
  { id: "diamond", icon: <DiamondIcon />, name: "DiamondIcon" },
  { id: "circle", icon: <CircleIcon />, name: "CircleIcon" },
  { id: "bubbles", icon: <BubblesIcon />, name: "BubblesIcon" },
  { id: "clock", icon: <ClockIcon />, name: "ClockIcon" },
  { id: "gear", icon: <GearIcon />, name: "GearIcon" },
  { id: "hexagonal", icon: <HexagonalIcon />, name: "HexagonalIcon" },
  { id: "switch", icon: <SwitchIcon />, name: "SwitchIcon" },
  { id: "thunder", icon: <ThunderIcon />, name: "ThunderIcon" },
  { id: "globe", icon: <GlobeIcon />, name: "GlobeIcon" },
  { id: "bell", icon: <BellIcon />, name: "BellIcon" },
  { id: "bulb", icon: <BulbIcon />, name: "BulbIcon" },
  { id: "star", icon: <StarIcon />, name: "StarIcon" },
  { id: "heart", icon: <HeartIcon />, name: "HeartIcon" },
  { id: "award", icon: <AwardIcon />, name: "AwardIcon" },
  { id: "crown", icon: <CrownIcon />, name: "CrownIcon" },
  { id: "key", icon: <KeyIcon />, name: "KeyIcon" },
  { id: "eye", icon: <EyeIcon />, name: "EyeIcon" },
  { id: "folder", icon: <FolderIcon />, name: "FolderIcon" },
  { id: "play", icon: <PlayIcon />, name: "PlayIcon" },
  { id: "cube", icon: <CubeIcon />, name: "CubeIcon" },
];

export default function ExpertiseAccordion({
  expertise,
  onExpertiseChange,
}: ExpertiseAccordionProps) {
  const [openExpertise, setOpenExpertise] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [expertiseToRemove, setExpertiseToRemove] = useState<string | null>(
    null
  );

  const addExpertise = () => {
    const newExpertise: Expertise = {
      id: `expertise-${Date.now()}`,
      title: "",
      description: "",
      icon: iconOptions[0].icon, // Default to first icon
      sortOrder: expertise.length,
    };

    const updatedExpertise = [...expertise, newExpertise];
    onExpertiseChange(updatedExpertise);
    setOpenExpertise(newExpertise.id);
  };

  const removeExpertise = (expertiseId: string) => {
    const updatedExpertise = expertise.filter(
      (item) => item.id !== expertiseId
    );
    // Update sort orders after removal
    const reorderedExpertise = updatedExpertise.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));
    onExpertiseChange(reorderedExpertise);

    if (openExpertise === expertiseId) {
      setOpenExpertise(null);
    }
  };

  const handleRemoveClick = (expertiseId: string) => {
    setExpertiseToRemove(expertiseId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (expertiseToRemove) {
      removeExpertise(expertiseToRemove);
    }
    setShowRemoveModal(false);
    setExpertiseToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setExpertiseToRemove(null);
  };

  const updateExpertise = (
    expertiseId: string,
    field: keyof Expertise,
    value: string
  ) => {
    const updatedExpertise = expertise.map((item) =>
      item.id === expertiseId ? { ...item, [field]: value } : item
    );
    onExpertiseChange(updatedExpertise);
  };

  const toggleExpertise = (expertiseId: string) => {
    setOpenExpertise(openExpertise === expertiseId ? null : expertiseId);
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

    const reorderedExpertise = [...expertise];
    const draggedItem = reorderedExpertise[draggedIndex];

    // Remove the dragged item
    reorderedExpertise.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedExpertise.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedExpertise = reorderedExpertise.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    onExpertiseChange(updatedExpertise);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {expertise.map((item, index) => (
        <div
          key={item.id}
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
          <div className="flex justify-center gap-4 w-full">
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                draggedIndex === index ? "cursor-grabbing" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (draggedIndex === null) {
                  toggleExpertise(item.id);
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
                    Especialização {index + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    openExpertise === item.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(item.id);
              }}
              className="text-white-neutral-light-900 w-11 h-11 hover:bg-red-50 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 cursor-pointer"
              title="Remover especialização"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {openExpertise === item.id && (
            <div className="pb-4 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-white-neutral-light-800 text-sm">
                  <input
                    type="checkbox"
                    checked={!item.icon}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateExpertise(item.id, "icon", "");
                      } else {
                        updateExpertise(item.id, "icon", iconOptions[0].name);
                      }
                    }}
                    className="border border-white-neutral-light-300 checkbox-custom"
                  />
                  Ocultar ícones
                </label>
              </div>

              {/* Icon Selection */}
              {item.icon && (
                <div>
                  <label className="block text-sm font-medium text-white-neutral-light-700 mb-2">
                    Ícone
                  </label>
                  <div className="rounded-2xs bg-white-neutral-light-100 flex items-center justify-center">
                    <div className="grid grid-cols-5 lg:grid-cols-10 gap-4 place-content-center p-4 max-w-[480px]">
                      {iconOptions.map((iconOption) => (
                        <button
                          key={iconOption.id}
                          type="button"
                          onClick={() =>
                            updateExpertise(item.id, "icon", iconOption.name)
                          }
                          className={`flex items-center justify-center rounded-2xs transition-colors cursor-pointer col-span-1 ${
                            item.icon === iconOption.name
                              ? "bg-primary-light-100"
                              : "bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
                          }`}
                          title={iconOption.name}
                        >
                          <span>{iconOption.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <TextField
                  label="Título"
                  inputName={`title-${item.id}`}
                  id={`title-${item.id}`}
                  type="text"
                  placeholder="Nome da especialização"
                  value={item.title}
                  onChange={(e) =>
                    updateExpertise(item.id, "title", e.target.value)
                  }
                />
              </div>

              <div>
                <TextAreaField
                  label="Descrição"
                  id={`description-${item.id}`}
                  textareaName={`description-${item.id}`}
                  placeholder="Descreva esta especialização"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateExpertise(item.id, "description", e.target.value)
                  }
                  rows={3}
                  showCharCount
                  maxLength={200}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addExpertise}
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
      >
        <Plus size={16} />
        Adicionar especialização
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
