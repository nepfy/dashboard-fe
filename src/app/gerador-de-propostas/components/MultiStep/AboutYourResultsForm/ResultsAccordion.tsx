import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import { TextField } from "#/components/Inputs";

import { Result } from "#/types/project";

interface ResultsAccordionProps {
  results: Result[];
  onResultsChange: (results: Result[]) => void;
}

export default function ResultsAccordion({
  results,
  onResultsChange,
}: ResultsAccordionProps) {
  const [openResult, setOpenResult] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addResult = () => {
    const newResult: Result = {
      id: `result-${Date.now()}`,
      client: "",
      subtitle: "",
      investment: "",
      roi: "",
      sortOrder: results.length,
    };

    const updatedResults = [...results, newResult];
    onResultsChange(updatedResults);
    setOpenResult(newResult.id);
  };

  const removeResult = (resultId: string) => {
    const updatedResults = results.filter((result) => result.id !== resultId);
    // Update sort orders after removal
    const reorderedResults = updatedResults.map((result, index) => ({
      ...result,
      sortOrder: index,
    }));
    onResultsChange(reorderedResults);

    if (openResult === resultId) {
      setOpenResult(null);
    }
  };

  const updateResult = (
    resultId: string,
    field: keyof Result,
    value: string | number
  ) => {
    const updatedResults = results.map((result) =>
      result.id === resultId ? { ...result, [field]: value } : result
    );
    onResultsChange(updatedResults);
  };

  const toggleResult = (resultId: string) => {
    setOpenResult(openResult === resultId ? null : resultId);
  };

  const handleFileChange = (resultId: string, file: File | null) => {
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload the file and get a URL
      const imageUrl = URL.createObjectURL(file);
      updateResult(resultId, "photo", imageUrl);
    }
  };

  // Currency mask function
  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    // Convert to number and divide by 100 to handle cents
    const number = parseInt(numericValue) / 100;

    // Format as Brazilian currency
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

    const reorderedResults = [...results];
    const draggedResult = reorderedResults[draggedIndex];

    // Remove the dragged item
    reorderedResults.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedResults.splice(dropIndex, 0, draggedResult);

    // Update sort orders
    const updatedResults = reorderedResults.map((result, index) => ({
      ...result,
      sortOrder: index,
    }));

    onResultsChange(updatedResults);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCurrencyChange = (
    resultId: string,
    field: "investment" | "roi",
    value: string
  ) => {
    const formattedValue = formatCurrency(value);
    updateResult(resultId, field, formattedValue);
  };

  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <div
          key={result.id}
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
                toggleResult(result.id);
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
                  Resultado {index + 1}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeResult(result.id);
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Remover resultado"
              >
                <Trash2 size={16} />
              </button>
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  openResult === result.id ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {openResult === result.id && (
            <div className="pb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white-neutral-light-700 mb-2">
                  Foto
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(result.id, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`photo-${result.id}`}
                    />
                    <label
                      htmlFor={`photo-${result.id}`}
                      className="w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border bg-white-neutral-light-100 border-white-neutral-light-300 rounded-2xs cursor-pointer hover:bg-white-neutral-light-200 transition-colors button-inner"
                    >
                      <PictureIcon width="16" height="16" /> Alterar imagem
                    </label>
                  </div>
                  <div className="text-xs text-white-neutral-light-500">
                    {result?.photo}
                  </div>
                </div>
                <div className="text-xs text-white-neutral-light-400 mt-3">
                  Tipo de arquivo: .jpg ou .png. Tamanho: 679×735px e peso entre
                  30 KB e 50 KB
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Cliente"
                  inputName={`client-${result.id}`}
                  id={`client-${result.id}`}
                  type="text"
                  placeholder="Nome do cliente"
                  value={result.client || ""}
                  onChange={(e) =>
                    updateResult(result.id, "client", e.target.value)
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-white-neutral-light-700 mb-1.5">
                    Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-neutral-light-600 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      name={`subtitle-${result.id}`}
                      id={`subtitle-${result.id}`}
                      placeholder="Adicione o perfil do instagram"
                      value={result.subtitle || ""}
                      onChange={(e) =>
                        updateResult(result.id, "subtitle", e.target.value)
                      }
                      className="w-full pl-9 pr-4 py-3 rounded-[var(--radius-s)] border border-white-neutral-light-300 bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)] text-white-neutral-light-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white-neutral-light-700 mb-1.5">
                    Investimento
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-neutral-light-600 text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      name={`investment-${result.id}`}
                      id={`investment-${result.id}`}
                      placeholder="0,00"
                      value={result.investment || ""}
                      onChange={(e) =>
                        handleCurrencyChange(
                          result.id,
                          "investment",
                          e.target.value
                        )
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-s)] border border-white-neutral-light-300 bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)] text-white-neutral-light-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white-neutral-light-700 mb-1.5">
                    ROI
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-neutral-light-600 text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      name={`roi-${result.id}`}
                      id={`roi-${result.id}`}
                      placeholder="0,00"
                      value={result.roi || ""}
                      onChange={(e) =>
                        handleCurrencyChange(result.id, "roi", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-s)] border border-white-neutral-light-300 bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)] text-white-neutral-light-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addResult}
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
      >
        <Plus size={16} />
        Adicionar Resultado
      </button>
    </div>
  );
}
