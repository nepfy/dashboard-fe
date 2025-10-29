"use client";

import ContentTab from "./ContentTab";
import ImageTab from "./ImageTab";
import IconTab from "./IconTab";
import OrganizeTab from "./OrganizeTab";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
} from "#/types/template-data";

type TabType = "conteudo" | "imagem" | "organizar";

interface TabContentProps {
  activeTab: TabType;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq";
  currentItem:
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
    | null;
  sortedItems: (
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
  )[];
  onUpdate: (
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | Partial<StepTopic>
      | Partial<FAQItem>
      | {
          reorderedItems: (
            | TeamMember
            | Result
            | ExpertiseTopic
            | Testimonial
            | StepTopic
            | FAQItem
          )[];
        }
  ) => void;
  onDelete: (itemId: string) => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
  setShowConfirmExclusion: (show: boolean) => void;
  onUpdateSection?: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
  pendingHideIcon?: boolean;
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
  onUpdateSection,
  hideIcon,
  pendingHideIcon,
}: TabContentProps) {
  // Prevent ANY image-related content from showing for steps
  if (itemType === "steps" && activeTab === "imagem") {
    return (
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-32 items-center justify-center text-gray-500">
          Esta seção não suporta edição de imagens
        </div>
      </div>
    );
  }

  // Additional safeguard: Never render IconTab for steps or FAQ
  if (itemType === "steps" || itemType === "faq") {
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
            onDeleteItem={onDelete}
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

      {activeTab === "imagem" && itemType === "expertise" && (
        <IconTab
          itemType={itemType}
          currentItem={currentItem as ExpertiseTopic}
          onUpdate={onUpdate}
          onUpdateSection={onUpdateSection!}
          hideIcon={hideIcon}
          pendingHideIcon={pendingHideIcon}
        />
      )}

      {activeTab === "imagem" && itemType !== "expertise" && (
        <ImageTab
          itemType={itemType as "team" | "results" | "testimonials"}
          currentItem={currentItem as TeamMember | Result | Testimonial}
          onUpdate={
            onUpdate as (
              data: Partial<TeamMember> | Partial<Result> | Partial<Testimonial>
            ) => void
          }
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
