import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { Service } from "#/types/project";

interface ProjectDeliveriesAccordionProps {
  servicesList: Service[];
  onFormChange: (services: Service[]) => void;
  disabled?: boolean;
}

export default function ProjectDeliveriesAccordion({
  servicesList,
  onFormChange,
  disabled = false,
}: ProjectDeliveriesAccordionProps) {
  const [openService, setOpenService] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState<string | null>(null);

  const addService = () => {
    if (disabled) return;

    const newService: Service = {
      id: `service-${Date.now()}`,
      title: "",
      description: "",
      sortOrder: servicesList.length,
    };

    const updatedServices = [...servicesList, newService];
    onFormChange(updatedServices);
    setOpenService(newService.id!);
  };

  const removeService = (serviceId: string) => {
    if (disabled) return;

    const updatedServices = servicesList.filter(
      (service) => service.id !== serviceId
    );
    // Update sort orders after removal
    const reorderedServices = updatedServices.map((service, index) => ({
      ...service,
      sortOrder: index,
    }));
    onFormChange(reorderedServices);

    if (openService === serviceId) {
      setOpenService(null);
    }
  };

  const handleRemoveClick = (serviceId: string) => {
    if (disabled) return;
    setServiceToRemove(serviceId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (serviceToRemove) {
      removeService(serviceToRemove);
    }
    setShowRemoveModal(false);
    setServiceToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setServiceToRemove(null);
  };

  const updateService = (
    serviceId: string,
    field: keyof Service,
    value: string | number
  ) => {
    if (disabled) return;

    const updatedServices = servicesList.map((service) =>
      service.id === serviceId ? { ...service, [field]: value } : service
    );
    onFormChange(updatedServices);
  };

  const toggleService = (serviceId: string) => {
    if (disabled) return;
    setOpenService(openService === serviceId ? null : serviceId);
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

    const reorderedServices = [...servicesList];
    const draggedItem = reorderedServices[draggedIndex];

    // Remove the dragged item
    reorderedServices.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedServices.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedServices = reorderedServices.map((service, index) => ({
      ...service,
      sortOrder: index,
    }));

    onFormChange(updatedServices);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {servicesList.map((service, index) => (
        <div
          key={service.id}
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
                  toggleService(service.id!);
                }
              }}
            >
              <div
                className="flex items-center gap-3"
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
              >
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
                    {`Entrega ${index + 1}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    openService === service.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(service.id!);
              }}
              disabled={disabled}
              className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-red-50"
              }`}
              title={disabled ? "Desabilitado" : "Remover entrega"}
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Accordion Content */}
          {openService === service.id && (
            <div className="pb-4 space-y-4">
              <div>
                <p
                  className="text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Título da entrega
                </p>
                <TextField
                  inputName={`title-${service.id}`}
                  id={`title-${service.id}`}
                  type="text"
                  placeholder="Nome da entrega"
                  value={service.title}
                  onChange={(e) =>
                    updateService(service.id!, "title", e.target.value)
                  }
                  maxLength={50}
                  showCharCount
                  disabled={disabled}
                />
              </div>

              <div>
                <p
                  className="text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center"
                  style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                >
                  Descrição
                </p>
                <TextAreaField
                  id={`description-${service.id}`}
                  textareaName={`description-${service.id}`}
                  placeholder="Descreva esta entrega"
                  value={service.description || ""}
                  onChange={(e) =>
                    updateService(service.id!, "description", e.target.value)
                  }
                  rows={3}
                  showCharCount
                  maxLength={340}
                  minLength={165}
                  disabled={disabled}
                  allowOverText
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addService}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Entrega
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
