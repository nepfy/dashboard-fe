"use client";

import ItemEditorModal from "#/app/editar/components/ItemEditorModal";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
} from "#/types/template-data";

interface EditableImageProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  itemType: "team" | "results" | "expertise" | "testimonials";
  items: (TeamMember | Result | ExpertiseTopic | Testimonial)[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
  ) => void;
  onReorderItems: (
    items: TeamMember[] | Result[] | ExpertiseTopic[] | Testimonial[]
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
