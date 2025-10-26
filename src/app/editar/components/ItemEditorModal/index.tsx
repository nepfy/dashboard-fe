"use client";

import { useState, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import MainModalContent from "./MainModalContent";
import ExploreGalleryInfo from "./ExploreGalleryInfo";
import UploadImageInfo from "./UploadImageInfo";
import PexelsGallery from "./PexelsGallery";
import UploadImage from "./UploadImage";
import { TeamMember, Result } from "#/types/template-data";

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "team" | "results";
  items: (TeamMember | Result)[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data: Partial<TeamMember> | Partial<Result>
  ) => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems: (items: TeamMember[] | Result[]) => void;
}

type TabType = "conteudo" | "imagem" | "organizar";

export default function ItemEditorModal({
  isOpen,
  onClose,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onReorderItems,
}: ItemEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("conteudo");
  const [showExploreGalleryInfo, setShowExploreGalleryInfo] = useState(false);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [showUploadImageInfo, setShowUploadImageInfo] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    currentItemId
  );
  const [pendingChanges, setPendingChanges] = useState<
    Partial<TeamMember> | Partial<Result>
  >({});

  useEffect(() => {
    setSelectedItemId(currentItemId);
    setPendingChanges({});
  }, [currentItemId]);

  const currentItem = items.find((item) => item.id === selectedItemId) || null;

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    if (items.length < 6) {
      onAddItem();
      const sortedItems = [...items].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      );
      const newItem = sortedItems[sortedItems.length - 1];
      if (newItem) {
        setSelectedItemId(newItem.id || null);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    onDeleteItem(itemId);
    if (selectedItemId === itemId) {
      const remainingItems = items.filter((item) => item.id !== itemId);
      setSelectedItemId(
        remainingItems.length > 0 ? remainingItems[0].id || null : null
      );
    }
  };

  const handleUpdateItem = (data: Partial<TeamMember> | Partial<Result>) => {
    setPendingChanges((prev) => ({ ...prev, ...data }));
  };

  const handleSave = () => {
    if (selectedItemId && Object.keys(pendingChanges).length > 0) {
      onUpdateItem(selectedItemId, pendingChanges);
      setPendingChanges({});

      setTimeout(() => {
        console.log("Calling onClose now");
        onClose();
      }, 100);
    }
  };

  const handleReorderItems = (reorderedItems: (TeamMember | Result)[]) => {
    onReorderItems(reorderedItems);
  };

  const getTitle = () => {
    return itemType === "team" ? "Time" : "Resultados";
  };

  if (!isOpen) return null;

  return (
    <div className="z-[100] w-full">
      <EditableModal
        isOpen={isOpen}
        className="absolute top-0 right-0 flex h-[650px] flex-col items-stretch"
        trianglePosition="top-[85px] left-[-8px]"
      >
        {!showExploreGalleryInfo &&
          !showPexelsGallery &&
          !showUploadImageInfo &&
          !showUploadImage && (
            <MainModalContent
              title={getTitle()}
              items={items}
              selectedItemId={selectedItemId}
              currentItem={currentItem}
              activeTab={activeTab}
              pendingChanges={pendingChanges}
              onClose={onClose}
              onItemSelect={handleItemSelect}
              onAddItem={handleAddItem}
              onTabChange={setActiveTab}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              onReorder={handleReorderItems}
              onUpdateItem={onUpdateItem}
              onSave={handleSave}
              setShowExploreGalleryInfo={setShowExploreGalleryInfo}
              setShowPexelsGallery={setShowPexelsGallery}
              setShowUploadImageInfo={setShowUploadImageInfo}
              setShowUploadImage={setShowUploadImage}
            />
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
              handleUpdateItem(
                itemType === "team" ? { image: imageUrl } : { photo: imageUrl }
              );
              setShowPexelsGallery(false);
            }}
          />
        )}

        {showUploadImage && (
          <UploadImage onClose={() => setShowUploadImage(false)} />
        )}
      </EditableModal>
    </div>
  );
}
