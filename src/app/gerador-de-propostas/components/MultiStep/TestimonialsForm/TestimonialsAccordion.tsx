import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";
import { useImageUpload } from "#/hooks/useImageUpload";

import { Testimonial } from "#/types/project";

interface TestimonialsAccordionProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}

export default function TestimonialsAccordion({
  testimonials,
  onChange,
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

  const { uploadImage, uploadError, clearError } = useImageUpload();

  const addTestimonial = () => {
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
  };

  const removeTestimonial = (testimonialId: string) => {
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
  };

  const handleRemoveClick = (testimonialId: string) => {
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
    const updatedTestimonials = testimonials.map((testimonial) =>
      testimonial.id === testimonialId
        ? { ...testimonial, [field]: value }
        : testimonial
    );
    onChange(updatedTestimonials);
  };

  const toggleTestimonial = (testimonialId: string) => {
    setOpenTestimonial(
      openTestimonial === testimonialId ? null : testimonialId
    );
  };

  const handleFileChange = async (testimonialId: string, file: File | null) => {
    if (!file) return;

    try {
      // Clear any previous errors
      clearError();

      // Add testimonial to uploading set
      setUploadingTestimonials((prev) => new Set(prev).add(testimonialId));

      // Upload the image
      const result = await uploadImage(file);

      if (result.success && result.data) {
        // Update the testimonial with the uploaded image URL
        updateTestimonial(testimonialId, "photo", result.data.url);
      } else {
        console.error("Upload failed:", result.error);
        // You might want to show a toast notification here
        alert(result.error || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      // Remove testimonial from uploading set
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

  const handleHidePhotoToggle = (testimonialId: string) => {
    const testimonial = testimonials.find((t) => t.id === testimonialId);
    if (testimonial) {
      updateTestimonial(testimonialId, "hidePhoto", !testimonial.hidePhoto);
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

    const reorderedTestimonials = [...testimonials];
    const draggedTestimonial = reorderedTestimonials[draggedIndex];

    // Remove the dragged item
    reorderedTestimonials.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedTestimonials.splice(dropIndex, 0, draggedTestimonial);

    // Update sort orders
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
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
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
          <div className="flex justify-center gap-4 w-full">
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                draggedIndex === index ? "cursor-grabbing" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (draggedIndex === null) {
                  toggleTestimonial(testimonial.id);
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
                    Depoimento {index + 1}
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
              className="text-white-neutral-light-900 w-11 h-11 hover:bg-red-50 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 cursor-pointer"
              title="Remover depoimento"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {openTestimonial === testimonial.id && (
            <div className="pb-4 space-y-4">
              {/* Testimonial Text */}
              <div>
                <TextAreaField
                  label="Depoimento"
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
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Nome"
                  inputName={`name-${testimonial.id}`}
                  id={`name-${testimonial.id}`}
                  type="text"
                  placeholder="Nome da pessoa"
                  value={testimonial.name}
                  onChange={(e) =>
                    updateTestimonial(testimonial.id, "name", e.target.value)
                  }
                />

                <TextField
                  label="Cargo/Função"
                  inputName={`role-${testimonial.id}`}
                  id={`role-${testimonial.id}`}
                  type="text"
                  placeholder="Cargo ou função da pessoa"
                  value={testimonial.role || ""}
                  onChange={(e) =>
                    updateTestimonial(testimonial.id, "role", e.target.value)
                  }
                />
              </div>

              {/* Hide Photo Checkbox */}
              <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
                <input
                  type="checkbox"
                  checked={testimonial?.hidePhoto || false}
                  onChange={() => handleHidePhotoToggle(testimonial.id)}
                  className="border border-white-neutral-light-300 checkbox-custom"
                />
                Ocultar foto do depoimento
              </label>

              {/* Photo Upload Section - Only show if hidePhoto is false */}
              {!testimonial.hidePhoto && (
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
                          handleFileChange(
                            testimonial.id,
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id={`photo-${testimonial.id}`}
                        disabled={isUploadingForTestimonial(testimonial.id)}
                      />
                      <label
                        htmlFor={`photo-${testimonial.id}`}
                        className={`w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white-neutral-light-300 rounded-2xs transition-colors button-inner ${
                          isUploadingForTestimonial(testimonial.id)
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
                    Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo: 5MB
                  </div>

                  {/* Show upload error if exists */}
                  {uploadError && isUploadingForTestimonial(testimonial.id) && (
                    <div className="text-xs text-red-500 mt-2">
                      {uploadError}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addTestimonial}
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
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
