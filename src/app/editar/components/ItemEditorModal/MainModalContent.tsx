"use client";

import ModalHeader from "./ModalHeader";
import ItemSelector from "./ItemSelector";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import SaveButton from "./SaveButton";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
} from "#/types/template-data";

type TabType = "conteudo" | "imagem" | "organizar";

interface MainModalContentProps {
  title: string;
  items: (
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
  )[];
  selectedItemId: string | null;
  currentItem:
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
    | null;
  activeTab: TabType;
  pendingChanges: {
    itemUpdates: Record<
      string,
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | Partial<StepTopic>
      | Partial<FAQItem>
    >;
    reorderedItems?: (
      | TeamMember
      | Result
      | ExpertiseTopic
      | Testimonial
      | StepTopic
      | FAQItem
    )[];
    deletedItems: string[];
    sectionUpdates?: { hideIcon?: boolean };
  };
  onClose: () => void;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
  onTabChange: (tab: TabType) => void;
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
  onSave: () => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
  setShowConfirmExclusion: (show: boolean) => void;
  onUpdateSection?: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
  pendingHideIcon?: boolean;
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
  onUpdateSection,
  hideIcon,
  pendingHideIcon,
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

  // Helper function to determine item type based on item properties
  const getItemType = (
    items: (
      | TeamMember
      | Result
      | ExpertiseTopic
      | Testimonial
      | StepTopic
      | FAQItem
    )[]
  ): "team" | "results" | "expertise" | "testimonials" | "steps" | "faq" => {
    if (items.length === 0) return "expertise";

    const firstItem = items[0];

    // Check for team members (have name, role, but no testimonial)
    if (
      "name" in firstItem &&
      "role" in firstItem &&
      !("testimonial" in firstItem)
    ) {
      return "team";
    }

    // Check for results (have client property)
    if ("client" in firstItem) {
      return "results";
    }

    // Check for testimonials (have testimonial property)
    if ("testimonial" in firstItem) {
      return "testimonials";
    }

    // Check for steps (have title, description, but no icon)
    if (
      "title" in firstItem &&
      "description" in firstItem &&
      !("icon" in firstItem)
    ) {
      return "steps";
    }

    // Check for FAQ (have question, answer)
    if ("question" in firstItem && "answer" in firstItem) {
      return "faq";
    }

    // Default to expertise
    return "expertise";
  };

  const detectedItemType = getItemType(itemsWithChanges);

  return (
    <div
      className="bg-white-neutral-light-100 relative z-11 flex h-full w-full flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <ModalHeader title={title} onClose={onClose} />

      <ItemSelector
        items={itemsWithChanges}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
        onAddItem={onAddItem}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        itemType={detectedItemType}
      />

      <TabContent
        activeTab={activeTab}
        itemType={detectedItemType}
        currentItem={currentItem}
        sortedItems={sortedItems}
        onUpdate={onUpdate}
        onDelete={onDelete}
        setShowExploreGalleryInfo={setShowExploreGalleryInfo}
        setShowPexelsGallery={setShowPexelsGallery}
        setShowUploadImageInfo={setShowUploadImageInfo}
        setShowUploadImage={setShowUploadImage}
        setShowConfirmExclusion={setShowConfirmExclusion}
        onUpdateSection={onUpdateSection}
        hideIcon={hideIcon}
        pendingHideIcon={pendingHideIcon}
      />

      <SaveButton
        onSave={onSave}
        hasChanges={
          Object.keys(pendingChanges.itemUpdates || {}).length > 0 ||
          (pendingChanges.deletedItems || []).length > 0 ||
          !!pendingChanges.reorderedItems ||
          !!pendingChanges.sectionUpdates
        }
      />
    </div>
  );
}
