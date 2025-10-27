"use client";

import ContentTab from "./ContentTab";
import ImageTab from "./ImageTab";
import OrganizeTab from "./OrganizeTab";
import { TeamMember, Result } from "#/types/template-data";

type TabType = "conteudo" | "imagem" | "organizar";

interface TabContentProps {
  activeTab: TabType;
  itemType: "team" | "results";
  currentItem: TeamMember | Result | null;
  sortedItems: (TeamMember | Result)[];
  onUpdate: (
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | { reorderedItems: (TeamMember | Result)[] }
  ) => void;
  onDelete: (itemId: string) => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
  setShowConfirmExclusion: (show: boolean) => void;
}

export default function TabContent({
  activeTab,
  itemType,
  currentItem,
  sortedItems,
  onUpdate,
  onDelete,
  setShowExploreGalleryInfo,
  setShowPexelsGallery,
  setShowUploadImageInfo,
  setShowUploadImage,
  setShowConfirmExclusion,
}: TabContentProps) {
  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {activeTab === "conteudo" && (
        <ContentTab
          itemType={itemType}
          currentItem={currentItem}
          onUpdate={onUpdate}
          onDeleteItem={onDelete} // Pass the handleDeleteItem function
        />
      )}

      {activeTab === "imagem" && (
        <ImageTab
          itemType={itemType}
          currentItem={currentItem}
          onUpdate={onUpdate}
          setShowExploreGalleryInfo={setShowExploreGalleryInfo}
          setShowPexelsGallery={setShowPexelsGallery}
          setShowUploadImageInfo={setShowUploadImageInfo}
          setShowUploadImage={setShowUploadImage}
        />
      )}

      {activeTab === "organizar" && (
        <OrganizeTab
          itemType={itemType}
          items={sortedItems}
          onUpdate={onUpdate}
          setShowConfirmExclusion={setShowConfirmExclusion}
          onDeleteItem={onDelete}
        />
      )}
    </div>
  );
}
