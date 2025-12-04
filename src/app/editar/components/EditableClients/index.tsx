"use client";

import { useEffect } from "react";
import ClientEditorModal from "./ClientEditorModal";
import type { Client } from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";

interface EditableClientsProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  editingId: string;
  items: Client[] | null;
  currentItemId: string | null;
  onReorderItems: (items: Client[]) => void;
  onClose: () => void;
}

export default function EditableClients({
  isModalOpen,
  setIsModalOpen,
  editingId,
  items = [],
  currentItemId,
  onReorderItems,
  onClose,
}: EditableClientsProps) {
  const { startEditing, stopEditing } = useEditor();

  useEffect(() => {
    if (isModalOpen) {
      // Try to start editing when modal opens
      const canStartEditing = startEditing(editingId);
      if (!canStartEditing) {
        // If another field/modal is already active, close this modal
        setIsModalOpen(false);
        return;
      }
    } else {
      // Stop editing when modal closes
      stopEditing(editingId);
    }
  }, [isModalOpen, editingId, startEditing, stopEditing, setIsModalOpen]);

  const handleClose = () => {
    onClose();
    stopEditing(editingId);
  };

  return (
    <ClientEditorModal
      isOpen={isModalOpen}
      onClose={handleClose}
      items={items as Client[]}
      currentItemId={currentItemId}
      onReorderItems={onReorderItems}
    />
  );
}
