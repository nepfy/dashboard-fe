"use client";

import { useState, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import ModalHeader from "../ItemEditorModal/ModalHeader";
import TabNavigation from "./TabNavigation";
import ImageTab from "./ImageTab";
import OrganizeTab from "./OrganizeTab";
import SaveButton from "../ItemEditorModal/SaveButton";
import type { Client } from "#/types/template-data";

interface ClientEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Client[];
  currentItemId: string | null;
  onReorderItems: (items: Client[]) => void;
}

type TabType = "imagem" | "organizar";

export default function ClientEditorModal({
  isOpen,
  onClose,
  items,
  currentItemId,
  onReorderItems,
}: ClientEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("imagem");
  const [showConfirmExclusion, setShowConfirmExclusion] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    currentItemId
  );
  const [pendingChanges, setPendingChanges] = useState<{
    itemUpdates: Record<string, Partial<Client>>;
    reorderedItems?: Client[];
    deletedItems: string[];
    newItems: Client[];
  }>({
    itemUpdates: {},
    reorderedItems: undefined,
    deletedItems: [],
    newItems: [],
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    setSelectedItemId(currentItemId);
    setPendingChanges({
      itemUpdates: {},
      reorderedItems: undefined,
      deletedItems: [],
      newItems: [],
    });
  }, [currentItemId]);

  const currentItem =
    items.find((item) => item.id === selectedItemId) ||
    pendingChanges.newItems.find((item) => item.id === selectedItemId) ||
    null;

  const getCurrentItemWithChanges = () => {
    if (!currentItem) return null;
    const pendingUpdates = pendingChanges.itemUpdates[currentItem.id!] || {};
    return { ...currentItem, ...pendingUpdates };
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    const totalItems = items.length + pendingChanges.newItems.length;
    const maxItems = 12;

    if (totalItems < maxItems) {
      const newItem: Client = {
        id: `temp-${Date.now()}`,
        name: "",
        logo: "",
        sortOrder: totalItems,
      };

      setPendingChanges((prev) => ({
        ...prev,
        newItems: [...prev.newItems, newItem],
      }));
      setSelectedItemId(newItem.id!);
    }
  };

  const handleUpdate = (data: Partial<Client>) => {
    if (!currentItem?.id) return;

    setPendingChanges((prev) => ({
      ...prev,
      itemUpdates: {
        ...prev.itemUpdates,
        [currentItem.id!]: {
          ...prev.itemUpdates[currentItem.id!],
          ...data,
        },
      },
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setShowConfirmExclusion(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    const isNewItem = pendingChanges.newItems.some(
      (item) => item.id === itemToDelete
    );

    if (isNewItem) {
      setPendingChanges((prev) => ({
        ...prev,
        newItems: prev.newItems.filter((item) => item.id !== itemToDelete),
      }));
    } else {
      setPendingChanges((prev) => ({
        ...prev,
        deletedItems: [...prev.deletedItems, itemToDelete],
      }));
    }

    // If deleted item was selected, select first available item
    if (selectedItemId === itemToDelete) {
      const remainingItems = [
        ...items.filter((item) => item.id !== itemToDelete),
        ...pendingChanges.newItems.filter((item) => item.id !== itemToDelete),
      ];
      setSelectedItemId(remainingItems[0]?.id || null);
    }

    setShowConfirmExclusion(false);
    setItemToDelete(null);
  };

  const handleSave = () => {
    // Apply all pending changes to existing items (excluding deleted ones)
    const itemsWithUpdates = items
      .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
      .map((item) => {
        const updates = pendingChanges.itemUpdates[item.id!];
        return updates ? { ...item, ...updates } : item;
      });

    // Add new items with their updates applied
    const newItemsWithUpdates = pendingChanges.newItems.map((newItem) => {
      const updates = pendingChanges.itemUpdates[newItem.id!];
      return updates ? { ...newItem, ...updates } : newItem;
    });

    // Combine all items
    const allItems = [...itemsWithUpdates, ...newItemsWithUpdates];

    // Apply reordering if any, otherwise use current order
    const finalItems = pendingChanges.reorderedItems || allItems;

    // Update sortOrder based on final order
    const sortedItems = finalItems.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));

    // Save all changes at once by calling onReorderItems with the final sorted array
    // This will update the entire clients array with all changes applied
    onReorderItems(sortedItems);

    // Reset pending changes
    setPendingChanges({
      itemUpdates: {},
      reorderedItems: undefined,
      deletedItems: [],
      newItems: [],
    });

    // Close the modal after saving
    onClose();
  };

  const hasPendingChanges = () => {
    return (
      Object.keys(pendingChanges.itemUpdates).length > 0 ||
      pendingChanges.deletedItems.length > 0 ||
      pendingChanges.newItems.length > 0 ||
      pendingChanges.reorderedItems !== undefined
    );
  };

  const sortedItems = [
    ...items.filter((item) => !pendingChanges.deletedItems.includes(item.id!)),
    ...pendingChanges.newItems,
  ].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (!isOpen) return null;

  const modalContent = (
    <div className="bg-white-neutral-light-100 relative z-11 flex h-full w-full flex-col overflow-hidden rounded-lg">
      <div className="flex flex-shrink-0 flex-col">
        {!showConfirmExclusion && (
          <>
            <ModalHeader title="Imagem" onClose={onClose} />
            <ItemSelector
              items={sortedItems}
              selectedItemId={selectedItemId}
              onItemSelect={handleItemSelect}
              onAddItem={handleAddItem}
            />
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
      </div>

      {!showConfirmExclusion && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === "imagem" && (
            <ImageTab
              currentItem={getCurrentItemWithChanges()}
              onUpdate={handleUpdate}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {activeTab === "organizar" && (
            <OrganizeTab
              items={sortedItems}
              onUpdate={(data) => {
                setPendingChanges((prev) => ({
                  ...prev,
                  reorderedItems: data.reorderedItems,
                }));
              }}
              onDeleteItem={handleDeleteItem}
            />
          )}
        </div>
      )}

      <div className="flex flex-shrink-0 flex-col">
        {showConfirmExclusion ? (
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <h3 className="text-lg font-medium text-[#2A2A2A]">
                Confirmar exclusão
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[#161616]">
                Tem certeza de que deseja excluir este item de forma permanente?
              </p>
              <p className="text-sm font-normal text-[#161616]">
                Essa ação não poderá ser desfeita.
              </p>
            </div>
            <div className="mt-62 flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#D00003] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#B00003]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Excluir
              </button>
              <button
                onClick={() => {
                  setShowConfirmExclusion(false);
                  setItemToDelete(null);
                }}
                className="flex w-full cursor-pointer items-center justify-center rounded-[12px] border border-[#DBDDDF] bg-white px-6 py-3.5 text-sm font-medium text-[#161616] transition-all duration-200 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <SaveButton onSave={handleSave} hasChanges={hasPendingChanges()} />
        )}
      </div>
    </div>
  );

  return (
    <EditableModal
      isOpen={isOpen}
      className="!max-w-[600px]"
      preferredPlacement="right"
    >
      {modalContent}
    </EditableModal>
  );
}

// ItemSelector component for clients
function ItemSelector({
  items,
  selectedItemId,
  onItemSelect,
  onAddItem,
}: {
  items: Client[];
  selectedItemId: string | null;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
}) {
  const sortedItems = [...items].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );
  const maxItems = 12;

  return (
    <div className="mb-6 flex flex-shrink-0 flex-wrap gap-2">
      {sortedItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemSelect(item.id!)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors ${
            selectedItemId === item.id
              ? "border-primary-light-400 bg-primary-light-10 text-primary-light-400"
              : "border-white-neutral-light-300 text-white-neutral-light-500 bg-white-neutral-light-200 hover:border-text-white-neutral-light-400"
          }`}
        >
          {index + 1}
        </button>
      ))}
      {items.length < maxItems && (
        <button
          onClick={onAddItem}
          className="border-white-neutral-light-300 text-white-neutral-light-700 hover:border-white-neutral-light-400 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-dashed text-[24px] font-light transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
}
