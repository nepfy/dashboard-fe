import { useState } from "react";
import { ChevronDown, Plus, Trash2, Star } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { Plan, PlanDetail } from "#/types/project";

interface PlansAccordionProps {
  plansList: Plan[];
  onFormChange: (plans: Plan[]) => void;
}

export default function PlansAccordion({
  plansList,
  onFormChange,
}: PlansAccordionProps) {
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null
  );
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
  const [planToRemove, setPlanToRemove] = useState<string | null>(null);
  const [itemToRemove, setItemToRemove] = useState<{
    planId: string;
    itemId: string;
  } | null>(null);

  const addPlan = () => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      title: "",
      description: "",
      isBestOffer: false,
      price: 0,
      pricePeriod: "one-time",
      ctaButtonTitle: "",
      planDetails: [],
      sortOrder: plansList.length,
    };

    const updatedPlans = [...plansList, newPlan];
    onFormChange(updatedPlans);
    setOpenPlan(newPlan.id!);
  };

  const removePlan = (planId: string) => {
    const updatedPlans = plansList.filter((plan) => plan.id !== planId);
    // Update sort orders after removal
    const reorderedPlans = updatedPlans.map((plan, index) => ({
      ...plan,
      sortOrder: index,
    }));
    onFormChange(reorderedPlans);

    if (openPlan === planId) {
      setOpenPlan(null);
    }
  };

  const handleRemoveClick = (planId: string) => {
    setPlanToRemove(planId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (planToRemove) {
      removePlan(planToRemove);
    }
    setShowRemoveModal(false);
    setPlanToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setPlanToRemove(null);
  };

  // Item management functions
  const addItem = (planId: string) => {
    const newItem: PlanDetail = {
      id: `item-${Date.now()}`,
      description: "",
      sortOrder: 0,
    };

    const updatedPlans = plansList.map((plan) => {
      if (plan.id === planId) {
        const currentItems = plan.planDetails || [];
        const newItems = [
          ...currentItems,
          { ...newItem, sortOrder: currentItems.length },
        ];
        return { ...plan, planDetails: newItems };
      }
      return plan;
    });

    onFormChange(updatedPlans);
    setOpenItem(newItem.id!);
  };

  const removeItem = (planId: string, itemId: string) => {
    const updatedPlans = plansList.map((plan) => {
      if (plan.id === planId) {
        const filteredItems = (plan.planDetails || []).filter(
          (item) => item.id !== itemId
        );
        const reorderedItems = filteredItems.map((item, index) => ({
          ...item,
          sortOrder: index,
        }));
        return { ...plan, planDetails: reorderedItems };
      }
      return plan;
    });

    onFormChange(updatedPlans);

    if (openItem === itemId) {
      setOpenItem(null);
    }
  };

  const handleRemoveItemClick = (planId: string, itemId: string) => {
    setItemToRemove({ planId, itemId });
    setShowRemoveItemModal(true);
  };

  const handleConfirmItemRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.planId, itemToRemove.itemId);
    }
    setShowRemoveItemModal(false);
    setItemToRemove(null);
  };

  const handleCancelItemRemove = () => {
    setShowRemoveItemModal(false);
    setItemToRemove(null);
  };

  const updatePlan = (
    planId: string,
    field: keyof Plan,
    value: string | number | boolean | PlanDetail[]
  ) => {
    const updatedPlans = plansList.map((plan) =>
      plan.id === planId ? { ...plan, [field]: value } : plan
    );
    onFormChange(updatedPlans);
  };

  const updateItem = (
    planId: string,
    itemId: string,
    field: keyof PlanDetail,
    value: string | number
  ) => {
    const updatedPlans = plansList.map((plan) => {
      if (plan.id === planId) {
        const updatedItems = (plan.planDetails || []).map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        );
        return { ...plan, planDetails: updatedItems };
      }
      return plan;
    });
    onFormChange(updatedPlans);
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

  const handleCurrencyChange = (planId: string, value: string) => {
    const formattedValue = formatCurrency(value);
    updatePlan(planId, "price", formattedValue);
  };

  const togglePlan = (planId: string) => {
    setOpenPlan(openPlan === planId ? null : planId);
  };

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  // Drag and Drop handlers for Plans
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

    const reorderedPlans = [...plansList];
    const draggedItem = reorderedPlans[draggedIndex];

    // Remove the dragged item
    reorderedPlans.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedPlans.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedPlans = reorderedPlans.map((plan, index) => ({
      ...plan,
      sortOrder: index,
    }));

    onFormChange(updatedPlans);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Drag and Drop handlers for Items
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
    e.stopPropagation();
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverItemIndex(index);
  };

  const handleItemDragLeave = () => {
    setDragOverItemIndex(null);
  };

  const handleItemDrop = (
    e: React.DragEvent,
    planId: string,
    dropIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const plan = plansList.find((p) => p.id === planId);
    if (!plan || !plan.planDetails) return;

    const reorderedItems = [...plan.planDetails];
    const draggedItem = reorderedItems[draggedItemIndex];

    // Remove the dragged item
    reorderedItems.splice(draggedItemIndex, 1);
    // Insert it at the new position
    reorderedItems.splice(dropIndex, 0, draggedItem);

    // Update sort orders
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    updatePlan(planId, "planDetails", updatedItems);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleItemDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  return (
    <div className="space-y-2">
      {plansList.map((plan, index) => (
        <div
          key={plan.id}
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
                  togglePlan(plan.id!);
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
                    {plan.title || `Plano ${index + 1}`}
                  </span>
                  {plan.isBestOffer && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                      <Star size={12} />
                      <span>Melhor oferta</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    openPlan === plan.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveClick(plan.id!);
              }}
              className="text-white-neutral-light-900 w-11 h-11 hover:bg-red-50 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 cursor-pointer"
              title="Remover plano"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Accordion Content */}
          {openPlan === plan.id && (
            <div className="pb-4 space-y-4">
              <div>
                <TextField
                  label="Título do plano"
                  inputName={`title-${plan.id}`}
                  id={`title-${plan.id}`}
                  type="text"
                  placeholder="Nome do plano"
                  value={plan.title}
                  onChange={(e) =>
                    updatePlan(plan.id!, "title", e.target.value)
                  }
                />
              </div>

              <div>
                <TextAreaField
                  label="Descrição"
                  id={`description-${plan.id}`}
                  textareaName={`description-${plan.id}`}
                  placeholder="Descreva este plano"
                  value={plan.description || ""}
                  onChange={(e) =>
                    updatePlan(plan.id!, "description", e.target.value)
                  }
                  rows={3}
                  showCharCount
                  maxLength={130}
                  minLength={50}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white-neutral-light-800 text-sm">
                  <input
                    type="checkbox"
                    checked={plan.isBestOffer || false}
                    onChange={(e) =>
                      updatePlan(plan.id!, "isBestOffer", e.target.checked)
                    }
                    className="border border-white-neutral-light-300 checkbox-custom"
                  />
                  Marcar como melhor oferta
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white-neutral-light-700 mb-1.5">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-neutral-light-600 text-sm">
                    R$
                  </span>
                  <input
                    type="text"
                    name={`price-${plan.id}`}
                    id={`price-${plan.id}`}
                    placeholder="0,00"
                    value={plan.price?.toString() || ""}
                    onChange={(e) =>
                      handleCurrencyChange(plan.id!, e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-s)] border border-white-neutral-light-300 bg-white-neutral-light-100 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)] text-white-neutral-light-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-white-neutral-light-700 text-sm font-medium block mb-2">
                  Tipo de cobrança
                </label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-white-neutral-light-800 text-sm">
                    <input
                      type="radio"
                      name={`pricePeriod-${plan.id}`}
                      value="one-time"
                      checked={
                        plan.pricePeriod === "one-time" || !plan.pricePeriod
                      }
                      onChange={(e) =>
                        updatePlan(
                          plan.id!,
                          "pricePeriod",
                          e.target.value as "monthly" | "yearly" | "one-time"
                        )
                      }
                      className="border border-white-neutral-light-300"
                    />
                    Pagamento único
                  </label>
                  <label className="flex items-center gap-2 text-white-neutral-light-800 text-sm">
                    <input
                      type="radio"
                      name={`pricePeriod-${plan.id}`}
                      value="monthly"
                      checked={plan.pricePeriod === "monthly"}
                      onChange={(e) =>
                        updatePlan(
                          plan.id!,
                          "pricePeriod",
                          e.target.value as "monthly" | "yearly" | "one-time"
                        )
                      }
                      className="border border-white-neutral-light-300"
                    />
                    Mensal
                  </label>
                  <label className="flex items-center gap-2 text-white-neutral-light-800 text-sm">
                    <input
                      type="radio"
                      name={`pricePeriod-${plan.id}`}
                      value="yearly"
                      checked={plan.pricePeriod === "yearly"}
                      onChange={(e) =>
                        updatePlan(
                          plan.id!,
                          "pricePeriod",
                          e.target.value as "monthly" | "yearly" | "one-time"
                        )
                      }
                      className="border border-white-neutral-light-300"
                    />
                    Anual
                  </label>
                </div>
              </div>

              {/* Items Accordion */}
              <div className="space-y-2">
                {(plan.planDetails || []).map((item, itemIndex) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleItemDragStart(e, itemIndex)}
                    onDragOver={(e) => handleItemDragOver(e, itemIndex)}
                    onDragLeave={handleItemDragLeave}
                    onDrop={(e) => handleItemDrop(e, plan.id!, itemIndex)}
                    onDragEnd={handleItemDragEnd}
                    className={`transition-all duration-200 ${
                      draggedItemIndex === itemIndex
                        ? "opacity-50 scale-95"
                        : ""
                    } ${
                      dragOverItemIndex === itemIndex &&
                      draggedItemIndex !== itemIndex
                        ? "border-2 border-primary-light-400 border-dashed"
                        : ""
                    }`}
                  >
                    {/* Item Header */}
                    <div className="flex justify-center gap-4 w-full">
                      <div
                        className={`flex flex-1 items-center justify-between py-2 px-4 cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                          draggedItemIndex === itemIndex
                            ? "cursor-grabbing"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (draggedItemIndex === null) {
                            toggleItem(item.id!);
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
                              {item.description || `Item ${itemIndex + 1}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${
                              openItem === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItemClick(plan.id!, item.id!);
                        }}
                        className="text-white-neutral-light-900 w-11 h-11 hover:bg-red-50 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Item Content */}
                    {openItem === item.id && (
                      <div className="pb-4 space-y-4">
                        <div>
                          <TextField
                            label="Título"
                            inputName={`item-title-${item.id}`}
                            id={`item-title-${item.id}`}
                            type="text"
                            placeholder="Nome do item"
                            value={item.description || ""}
                            onChange={(e) =>
                              updateItem(
                                plan.id!,
                                item.id!,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(plan.id!)}
                  className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
                >
                  <Plus size={16} />
                  Adicionar item no pacote
                </button>
              </div>

              <div>
                <TextField
                  label="Texto do botão CTA"
                  inputName={`ctaButtonTitle-${plan.id}`}
                  id={`ctaButtonTitle-${plan.id}`}
                  type="text"
                  placeholder="Escolher este plano"
                  value={plan.ctaButtonTitle || ""}
                  onChange={(e) =>
                    updatePlan(plan.id!, "ctaButtonTitle", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addPlan}
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
      >
        <Plus size={16} />
        Adicionar Plano
      </button>

      {/* Remove Plan Modal */}
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

      {/* Remove Item Modal */}
      <Modal
        isOpen={showRemoveItemModal}
        onClose={handleCancelItemRemove}
        title="Tem certeza de que deseja excluir este item?"
        footer={false}
      >
        <p className="text-white-neutral-light-500 text-sm mb-6 p-6">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex items-center gap-3 border-t border-white-neutral-light-300 p-6">
          <button
            type="button"
            onClick={handleConfirmItemRemove}
            className="px-4 py-2 text-sm font-medium bg-primary-light-500 button-inner-inverse border rounded-[12px] text-white-neutral-light-100 border-white-neutral-light-300 hover:bg-primary-light-600 cursor-pointer"
          >
            Remover
          </button>
          <button
            type="button"
            onClick={handleCancelItemRemove}
            className="px-4 py-2 text-sm font-medium border rounded-[12px] text-gray-700 border-white-neutral-light-300 hover:bg-gray-50 cursor-pointer button-inner"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
