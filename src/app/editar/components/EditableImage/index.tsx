"use client";

import ItemEditorModal from "#/app/editar/components/ItemEditorModal";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
} from "#/types/template-data";

interface EditableImageProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq";
  items: (
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
  )[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | Partial<StepTopic>
      | Partial<FAQItem>
  ) => void;
  onReorderItems: (
    items:
      | TeamMember[]
      | Result[]
      | ExpertiseTopic[]
      | Testimonial[]
      | StepTopic[]
      | FAQItem[]
  ) => void;
  onUpdateSection?: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
}

export default function EditableImage({
  isModalOpen,
  setIsModalOpen,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onReorderItems,
  onUpdateSection,
  hideIcon,
}: EditableImageProps) {
  return (
    <ItemEditorModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      itemType={itemType}
      items={items}
      currentItemId={currentItemId}
      onUpdateItem={onUpdateItem}
      onReorderItems={onReorderItems}
      onUpdateSection={onUpdateSection}
      hideIcon={hideIcon}
    />
  );
}
