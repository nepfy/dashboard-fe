import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import { TextField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { useImageUpload } from "#/hooks/useImageUpload";
import { Result } from "#/types/project";

interface ResultsAccordionProps {
  results: Result[];
  onResultsChange: (results: Result[]) => void;
  disabled?: boolean;
  errors?: { [key: string]: string };
}

export default function ResultsAccordion({
  results,
  onResultsChange,
  disabled = false,
  errors = {},
}: ResultsAccordionProps) {
  const [openResult, setOpenResult] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [resultToRemove, setResultToRemove] = useState<string | null>(null);
  const [uploadingResults, setUploadingResults] = useState<Set<string>>(
    new Set()
  );

  const [uploadErrors, setUploadErrors] = useState<{
    [key: string]: string;
  }>({});

  const { uploadImage, clearError } = useImageUpload();

  const addResult = () => {
    if (disabled) return;

    const newResult: Result = {
      id: `result-${Date.now()}`,
      client: "",
      subtitle: "",
      investment: "",
      roi: "",
      sortOrder: results.length,
      hidePhoto: false,
      photo: "",
    };

    const updatedResults = [...results, newResult];
    onResultsChange(updatedResults);
    setOpenResult(newResult.id);
  };

  const removeResult = (resultId: string) => {
    if (disabled) return;

    const updatedResults = results.filter((result) => result.id !== resultId);
    const reorderedResults = updatedResults.map((result, index) => ({
      ...result,
      sortOrder: index,
    }));
    onResultsChange(reorderedResults);

    if (openResult === resultId) {
      setOpenResult(null);
    }

    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[resultId];
      return newErrors;
    });
  };

  const handleRemoveClick = (resultId: string) => {
    if (disabled) return;
    setResultToRemove(resultId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (resultToRemove) {
      removeResult(resultToRemove);
    }
    setShowRemoveModal(false);
    setResultToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setResultToRemove(null);
  };

  const updateResult = (
    resultId: string,
    field: keyof Result,
    value: string | number | boolean
  ) => {
    if (disabled) {
      return;
    }

    const updatedResults = results.map((result) =>
      result.id === resultId ? { ...result, [field]: value } : result
    );

    onResultsChange(updatedResults);
  };

  const toggleResult = (resultId: string) => {
    if (disabled) return;
    setOpenResult(openResult === resultId ? null : resultId);
  };

  const handleHidePhotoToggle = (resultId: string) => {
    if (disabled) return;

    const result = results.find((r) => r.id === resultId);
    if (result) {
      const newHidePhotoValue = !result.hidePhoto;

      // Apenas atualizar o campo hidePhoto, SEM apagar a foto
      const updates: Partial<Result> = {
        hidePhoto: newHidePhotoValue,
      };

      // NÃO apagar a foto quando ocultar
      // A foto permanece salva no campo 'photo', apenas fica oculta

      const updatedResults = results.map((result) =>
        result.id === resultId ? { ...result, ...updates } : result
      );

      onResultsChange(updatedResults);
    }
  };

  const handleFileChange = async (resultId: string, file: File | null) => {
    if (!file || disabled) return;

    // Clear any existing upload errors for this result
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[resultId];
      return newErrors;
    });

    // Check file size (1MB max)
    const maxSize = 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      setUploadErrors((prev) => ({
        ...prev,
        [resultId]: "Arquivo muito grande. Tamanho máximo: 1MB.",
      }));
      return;
    }

    try {
      clearError();

      setUploadingResults((prev) => new Set(prev).add(resultId));

      const result = await uploadImage(file);

      if (result.success && result.data) {
        updateResult(resultId, "photo", result.data.url);
      } else {
        console.error("Upload failed:", result.error);
        setUploadErrors((prev) => ({
          ...prev,
          [resultId]: result.error || "Erro ao fazer upload da imagem",
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadErrors((prev) => ({
        ...prev,
        [resultId]: "Erro ao fazer upload da imagem",
      }));
    } finally {
      setUploadingResults((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resultId);
        return newSet;
      });
    }
  };

  const isUploadingForResult = (resultId: string) => {
    return uploadingResults.has(resultId);
  };

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    const number = parseInt(numericValue) / 100;

    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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

    const reorderedResults = [...results];
    const draggedResult = reorderedResults[draggedIndex];

    reorderedResults.splice(draggedIndex, 1);
    reorderedResults.splice(dropIndex, 0, draggedResult);

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
    if (disabled) return;
    const formattedValue = formatCurrency(value);
    updateResult(resultId, field, formattedValue);
  };

  const formatInstagramUsername = (value: string): string => {
    return value.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
  };

  const handleInstagramChange = (resultId: string, value: string) => {
    if (disabled) return;
    const formattedValue = formatInstagramUsername(value);
    updateResult(resultId, "subtitle", formattedValue);
  };

  return (
    <div className="space-y-2">
      {results.map((result, index) => {
        return (
          <div
            key={result.id}
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
                className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                  disabled
                    ? "cursor-not-allowed"
                    : "hover:bg-white-neutral-light-400 cursor-pointer"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled && draggedIndex === null) {
                    toggleResult(result.id);
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
                      title={
                        disabled ? "Desabilitado" : "Arraste para reordenar"
                      }
                    >
                      ⋮⋮
                    </div>
                    <span className="text-sm font-medium text-white-neutral-light-900">
                      Resultado {index + 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      openResult === result.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick(result.id);
                }}
                disabled={disabled}
                className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-red-50"
                }`}
                title={disabled ? "Desabilitado" : "Remover resultado"}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {openResult === result.id && (
              <div className="pb-4 space-y-4">
                {/* Photo Section */}
                <div>
                  <div
                    className={`text-white-neutral-light-800 text-sm px-3 py-0 rounded-3xs font-medium flex justify-between items-center ${
                      result.hidePhoto ? "bg-white-neutral-light-300" : ""
                    }`}
                    style={{
                      backgroundColor: result.hidePhoto
                        ? undefined
                        : "rgba(107, 70, 245, 0.05)",
                    }}
                  >
                    Foto
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleHidePhotoToggle(result.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        disabled
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-white-neutral-light-300"
                      }`}
                      disabled={disabled}
                      title={result.hidePhoto ? "Mostrar foto" : "Ocultar foto"}
                    >
                      {result.hidePhoto ? <EyeClosed /> : <EyeOpened />}
                    </button>
                  </div>

                  {/* Photo Upload Section - Only show if hidePhoto is false */}
                  {!result.hidePhoto && (
                    <div>
                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-3">
                        <div className="w-full sm:w-[170px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                result.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                            id={`photo-${result.id}`}
                            disabled={
                              isUploadingForResult(result.id) || disabled
                            }
                          />
                          <label
                            htmlFor={`photo-${result.id}`}
                            className={`w-full sm:w-[170px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-2xs transition-colors button-inner ${
                              errors[`result_${index}_photo`]
                                ? "border-red-500"
                                : "border-white-neutral-light-300"
                            } ${
                              isUploadingForResult(result.id)
                                ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                                : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                            }`}
                          >
                            {isUploadingForResult(result.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <PictureIcon width="16" height="16" />
                                {result.photo
                                  ? "Alterar imagem"
                                  : "Adicionar imagem"}
                              </>
                            )}
                          </label>
                        </div>
                        <div className="text-xs text-white-neutral-light-500">
                          {result.photo
                            ? "Imagem carregada"
                            : "Nenhuma imagem selecionada"}
                        </div>
                      </div>

                      <div className="text-xs text-white-neutral-light-400 mt-3">
                        Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo:
                        1MB
                      </div>

                      {/* Show upload error */}
                      {uploadErrors[result.id] && (
                        <p className="text-red-700 text-sm font-medium mt-2">
                          {uploadErrors[result.id]}
                        </p>
                      )}

                      {/* Show validation error from form */}
                      {errors[`result_${index}_photo`] && (
                        <p className="text-red-700 text-sm font-medium mt-2">
                          {errors[`result_${index}_photo`]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
                      Cliente
                    </label>
                    <TextField
                      inputName={`client-${result.id}`}
                      id={`client-${result.id}`}
                      type="text"
                      placeholder="Nome do cliente"
                      value={result.client || ""}
                      onChange={(e) =>
                        updateResult(result.id, "client", e.target.value)
                      }
                      disabled={disabled}
                      error={errors[`result_${index}_client`]}
                    />
                  </div>

                  <div>
                    <label
                      className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-3"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
                      Instagram
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-neutral-light-600 text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        name={`instagram-username-${result.id}`}
                        id={`instagram-username-${result.id}`}
                        placeholder="username"
                        value={result.subtitle || ""}
                        onChange={(e) =>
                          handleInstagramChange(result.id, e.target.value)
                        }
                        disabled={disabled}
                        maxLength={30}
                        className={`w-full pl-9 pr-4 py-3 rounded-[var(--radius-s)] border bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none text-white-neutral-light-800 ${
                          errors[`result_${index}_subtitle`]
                            ? "border-red-500 focus:border-red-500"
                            : "border-white-neutral-light-300 focus:border-[var(--color-primary-light-400)]"
                        }`}
                      />
                    </div>
                    {errors[`result_${index}_subtitle`] && (
                      <p className="text-red-700 text-sm font-medium mt-1">
                        {errors[`result_${index}_subtitle`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
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
                        disabled={disabled}
                        className={`w-full pl-10 pr-4 py-3 rounded-[var(--radius-s)] border bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none text-white-neutral-light-800 ${
                          errors[`result_${index}_investment`]
                            ? "border-red-500 focus:border-red-500"
                            : "border-white-neutral-light-300 focus:border-[var(--color-primary-light-400)]"
                        }`}
                      />
                    </div>

                    {errors[`result_${index}_investment`] && (
                      <p className="text-red-700 text-sm font-medium mt-1">
                        {errors[`result_${index}_investment`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
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
                        disabled={disabled}
                        className={`w-full pl-10 pr-4 py-3 rounded-[var(--radius-s)] border bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none text-white-neutral-light-800 ${
                          errors[`result_${index}_roi`]
                            ? "border-red-500 focus:border-red-500"
                            : "border-white-neutral-light-300 focus:border-[var(--color-primary-light-400)]"
                        }`}
                      />
                    </div>

                    {errors[`result_${index}_roi`] && (
                      <p className="text-red-700 text-sm font-medium mt-1">
                        {errors[`result_${index}_roi`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addResult}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Resultado
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
