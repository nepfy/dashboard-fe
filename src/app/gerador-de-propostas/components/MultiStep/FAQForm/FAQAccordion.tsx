import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { TextField } from "#/components/Inputs";
import { TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { FAQ } from "#/types/project";

interface FAQAccordionProps {
  faqList: FAQ[];
  onFormChange: (faq: FAQ[]) => void;
  disabled?: boolean;
  errors?: { [key: string]: string };
}

export default function FAQAccordion({
  faqList,
  onFormChange,
  disabled = false,
  errors = {},
}: FAQAccordionProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [faqToRemove, setFaqToRemove] = useState<string | null>(null);

  const addFAQ = () => {
    if (disabled) return;

    const newFAQ: FAQ = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      sortOrder: faqList.length,
    };

    const updatedFAQ = [...faqList, newFAQ];
    onFormChange(updatedFAQ);
    setOpenFAQ(newFAQ.id!);
  };

  const removeFAQ = (faqId: string) => {
    if (disabled) return;

    const updatedFAQ = faqList.filter((faq) => faq.id !== faqId);
    // Update sort orders after removal
    const reorderedFAQ = updatedFAQ.map((faq, index) => ({
      ...faq,
      sortOrder: index,
    }));
    onFormChange(reorderedFAQ);

    if (openFAQ === faqId) {
      setOpenFAQ(null);
    }
  };

  const handleRemoveClick = (faqId: string) => {
    if (disabled) return;
    setFaqToRemove(faqId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (faqToRemove) {
      removeFAQ(faqToRemove);
    }
    setShowRemoveModal(false);
    setFaqToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setFaqToRemove(null);
  };

  const updateFAQ = (
    faqId: string,
    field: keyof FAQ,
    value: string | number
  ) => {
    if (disabled) return;

    const updatedFAQ = faqList.map((faq) =>
      faq.id === faqId ? { ...faq, [field]: value } : faq
    );
    onFormChange(updatedFAQ);
  };

  const toggleFAQ = (faqId: string) => {
    if (disabled) return;
    setOpenFAQ(openFAQ === faqId ? null : faqId);
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

    const reorderedFAQ = [...faqList];
    const draggedItem = reorderedFAQ[draggedIndex];

    // Remove the dragged item
    reorderedFAQ.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedFAQ.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedFAQ = reorderedFAQ.map((faq, index) => ({
      ...faq,
      sortOrder: index,
    }));

    onFormChange(updatedFAQ);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={`space-y-2 ${disabled ? "opacity-60" : ""}`}>
      {faqList.map((faq, index) => (
        <div
          key={faq.id}
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
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400"
              } ${draggedIndex === index ? "cursor-grabbing" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (!disabled && draggedIndex === null) {
                  toggleFAQ(faq.id!);
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
                    {`Pergunta ${index + 1}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    openFAQ === faq.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(faq.id!);
              }}
              disabled={disabled}
              className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-red-50"
              }`}
              title={disabled ? "Desabilitado" : "Remover pergunta"}
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Accordion Content */}
          {openFAQ === faq.id && (
            <div className="pb-4 space-y-4">
              <div>
                <p
                  className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center overflow-hidden"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Pergunta
                </p>
                <TextField
                  inputName={`question-${faq.id}`}
                  id={`question-${faq.id}`}
                  type="text"
                  placeholder="Adicione a pergunta frequente"
                  value={faq.question}
                  maxLength={100}
                  showCharCount
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFAQ(faq.id!, "question", e.target.value)
                  }
                  disabled={disabled}
                  allowOverText
                />
                {/* Show validation error for question */}
                {errors[`faq_${index}_question`] && (
                  <p className="text-red-700 text-sm font-medium mt-2">
                    {errors[`faq_${index}_question`]}
                  </p>
                )}
              </div>

              <div>
                <p
                  className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Resposta
                </p>
                <TextAreaField
                  id={`answer-${faq.id}`}
                  textareaName={`answer-${faq.id}`}
                  placeholder="Escreva a resposta para esta pergunta"
                  value={faq.answer || ""}
                  onChange={(e) => updateFAQ(faq.id!, "answer", e.target.value)}
                  rows={4}
                  showCharCount
                  maxLength={130}
                  disabled={disabled}
                  allowOverText
                  autoExpand
                />
                {/* Show validation error for answer */}
                {errors[`faq_${index}_answer`] && (
                  <p className="text-red-700 text-sm font-medium mt-2">
                    {errors[`faq_${index}_answer`]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addFAQ}
        disabled={disabled}
        className={`w-full p-4 border border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-95 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Pergunta
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
