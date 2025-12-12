"use client";

import { useEffect, useMemo, useState } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import ModalHeader from "#/app/editar/components/ItemEditorModal/ModalHeader";
import ItemSelector from "#/app/editar/components/ItemEditorModal/ItemSelector";
import SaveButton from "#/app/editar/components/ItemEditorModal/SaveButton";
import ImageTab from "#/app/editar/components/ItemEditorModal/ImageTab";
import OrganizeTab from "#/app/editar/components/ItemEditorModal/OrganizeTab";
import ExploreGalleryInfo from "#/app/editar/components/ItemEditorModal/ExploreGalleryInfo";
import UploadImageInfo from "#/app/editar/components/ItemEditorModal/UploadImageInfo";
import PexelsGallery from "#/app/editar/components/ItemEditorModal/PexelsGallery";
import UploadImage from "#/app/editar/components/ItemEditorModal/UploadImage";
import ConfirmExclusion from "#/app/editar/components/ItemEditorModal/ConfirmExclusion";
import { IntroductionService } from "#/types/template-data";

type TabType = "imagem" | "organizar";

interface IntroMarqueeModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: IntroductionService[];
  initialItemId?: string | null;
  onSave: (items: IntroductionService[]) => void;
}

export default function IntroMarqueeModal({
  isOpen,
  onClose,
  items,
  initialItemId = null,
  onSave,
}: IntroMarqueeModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("imagem");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialItemId
  );
  const [showExploreGalleryInfo, setShowExploreGalleryInfo] = useState(false);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [showUploadImageInfo, setShowUploadImageInfo] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showConfirmExclusion, setShowConfirmExclusion] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [pendingChanges, setPendingChanges] = useState<{
    itemUpdates: Record<string, Partial<IntroductionService>>;
    reorderedItems?: IntroductionService[];
    deletedItems: string[];
    newItems: IntroductionService[];
  }>({
    itemUpdates: {},
    reorderedItems: undefined,
    deletedItems: [],
    newItems: [],
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedItemId(initialItemId || items[0]?.id || null);
      setPendingChanges({
        itemUpdates: {},
        reorderedItems: undefined,
        deletedItems: [],
        newItems: [],
      });
      setActiveTab("imagem");
      setShowExploreGalleryInfo(false);
      setShowPexelsGallery(false);
      setShowUploadImageInfo(false);
      setShowUploadImage(false);
      setShowConfirmExclusion(false);
      setItemToDelete(null);
    }
  }, [isOpen, initialItemId, items]);

  const baseItems = useMemo(
    () =>
      [...(items || [])].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      ),
    [items]
  );

  const getItemsWithChanges = () => {
    let itemsToReturn = baseItems
      .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
      .map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));

    const newItemsWithUpdates = pendingChanges.newItems.map((item) => ({
      ...item,
      ...pendingChanges.itemUpdates[item.id!],
    }));
    itemsToReturn = [...itemsToReturn, ...newItemsWithUpdates];

    if (pendingChanges.reorderedItems) {
      itemsToReturn = pendingChanges.reorderedItems
        .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
        .map((item) => ({
          ...item,
          ...pendingChanges.itemUpdates[item.id!],
        }));
    }

    return itemsToReturn;
  };

  const itemsWithChanges = getItemsWithChanges();
  const sortedItems = [...itemsWithChanges].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  const currentItem =
    itemsWithChanges.find((item) => item.id === selectedItemId) || null;

  const getCurrentItemWithChanges = () => {
    if (!currentItem) return null;
    const pending = pendingChanges.itemUpdates[currentItem.id!] || {};
    return { ...currentItem, ...pending };
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    const totalItems = itemsWithChanges.length;
    if (totalItems >= 6) return;

    const newItem: IntroductionService = {
      id: `temp-${Date.now()}`,
      image: "",
      serviceName: "",
      sortOrder: totalItems,
      hideItem: false,
    };

    setPendingChanges((prev) => ({
      ...prev,
      newItems: [...prev.newItems, newItem],
    }));

    setSelectedItemId(newItem.id);
    setActiveTab("imagem");
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setShowConfirmExclusion(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    setPendingChanges((prev) => {
      const isNew = prev.newItems.some((item) => item.id === itemToDelete);

      if (selectedItemId === itemToDelete) {
        const remaining = itemsWithChanges.filter(
          (item) => item.id !== itemToDelete
        );
        setSelectedItemId(
          remaining.length > 0 ? remaining[0].id || null : null
        );
      }

      if (isNew) {
        return {
          ...prev,
          newItems: prev.newItems.filter((item) => item.id !== itemToDelete),
        };
      }

      return {
        ...prev,
        deletedItems: [...prev.deletedItems, itemToDelete],
      };
    });

    setItemToDelete(null);
    setShowConfirmExclusion(false);
  };

  const handleUpdate = (
    data:
      | Partial<IntroductionService>
      | { reorderedItems: IntroductionService[] }
  ) => {
    if ("reorderedItems" in data) {
      setPendingChanges((prev) => ({
        ...prev,
        reorderedItems: data.reorderedItems,
      }));
    } else if (selectedItemId) {
      setPendingChanges((prev) => ({
        ...prev,
        itemUpdates: {
          ...prev.itemUpdates,
          [selectedItemId]: {
            ...prev.itemUpdates[selectedItemId],
            ...data,
          },
        },
      }));
    }
  };

  const handleSave = () => {
    const hasChanges =
      Object.keys(pendingChanges.itemUpdates).length > 0 ||
      pendingChanges.deletedItems.length > 0 ||
      pendingChanges.newItems.length > 0 ||
      pendingChanges.reorderedItems;

    if (!hasChanges) {
      onClose();
      return;
    }

    let finalItems: IntroductionService[];

    if (pendingChanges.reorderedItems) {
      finalItems = pendingChanges.reorderedItems.map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));
    } else {
      const currentItems = baseItems.filter(
        (item) => !pendingChanges.deletedItems.includes(item.id!)
      );

      const updatedItems = currentItems.map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));

      const newItemsWithUpdates = pendingChanges.newItems.map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));

      finalItems = [...updatedItems, ...newItemsWithUpdates];
    }

    const withOrder = finalItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    onSave(withOrder);
    onClose();
  };

  if (!isOpen) return null;

  const hasChanges =
    Object.keys(pendingChanges.itemUpdates || {}).length > 0 ||
    (pendingChanges.deletedItems || []).length > 0 ||
    (pendingChanges.newItems || []).length > 0 ||
    !!pendingChanges.reorderedItems;

  return (
    <EditableModal
      isOpen={isOpen}
      className="flex max-h-[90vh] min-h-[600px] w-[360px] max-w-[360px] cursor-default flex-col items-stretch"
      preferredPlacement="right"
    >
      {!showExploreGalleryInfo &&
        !showPexelsGallery &&
        !showUploadImageInfo &&
        !showUploadImage &&
        !showConfirmExclusion && (
          <div
            className="bg-white-neutral-light-100 relative z-11 flex h-full w-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader title="Imagem" onClose={onClose} />

            <ItemSelector
              items={itemsWithChanges}
              selectedItemId={selectedItemId}
              onItemSelect={handleItemSelect}
              onAddItem={handleAddItem}
              itemType="introServices"
            />

            <div className="mb-4 grid flex-shrink-0 grid-cols-2 gap-2 rounded-[10px] p-[1px]">
              {(["imagem", "organizar"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full cursor-pointer rounded-[10px] border border-transparent px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
                    activeTab === tab
                      ? "bg-white-neutral-light-100 text-primary-light-500 border-white-neutral-light-300"
                      : "hover:bg-white-neutral-light-300 text-[#6C747E]"
                  }`}
                >
                  {tab === "imagem" ? "Imagem" : "Organizar"}
                </button>
              ))}
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {activeTab === "imagem" && (
                <ImageTab
                  itemType="introServices"
                  currentItem={getCurrentItemWithChanges()}
                  onDeleteItem={handleDeleteItem}
                  onUpdate={handleUpdate}
                  setShowExploreGalleryInfo={setShowExploreGalleryInfo}
                  setShowPexelsGallery={setShowPexelsGallery}
                  setShowUploadImageInfo={setShowUploadImageInfo}
                  setShowUploadImage={setShowUploadImage}
                />
              )}

              {activeTab === "organizar" && (
                <OrganizeTab
                  itemType="introServices"
                  items={sortedItems}
                  onUpdate={(data) =>
                    handleUpdate(
                      "reorderedItems" in data
                        ? {
                            reorderedItems:
                              data.reorderedItems as IntroductionService[],
                          }
                        : data
                    )
                  }
                  setShowConfirmExclusion={setShowConfirmExclusion}
                  onDeleteItem={handleDeleteItem}
                />
              )}
            </div>

            <SaveButton onSave={handleSave} hasChanges={hasChanges} />
          </div>
        )}

      {showExploreGalleryInfo && (
        <ExploreGalleryInfo
          onExploreGallery={() => {
            setShowPexelsGallery(true);
            setShowExploreGalleryInfo(false);
          }}
          onClose={() => setShowExploreGalleryInfo(false)}
        />
      )}

      {showUploadImageInfo && (
        <UploadImageInfo
          onUploadImage={() => {
            setShowUploadImage(true);
            setShowUploadImageInfo(false);
          }}
          onClose={() => setShowUploadImageInfo(false)}
        />
      )}

      {showPexelsGallery && (
        <PexelsGallery
          onClose={() => setShowPexelsGallery(false)}
          onSelectImage={(imageUrl) => {
            handleUpdate({ image: imageUrl });
            setShowPexelsGallery(false);
          }}
        />
      )}

      {showUploadImage && (
        <UploadImage
          onClose={() => setShowUploadImage(false)}
          itemType="introServices"
          items={itemsWithChanges}
          onUpdate={handleUpdate}
        />
      )}

      {showConfirmExclusion && (
        <ConfirmExclusion
          onClose={() => {
            setShowConfirmExclusion(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </EditableModal>
  );
}
