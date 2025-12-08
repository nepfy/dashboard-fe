"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EditableModal from "#/app/editar/components/EditableModal";
import ModalHeader from "#/app/editar/components/ItemEditorModal/ModalHeader";
import { useEditor } from "#/app/editar/contexts/EditorContext";

interface EditableMarqueeTextProps {
  value: string;
  onChange: (text: string) => void;
  editingId: string;
  title?: string;
  placeholder?: string;
}

export default function EditableMarqueeText({
  value,
  onChange,
  editingId,
  title = "Marquee",
  placeholder = "Clique para adicionar imagem e descrição",
}: EditableMarqueeTextProps) {
  const { startEditing, stopEditing } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      const canStart = startEditing(editingId);
      if (!canStart) {
        setIsModalOpen(false);
        return;
      }
    } else {
      stopEditing(editingId);
    }
    return () => {
      stopEditing(editingId);
    };
  }, [isModalOpen, editingId, startEditing, stopEditing]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setAnchorRect(rect);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    onChange(draft);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
      >
        {value}
      </div>

      <EditableModal
        isOpen={isModalOpen}
        className="flex min-h-[300px] cursor-default flex-col items-stretch w-[360px] max-w-[360px]"
        preferredPlacement="right"
        anchorRect={anchorRect}
      >
        <div className="flex h-full w-full flex-col">
          <ModalHeader title={title} onClose={() => setIsModalOpen(false)} />

          <div className="px-2">
            <div className="mb-4 rounded-[10px] border border-white-neutral-light-300 bg-white-neutral-light-200 p-[1px]">
              <button className="w-full rounded-[10px] bg-white-neutral-light-100 px-4 py-3 text-sm font-medium text-primary-light-500">
                Conteúdo
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2A2A2A]">
                Marquee
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full rounded-[8px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm text-[#161616] outline-none focus:border-[#7B61FF]"
                placeholder={placeholder}
                rows={3}
              />
            </div>
          </div>

          <div className="mt-auto flex items-center justify-center px-2 pb-4 pt-6">
            <button
              onClick={handleSave}
              className="flex w-full transform items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </EditableModal>
    </>
  );
}

