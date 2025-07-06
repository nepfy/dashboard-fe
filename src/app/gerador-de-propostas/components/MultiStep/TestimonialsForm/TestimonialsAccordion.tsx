import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";
import { useImageUpload } from "#/hooks/useImageUpload";

import { Testimonial } from "#/types/project";

interface TestimonialsAccordionProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
  disabled?: boolean;
}

export default function TestimonialsAccordion({
  testimonials,
  onChange,
  disabled = false,
}: TestimonialsAccordionProps) {
  const [openTestimonial, setOpenTestimonial] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [testimonialToRemove, setTestimonialToRemove] = useState<string | null>(
    null
  );
  const [uploadingTestimonials, setUploadingTestimonials] = useState<
    Set<string>
  >(new Set());

  // Photo visibility states for each testimonial
  const [photoVisibility, setPhotoVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  // Upload errors for each testimonial
  const [uploadErrors, setUploadErrors] = useState<{
    [key: string]: string;
  }>({});

  const { uploadImage, clearError } = useImageUpload();

  const addTestimonial = () => {
    if (disabled) return;

    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      testimonial: "",
      name: "",
      role: "",
      hidePhoto: false, // Initialize hidePhoto as false
      sortOrder: testimonials.length,
    };

    const updatedTestimonials = [...testimonials, newTestimonial];
    onChange(updatedTestimonials);
    setOpenTestimonial(newTestimonial.id);

    // Initialize photo visibility for new testimonial item
    setPhotoVisibility((prev) => ({
      ...prev,
      [newTestimonial.id]: true,
    }));
  };

  const removeTestimonial = (testimonialId: string) => {
    if (disabled) return;

    const updatedTestimonials = testimonials.filter(
      (testimonial) => testimonial.id !== testimonialId
    );
    // Update sort orders after removal
    const reorderedTestimonials = updatedTestimonials.map(
      (testimonial, index) => ({
        ...testimonial,
        sortOrder: index,
      })
    );
    onChange(reorderedTestimonials);

    if (openTestimonial === testimonialId) {
      setOpenTestimonial(null);
    }

    // Remove photo visibility for deleted item
    setPhotoVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[testimonialId];
      return newVisibility;
    });

    // Remove upload error for deleted item
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[testimonialId];
      return newErrors;
    });
  };

  const handleRemoveClick = (testimonialId: string) => {
    if (disabled) return;
    setTestimonialToRemove(testimonialId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (testimonialToRemove) {
      removeTestimonial(testimonialToRemove);
    }
    setShowRemoveModal(false);
    setTestimonialToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setTestimonialToRemove(null);
  };

  const updateTestimonial = (
    testimonialId: string,
    field: keyof Testimonial,
    value: string | boolean
  ) => {
    if (disabled) return;

    const updatedTestimonials = testimonials.map((testimonial) =>
      testimonial.id === testimonialId
        ? { ...testimonial, [field]: value }
        : testimonial
    );
    onChange(updatedTestimonials);
  };

  const toggleTestimonial = (testimonialId: string) => {
    if (disabled) return;
    setOpenTestimonial(
      openTestimonial === testimonialId ? null : testimonialId
    );
  };

  const togglePhotoVisibility = (testimonialId: string) => {
    if (disabled) return;

    const newVisibility = !(photoVisibility[testimonialId] ?? true);

    setPhotoVisibility((prev) => ({
      ...prev,
      [testimonialId]: newVisibility,
    }));

    updateTestimonial(testimonialId, "hidePhoto", !newVisibility);
  };

  const getPhotoVisibility = (testimonialId: string) => {
    return photoVisibility[testimonialId] ?? true;
  };

  const handleFileChange = async (testimonialId: string, file: File | null) => {
    if (!file || disabled) return;

    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[testimonialId];
      return newErrors;
    });

    try {
      clearError();

      setUploadingTestimonials((prev) => new Set(prev).add(testimonialId));

      const result = await uploadImage(file);

      if (result.success && result.data) {
        updateTestimonial(testimonialId, "photo", result.data.url);
      } else {
        console.error("Upload failed:", result.error);
        setUploadErrors((prev) => ({
          ...prev,
          [testimonialId]: result.error || "Erro ao fazer upload da imagem",
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadErrors((prev) => ({
        ...prev,
        [testimonialId]: "Erro ao fazer upload da imagem",
      }));
    } finally {
      setUploadingTestimonials((prev) => {
        const newSet = new Set(prev);
        newSet.delete(testimonialId);
        return newSet;
      });
    }
  };

  const isUploadingForTestimonial = (testimonialId: string) => {
    return uploadingTestimonials.has(testimonialId);
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

    const reorderedTestimonials = [...testimonials];
    const draggedTestimonial = reorderedTestimonials[draggedIndex];

    reorderedTestimonials.splice(draggedIndex, 1);
    reorderedTestimonials.splice(dropIndex, 0, draggedTestimonial);

    const updatedTestimonials = reorderedTestimonials.map(
      (testimonial, index) => ({
        ...testimonial,
        sortOrder: index,
      })
    );

    onChange(updatedTestimonials);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {testimonials.map((testimonial, index) => {
        const photoVisible = getPhotoVisibility(testimonial.id);

        return (
          <div
            key={testimonial.id}
            className={`transition-all duration-200 ${
              draggedIndex === index ? "opacity-50 scale-95" : ""
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? "border-2 border-primary-light-400 border-dashed"
                : ""
            } ${disabled ? "opacity-60" : ""}`}
          >
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
                    : "hover:bg-white-neutral-light-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled && draggedIndex === null) {
                    toggleTestimonial(testimonial.id);
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
                      {testimonial.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      openTestimonial === testimonial.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick(testimonial.id);
                }}
                disabled={disabled}
                className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-red-50"
                }`}
                title={disabled ? "Desabilitado" : "Remover depoimento"}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {openTestimonial === testimonial.id && (
              <div className="pb-4 space-y-4">
                {/* Testimonial Text */}
                <div>
                  <p
                    className="text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Depoimento
                  </p>
                  <TextAreaField
                    id={`testimonial-${testimonial.id}`}
                    textareaName={`testimonial-${testimonial.id}`}
                    placeholder="Digite o depoimento completo"
                    value={testimonial.testimonial}
                    onChange={(e) =>
                      updateTestimonial(
                        testimonial.id,
                        "testimonial",
                        e.target.value
                      )
                    }
                    rows={3}
                    showCharCount
                    maxLength={200}
                    disabled={disabled}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
                      Nome
                    </p>
                    <TextField
                      inputName={`name-${testimonial.id}`}
                      id={`name-${testimonial.id}`}
                      type="text"
                      placeholder="Nome da pessoa"
                      value={testimonial.name}
                      onChange={(e) =>
                        updateTestimonial(
                          testimonial.id,
                          "name",
                          e.target.value
                        )
                      }
                      disabled={disabled}
                    />
                  </div>

                  <div>
                    <p
                      className="text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center"
                      style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                    >
                      Cargo/Função
                    </p>
                    <TextField
                      inputName={`role-${testimonial.id}`}
                      id={`role-${testimonial.id}`}
                      type="text"
                      placeholder="Cargo ou função da pessoa"
                      value={testimonial.role || ""}
                      onChange={(e) =>
                        updateTestimonial(
                          testimonial.id,
                          "role",
                          e.target.value
                        )
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-2"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Foto
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePhotoVisibility(testimonial.id);
                      }}
                      className={`cursor-pointer ${
                        disabled ? "cursor-not-allowed opacity-60" : ""
                      }`}
                      disabled={disabled}
                    >
                      {photoVisible ? <EyeOpened /> : <EyeClosed />}
                    </button>
                  </label>
                  {!testimonial.hidePhoto && (
                    <div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-[160px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                testimonial.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                            id={`photo-${testimonial.id}`}
                            disabled={
                              isUploadingForTestimonial(testimonial.id) ||
                              disabled
                            }
                          />
                          <label
                            htmlFor={`photo-${testimonial.id}`}
                            className={`w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white-neutral-light-300 rounded-2xs transition-colors button-inner ${
                              isUploadingForTestimonial(testimonial.id) ||
                              disabled
                                ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                                : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                            }`}
                          >
                            {isUploadingForTestimonial(testimonial.id) ? (
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
                          {testimonial?.photo
                            ? "Imagem carregada"
                            : "Nenhuma foto selecionada"}
                        </div>
                      </div>
                      <div className="text-xs text-white-neutral-light-400 mt-3">
                        Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo:
                        5MB
                      </div>

                      {/* Show upload error if exists for this specific testimonial */}
                      {uploadErrors[testimonial.id] && (
                        <div className="text-xs text-red-500 mt-2 font-medium">
                          {uploadErrors[testimonial.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addTestimonial}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Depoimento
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
