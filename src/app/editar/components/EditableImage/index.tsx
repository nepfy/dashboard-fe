"use client";

import { useEffect } from "react";
import ItemEditorModal from "#/app/editar/components/ItemEditorModal";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
  AboutUsItem,
  IntroductionService,
} from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";

interface EditableImageProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  editingId: string;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq" | "aboutUs" | "introServices";
  items: (
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
    | AboutUsItem
    | IntroductionService
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
      | Partial<AboutUsItem>
      | Partial<IntroductionService>
  ) => void;
  onReorderItems: (
    items:
      | TeamMember[]
      | Result[]
      | ExpertiseTopic[]
      | Testimonial[]
      | StepTopic[]
      | FAQItem[]
      | AboutUsItem[]
      | IntroductionService[]
  ) => void;
  onUpdateSection?: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
}

export default function EditableImage({
  isModalOpen,
  setIsModalOpen,
  editingId,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onReorderItems,
  onUpdateSection,
  hideIcon,
}: EditableImageProps) {
  const { startEditing, stopEditing } = useEditor();

  useEffect(() => {
    if (isModalOpen) {
      // Try to start editing when modal opens
      const canStartEditing = startEditing(editingId);
      console.log('🐛 EditableImage startEditing:', {
        editingId,
        canStartEditing,
        itemType,
      });
      if (!canStartEditing) {
        // If another field/modal is already active, close this modal
        console.warn('⚠️ Cannot start editing, another field is active');
        setIsModalOpen(false);
        return;
      }
    } else {
      // Stop editing when modal closes
      stopEditing(editingId);
    }
  }, [isModalOpen, editingId, startEditing, stopEditing, setIsModalOpen, itemType]);

  const handleClose = () => {
    setIsModalOpen(false);
    stopEditing(editingId);
  };

  return (
    <ItemEditorModal
      isOpen={isModalOpen}
      onClose={handleClose}
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
