"use client";

import ItemEditorModal from "#/app/editar/components/ItemEditorModal";
import { TeamMember, Result } from "#/types/template-data";

interface EditableImageProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  itemType: "team" | "results";
  items: (TeamMember | Result)[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data: Partial<TeamMember> | Partial<Result>
  ) => void;
  onAddItem: () => void;
  onReorderItems: (items: TeamMember[] | Result[]) => void;
}

export default function EditableImage({
  isModalOpen,
  setIsModalOpen,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onAddItem,
  onReorderItems,
}: EditableImageProps) {
  return (
    <ItemEditorModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      itemType={itemType}
      items={items}
      currentItemId={currentItemId}
      onUpdateItem={onUpdateItem}
      onAddItem={onAddItem}
      onReorderItems={onReorderItems}
    />
  );
}
