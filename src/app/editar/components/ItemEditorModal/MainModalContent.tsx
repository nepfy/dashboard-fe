"use client";

import ModalHeader from "./ModalHeader";
import ItemSelector from "./ItemSelector";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import SaveButton from "./SaveButton";
import { TeamMember, Result } from "#/types/template-data";

type TabType = "conteudo" | "imagem" | "organizar";

interface MainModalContentProps {
  title: string;
  items: (TeamMember | Result)[];
  selectedItemId: string | null;
  currentItem: TeamMember | Result | null;
  activeTab: TabType;
  pendingChanges: {
    itemUpdates: Record<string, Partial<TeamMember> | Partial<Result>>;
    reorderedItems?: (TeamMember | Result)[];
    deletedItems: string[];
  };
  onClose: () => void;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
  onTabChange: (tab: TabType) => void;
  onUpdate: (
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | { reorderedItems: (TeamMember | Result)[] }
  ) => void;
  onDelete: (itemId: string) => void;
  onSave: () => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
  setShowConfirmExclusion: (show: boolean) => void;
}

export default function MainModalContent({
  title,
  items,
  selectedItemId,
  currentItem,
  activeTab,
  pendingChanges,
  onClose,
  onItemSelect,
  onAddItem,
  onTabChange,
  onUpdate,
  onDelete,
  onSave,
  setShowExploreGalleryInfo,
  setShowPexelsGallery,
  setShowUploadImageInfo,
  setShowUploadImage,
  setShowConfirmExclusion,
}: MainModalContentProps) {
  // Get items with pending changes applied
  const getItemsWithChanges = () => {
    let itemsToReturn = items
      .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
      .map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));

    // Apply reordered items if they exist
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

  return (
    <div
      className="bg-white-neutral-light-100 relative z-11 flex h-[550px] w-full flex-col sm:h-[650px]"
      onClick={(e) => e.stopPropagation()}
    >
      <ModalHeader title={title} onClose={onClose} />

      <ItemSelector
        items={itemsWithChanges}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
        onAddItem={onAddItem}
      />

      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      <TabContent
        activeTab={activeTab}
        itemType={
          itemsWithChanges.length > 0 && "name" in itemsWithChanges[0]
            ? "team"
            : "results"
        }
        currentItem={currentItem}
        sortedItems={sortedItems}
        onUpdate={onUpdate}
        onDelete={onDelete}
        setShowExploreGalleryInfo={setShowExploreGalleryInfo}
        setShowPexelsGallery={setShowPexelsGallery}
        setShowUploadImageInfo={setShowUploadImageInfo}
        setShowUploadImage={setShowUploadImage}
        setShowConfirmExclusion={setShowConfirmExclusion}
      />

      <SaveButton
        onSave={onSave}
        hasChanges={
          Object.keys(pendingChanges.itemUpdates || {}).length > 0 ||
          (pendingChanges.deletedItems || []).length > 0 ||
          !!pendingChanges.reorderedItems
        }
      />
    </div>
  );
}
