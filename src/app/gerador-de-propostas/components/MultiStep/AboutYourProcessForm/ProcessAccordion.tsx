import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { ProcessStep } from "#/types/project";

interface ProcessAccordionProps {
  processList: ProcessStep[];
  onFormChange: (processSteps: ProcessStep[]) => void;
  disabled?: boolean;
  errors?: { [key: string]: string };
}

export default function ProcessAccordion({
  processList,
  onFormChange,
  disabled = false,
  errors = {},
}: ProcessAccordionProps) {
  const [openProcess, setOpenProcess] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [processToRemove, setProcessToRemove] = useState<string | null>(null);

  const addProcess = () => {
    if (disabled) return;

    const newProcess: ProcessStep = {
      id: `process-${Date.now()}`,
      stepCounter: processList.length + 1,
      stepName: "",
      description: "",
      sortOrder: processList.length,
    };

    const updatedProcess = [...processList, newProcess];
    onFormChange(updatedProcess);
    setOpenProcess(newProcess.id);
  };

  const removeProcess = (processId: string) => {
    if (disabled) return;

    const updatedProcess = processList.filter(
      (process) => process.id !== processId
    );
    // Update sort orders and step counters after removal
    const reorderedProcess = updatedProcess.map((process, index) => ({
      ...process,
      stepCounter: index + 1,
      sortOrder: index,
    }));
    onFormChange(reorderedProcess);

    if (openProcess === processId) {
      setOpenProcess(null);
    }
  };

  const handleRemoveClick = (processId: string) => {
    if (disabled) return;
    setProcessToRemove(processId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (processToRemove) {
      removeProcess(processToRemove);
    }
    setShowRemoveModal(false);
    setProcessToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setProcessToRemove(null);
  };

  const updateProcess = (
    processId: string,
    field: keyof ProcessStep,
    value: string | number
  ) => {
    if (disabled) return;

    const updatedProcess = processList.map((process) =>
      process.id === processId ? { ...process, [field]: value } : process
    );
    onFormChange(updatedProcess);
  };

  const toggleProcess = (processId: string) => {
    if (disabled) return;
    setOpenProcess(openProcess === processId ? null : processId);
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

    const reorderedProcess = [...processList];
    const draggedItem = reorderedProcess[draggedIndex];

    // Remove the dragged item
    reorderedProcess.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedProcess.splice(dropIndex, 0, draggedItem);

    // Update sort orders and step counters
    const updatedProcess = reorderedProcess.map((process, index) => ({
      ...process,
      stepCounter: index + 1,
      sortOrder: index,
    }));

    onFormChange(updatedProcess);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Helper function to get the error for a specific field of a process item
  const getFieldError = (index: number, field: string) => {
    return errors[`process_${index}_${field}`];
  };

  // Helper function to check if a process item has any errors
  const hasProcessItemErrors = (index: number) => {
    return Object.keys(errors).some((key) =>
      key.startsWith(`process_${index}_`)
    );
  };

  return (
    <div className="space-y-2">
      {processList.map((process, index) => {
        const hasErrors = hasProcessItemErrors(index);

        return (
          <div
            key={process.id}
            className={`transition-all duration-200 ${
              draggedIndex === index ? "opacity-50 scale-95" : ""
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? "border-2 border-primary-light-400 border-dashed"
                : ""
            } ${disabled ? "opacity-60" : ""}`}
          >
            {/* Accordion Header */}
            <div
              className="flex justify-center gap-4 w-full"
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div
                className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors rounded-2xs mb-4 ${
                  hasErrors
                    ? "bg-red-light-10 border border-red-light-50"
                    : "bg-white-neutral-light-300"
                } ${
                  disabled
                    ? "cursor-not-allowed"
                    : "hover:bg-white-neutral-light-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled && draggedIndex === null) {
                    toggleProcess(process.id);
                  }
                }}
              >
                <div className="flex items-center gap-3" draggable={!disabled}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 flex items-center justify-center font-medium text-white-neutral-light-900 ${
                        disabled
                          ? "cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing"
                      }`}
                      title={
                        disabled ? "Desabilitado" : "Arraste para reordenar"
                      }
                    >
                      ⋮⋮
                    </div>
                    <span className="text-sm font-medium text-white-neutral-light-900">
                      Etapa {process.stepCounter}
                      {hasErrors && (
                        <span className="text-red-700 ml-1">*</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      openProcess === process.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick(process.id);
                }}
                disabled={disabled}
                className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-red-50"
                }`}
                title={disabled ? "Desabilitado" : "Remover etapa"}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Accordion Content */}
            {openProcess === process.id && (
              <div className="pb-4 space-y-4">
                <div>
                  <label
                    className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Nome da etapa
                  </label>
                  <TextField
                    id={`process-step-name-${process.id}`}
                    inputName={`process-step-name-${process.id}`}
                    type="text"
                    placeholder="Ex: Análise inicial"
                    value={process.stepName || ""}
                    onChange={(e) =>
                      updateProcess(process.id, "stepName", e.target.value)
                    }
                    error={getFieldError(index, "stepName")}
                    disabled={disabled}
                    showCharCount
                    charCountMessage="Recomendado: 25 caracteres"
                  />
                </div>

                <div>
                  <p
                    className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Descrição
                  </p>
                  <TextAreaField
                    id={`process-description-${process.id}`}
                    textareaName={`process-description-${process.id}`}
                    placeholder="Descreva detalhadamente esta etapa do processo"
                    value={process.description || ""}
                    onChange={(e) =>
                      updateProcess(process.id, "description", e.target.value)
                    }
                    error={getFieldError(index, "description")}
                    disabled={disabled}
                    autoExpand={true}
                    showCharCount
                    charCountMessage="Recomendado: 300 caracteres"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addProcess}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Etapa
      </button>

      <Modal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        title="Tem certeza de que deseja excluir este item?"
        footer={false}
      >
        <p className="text-white-neutral-light-900 text-sm px-6 pb-7">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex items-center gap-3 border-t border-white-neutral-light-300 p-6">
          <button
            type="button"
            onClick={handleConfirmRemove}
            className="px-4 py-2 text-sm font-medium bg-primary-light-500 button-inner-inverse border rounded-[12px] text-white-neutral-light-100 border-white-neutral-light-300 hover:bg-primary-light-600 cursor-pointer"
          >
            Excluir
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
