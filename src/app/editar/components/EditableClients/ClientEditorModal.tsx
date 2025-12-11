"use client";

import { useState, useEffect, useRef } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import ModalHeader from "../ItemEditorModal/ModalHeader";
import TabNavigation from "./TabNavigation";
import ImageTab from "./ImageTab";
import OrganizeTab from "./OrganizeTab";
import SaveButton from "../ItemEditorModal/SaveButton";
import { useEditor } from "#/app/editar/contexts/EditorContext";
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
  const { saveProject } = useEditor();
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

  const [isSaving, setIsSaving] = useState(false);

  // Reset pending changes and selected item when modal opens
  // Only reset if items prop has actually changed (not just on open)
  const prevItemsRef = useRef<Client[]>(items);
  const justAppliedChangesRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Check if items actually changed
      const itemsChanged =
        prevItemsRef.current.length !== items.length ||
        prevItemsRef.current.some((item, index) => {
          const newItem = items[index];
          return (
            !newItem || item.id !== newItem.id || item.logo !== newItem.logo
          );
        });

      if (itemsChanged) {
        // If we just applied changes (logo upload), don't reset pendingChanges
        // because the changes are already applied and we want to keep the button enabled
        if (justAppliedChangesRef.current) {
          justAppliedChangesRef.current = false;
          // Update prevItemsRef to prevent this from triggering again
          prevItemsRef.current = items;
        } else {
          prevItemsRef.current = items;
          setPendingChanges({
            itemUpdates: {},
            reorderedItems: undefined,
            deletedItems: [],
            newItems: [],
          });
        }
      }

      setSelectedItemId(currentItemId);
    }
  }, [isOpen, currentItemId, items]);

  // Update selectedItemId when currentItemId changes (but don't reset pendingChanges)
  useEffect(() => {
    if (isOpen && currentItemId !== selectedItemId) {
      setSelectedItemId(currentItemId);
    }
  }, [currentItemId, isOpen, selectedItemId]);

  const currentItem =
    items?.find((item) => item.id === selectedItemId) ||
    pendingChanges.newItems.find((item) => item.id === selectedItemId) ||
    null;

  const getCurrentItemWithChanges = () => {
    if (!currentItem) {
      return null;
    }
    const pendingUpdates = pendingChanges.itemUpdates[currentItem.id!] || {};
    return { ...currentItem, ...pendingUpdates };
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    const totalItems = (items?.length || 0) + pendingChanges.newItems.length;
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
    if (!currentItem?.id) {
      return;
    }

    // Check if this is a logo upload (has logo in data)
    const isLogoUpload = "logo" in data && data.logo !== undefined;

    setPendingChanges((prev) => {
      const updated = {
        ...prev,
        itemUpdates: {
          ...prev.itemUpdates,
          [currentItem.id!]: {
            ...prev.itemUpdates[currentItem.id!],
            ...data,
          },
        },
      };

      // Force a new object reference to ensure React detects the change
      const newPendingChanges = {
        itemUpdates: { ...updated.itemUpdates },
        reorderedItems: updated.reorderedItems,
        deletedItems: [...updated.deletedItems],
        newItems: [...updated.newItems],
      };

      // If this is a logo upload, immediately apply changes and update parent
      if (isLogoUpload) {
        justAppliedChangesRef.current = true;

        // Apply all pending changes (including the new logo)
        const itemsWithUpdates = items
          .filter((item) => !newPendingChanges.deletedItems.includes(item.id!))
          .map((item) => {
            const updates = newPendingChanges.itemUpdates[item.id!];
            return updates ? { ...item, ...updates } : item;
          });

        const newItemsWithUpdates = newPendingChanges.newItems.map(
          (newItem) => {
            const updates = newPendingChanges.itemUpdates[newItem.id!];
            return updates ? { ...newItem, ...updates } : newItem;
          }
        );

        const allItems = [...itemsWithUpdates, ...newItemsWithUpdates];
        const finalItems = newPendingChanges.reorderedItems || allItems;
        const sortedItems = finalItems.map((item, index) => ({
          ...item,
          sortOrder: index,
        }));

        // Apply changes immediately to parent state
        onReorderItems(sortedItems);

        // Keep the logo update in pendingChanges so that when handleSave is called,
        // it will use the correct data even if the items prop hasn't been updated yet
        // The logo update will be applied correctly because we're using sortedItems
        // which already includes all pending changes

        return newPendingChanges;
      }

      return newPendingChanges;
    });
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

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves

    setIsSaving(true);

    try {
      // Always use sortedItems which are already being rendered in the grid
      // These include all pending changes (including logo updates that were applied immediately)
      // sortedItems are calculated from items + pendingChanges.itemUpdates, so they have the latest state

      // If there's a reorderedItems, we need to preserve that order but use the latest state from sortedItems
      let finalItems: Client[];

      if (pendingChanges.reorderedItems) {
        // If items were reordered, we need to preserve that order
        // But we need to get the latest state of each item from sortedItems
        const sortedItemsMap = new Map<string, Client>();
        sortedItems.forEach((item) => {
          if (item.id) {
            sortedItemsMap.set(item.id, item);
          }
        });

        // Use the reordered order, but get the latest state from sortedItems
        finalItems = pendingChanges.reorderedItems
          .map((item) => {
            // Get the latest state from sortedItems (which has all updates applied)
            const latestItem = sortedItemsMap.get(item.id!);
            return latestItem || item;
          })
          .filter((item) => item !== undefined) as Client[];
      } else {
        // Use the sortedItems that are already being rendered (they already have all updates applied)
        // sortedItems are calculated from items + pendingChanges.itemUpdates, so they include:
        // - Logo updates that were applied immediately (via onReorderItems) and are now in items prop
        // - Logo updates that are still in pendingChanges.itemUpdates
        // - Any other pending changes
        finalItems = sortedItems;
      }

      // Update sortOrder based on final order
      const itemsToSave = finalItems.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));

      // Save all changes at once by calling onReorderItems with the final sorted array
      // This will update the entire clients array with all changes applied
      // This ensures that even if logo was updated immediately, we're saving the correct final state
      onReorderItems(itemsToSave);

      // Reset pending changes immediately after saving
      setPendingChanges({
        itemUpdates: {},
        reorderedItems: undefined,
        deletedItems: [],
        newItems: [],
      });

      // Save to backend immediately
      await saveProject({ skipNavigation: true });

      // Close the modal after saving
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      // Don't close modal if save fails
    } finally {
      setIsSaving(false);
    }
  };

  // Apply pending changes to items for display
  const itemsWithPendingUpdates =
    items
      ?.filter((item) => !pendingChanges.deletedItems.includes(item.id!))
      .map((item) => {
        const updates = pendingChanges.itemUpdates[item.id!];
        return updates ? { ...item, ...updates } : item;
      }) || [];

  const newItemsWithPendingUpdates = pendingChanges.newItems.map((newItem) => {
    const updates = pendingChanges.itemUpdates[newItem.id!];
    return updates ? { ...newItem, ...updates } : newItem;
  });

  // If items were reordered, use that order and apply any pending updates
  let sortedItems: Client[];
  if (pendingChanges.reorderedItems) {
    // Create a map of all items (existing + new) with their updates
    const allItemsMap = new Map<string, Client>();
    [...itemsWithPendingUpdates, ...newItemsWithPendingUpdates].forEach(
      (item) => {
        if (item.id) {
          allItemsMap.set(item.id, item);
        }
      }
    );

    // Use the reordered order, but apply any pending updates from the map
    sortedItems = pendingChanges.reorderedItems
      .map((item) => {
        const updatedItem = allItemsMap.get(item.id!);
        if (updatedItem) {
          // Merge the reordered item with any pending updates
          return { ...item, ...updatedItem };
        }
        return item;
      })
      .filter((item) => item !== undefined) as Client[];
  } else {
    // No reordering, just combine and sort
    sortedItems = [
      ...itemsWithPendingUpdates,
      ...newItemsWithPendingUpdates,
    ].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

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

      <div className="relative z-10 flex flex-shrink-0 flex-col">
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
          <SaveButton onSave={handleSave} hasChanges isLoading={isSaving} />
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
