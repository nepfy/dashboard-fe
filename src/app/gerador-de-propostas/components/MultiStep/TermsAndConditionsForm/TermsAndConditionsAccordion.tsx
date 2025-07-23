import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { TermsCondition } from "#/types/project";

interface TermsAndConditionsAccordionProps {
  termsConditionsList: TermsCondition[];
  onFormChange: (termsConditions: TermsCondition[]) => void;
  disabled?: boolean;
  errors?: { [key: string]: string };
}

export default function TermsAndConditionsAccordion({
  termsConditionsList,
  onFormChange,
  disabled = false,
  errors = {},
}: TermsAndConditionsAccordionProps) {
  const [openTermsCondition, setOpenTermsCondition] = useState<string | null>(
    null
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [termsConditionToRemove, setTermsConditionToRemove] = useState<
    string | null
  >(null);

  const addTermsCondition = () => {
    if (disabled) return;

    const newTermsCondition: TermsCondition = {
      id: `terms-condition-${Date.now()}`,
      title: "",
      description: "",
      sortOrder: termsConditionsList.length,
    };

    const updatedTermsConditions = [...termsConditionsList, newTermsCondition];
    onFormChange(updatedTermsConditions);
    setOpenTermsCondition(newTermsCondition.id!);
  };

  const removeTermsCondition = (termsConditionId: string) => {
    if (disabled) return;

    const updatedTermsConditions = termsConditionsList.filter(
      (termsCondition) => termsCondition.id !== termsConditionId
    );
    // Update sort orders after removal
    const reorderedTermsConditions = updatedTermsConditions.map(
      (termsCondition, index) => ({
        ...termsCondition,
        sortOrder: index,
      })
    );
    onFormChange(reorderedTermsConditions);

    if (openTermsCondition === termsConditionId) {
      setOpenTermsCondition(null);
    }
  };

  const handleRemoveClick = (termsConditionId: string) => {
    if (disabled) return;
    setTermsConditionToRemove(termsConditionId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (disabled) return;
    if (termsConditionToRemove) {
      removeTermsCondition(termsConditionToRemove);
    }
    setShowRemoveModal(false);
    setTermsConditionToRemove(null);
  };

  const handleCancelRemove = () => {
    if (disabled) return;
    setShowRemoveModal(false);
    setTermsConditionToRemove(null);
  };

  const updateTermsCondition = (
    termsConditionId: string,
    field: keyof TermsCondition,
    value: string | number
  ) => {
    if (disabled) return;
    const updatedTermsConditions = termsConditionsList.map((termsCondition) =>
      termsCondition.id === termsConditionId
        ? { ...termsCondition, [field]: value }
        : termsCondition
    );
    onFormChange(updatedTermsConditions);
  };

  const toggleTermsCondition = (termsConditionId: string) => {
    if (disabled) return;
    setOpenTermsCondition(
      openTermsCondition === termsConditionId ? null : termsConditionId
    );
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
    e.preventDefault();
    if (disabled) return;

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedTermsConditions = [...termsConditionsList];
    const draggedItem = reorderedTermsConditions[draggedIndex];

    // Remove the dragged item
    reorderedTermsConditions.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedTermsConditions.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedTermsConditions = reorderedTermsConditions.map(
      (termsCondition, index) => ({
        ...termsCondition,
        sortOrder: index,
      })
    );

    onFormChange(updatedTermsConditions);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    if (disabled) return;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={`space-y-2 ${disabled ? "opacity-60" : ""}`}>
      {termsConditionsList.map((termsCondition, index) => (
        <div
          key={termsCondition.id}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
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
            className="flex justify-center gap-4 w-full"
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onClick={(e) => {
              e.preventDefault();
              if (!disabled && draggedIndex === null) {
                toggleTermsCondition(termsCondition.id!);
              }
            }}
            title={disabled ? "Desabilitado" : "Arraste para reordenar"}
          >
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400"
              } ${draggedIndex === index ? "cursor-grabbing" : ""}`}
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
                  <span
                    className="text-sm font-medium text-white-neutral-light-900 cursor-pointer select-text overflow-hidden"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!disabled) {
                        toggleTermsCondition(termsCondition.id!);
                      }
                    }}
                  >
                    {`Termo ${index + 1}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                  } ${
                    openTermsCondition === termsCondition.id ? "rotate-180" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) {
                      toggleTermsCondition(termsCondition.id!);
                    }
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(termsCondition.id!);
              }}
              disabled={disabled}
              className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-red-50"
              }`}
              title={disabled ? "Desabilitado" : "Remover termo"}
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Accordion Content */}
          {openTermsCondition === termsCondition.id && (
            <div className="pb-4 space-y-4">
              <div>
                <label
                  className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Título
                </label>
                <TextAreaField
                  id={`title-${termsCondition.id}`}
                  textareaName={`title-${termsCondition.id}`}
                  placeholder="Adicione o título desejado"
                  value={termsCondition.title}
                  rows={2}
                  showCharCount
                  disabled={disabled}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    updateTermsCondition(
                      termsCondition.id!,
                      "title",
                      e.target.value
                    )
                  }
                  charCountMessage="Recomendado: 80 caracteres"
                  autoExpand
                />
                {/* Show validation error for title */}
                {errors[`termsCondition_${index}_title`] && (
                  <p className="text-red-700 text-sm font-medium mt-2">
                    {errors[`termsCondition_${index}_title`]}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Descrição
                </label>
                <TextAreaField
                  id={`description-${termsCondition.id}`}
                  textareaName={`description-${termsCondition.id}`}
                  placeholder="Descreva este termo ou condição"
                  value={termsCondition.description || ""}
                  onChange={(e) =>
                    updateTermsCondition(
                      termsCondition.id!,
                      "description",
                      e.target.value
                    )
                  }
                  rows={4}
                  showCharCount
                  disabled={disabled}
                  autoExpand
                  charCountMessage="Recomendado: 380 caracteres"
                />
                {/* Show validation error for description */}
                {errors[`termsCondition_${index}_description`] && (
                  <p className="text-red-700 text-sm font-medium mt-2">
                    {errors[`termsCondition_${index}_description`]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addTermsCondition}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Termo
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
