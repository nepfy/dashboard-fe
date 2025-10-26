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
  pendingChanges: Partial<TeamMember> | Partial<Result>;
  onClose: () => void;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
  onTabChange: (tab: TabType) => void;
  onUpdate: (data: Partial<TeamMember> | Partial<Result>) => void;
  onDelete: (itemId: string) => void;
  onReorder: (items: TeamMember[] | Result[]) => void;
  onUpdateItem: (
    itemId: string,
    data: Partial<TeamMember> | Partial<Result>
  ) => void;
  onSave: () => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
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
  onReorder,
  onUpdateItem,
  onSave,
  setShowExploreGalleryInfo,
  setShowPexelsGallery,
  setShowUploadImageInfo,
  setShowUploadImage,
}: MainModalContentProps) {
  const sortedItems = [...items].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <div className="bg-white-neutral-light-100 relative flex h-full flex-col">
      <ModalHeader title={title} onClose={onClose} />

      <ItemSelector
        items={items}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
        onAddItem={onAddItem}
      />

      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      <TabContent
        activeTab={activeTab}
        itemType={items.length > 0 && "name" in items[0] ? "team" : "results"}
        currentItem={currentItem}
        sortedItems={sortedItems}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReorder={onReorder}
        onUpdateItem={onUpdateItem}
        setShowExploreGalleryInfo={setShowExploreGalleryInfo}
        setShowPexelsGallery={setShowPexelsGallery}
        setShowUploadImageInfo={setShowUploadImageInfo}
        setShowUploadImage={setShowUploadImage}
      />

      <SaveButton
        onSave={onSave}
        hasChanges={Object.keys(pendingChanges).length > 0}
      />
    </div>
  );
}
