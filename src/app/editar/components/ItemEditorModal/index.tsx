"use client";

import { useState, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import CloseIcon from "#/components/icons/CloseIcon";
import ContentTab from "./ContentTab";
import ImageTab from "./ImageTab";
import OrganizeTab from "./OrganizeTab";
import { TeamMember, Result } from "#/types/template-data";

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "team" | "results";
  items: (TeamMember | Result)[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data: Partial<TeamMember> | Partial<Result>
  ) => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems: (items: TeamMember[] | Result[]) => void;
}

type TabType = "conteudo" | "imagem" | "organizar";

export default function ItemEditorModal({
  isOpen,
  onClose,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onReorderItems,
}: ItemEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("conteudo");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    currentItemId
  );
  const [pendingChanges, setPendingChanges] = useState<
    Partial<TeamMember> | Partial<Result>
  >({});

  useEffect(() => {
    setSelectedItemId(currentItemId);
    setPendingChanges({});
  }, [currentItemId]);

  const currentItem = items.find((item) => item.id === selectedItemId) || null;

  const sortedItems = [...items].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    if (items.length < 6) {
      onAddItem();
      const newItem = sortedItems[sortedItems.length - 1];
      if (newItem) {
        setSelectedItemId(newItem.id || null);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    onDeleteItem(itemId);
    if (selectedItemId === itemId) {
      const remainingItems = items.filter((item) => item.id !== itemId);
      setSelectedItemId(
        remainingItems.length > 0 ? remainingItems[0].id || null : null
      );
    }
  };

  const handleUpdateItem = (data: Partial<TeamMember> | Partial<Result>) => {
    setPendingChanges((prev) => ({ ...prev, ...data }));
  };

  const handleSave = () => {
    if (selectedItemId && Object.keys(pendingChanges).length > 0) {
      onUpdateItem(selectedItemId, pendingChanges);
      setPendingChanges({});
    }
  };

  const handleReorderItems = (reorderedItems: (TeamMember | Result)[]) => {
    onReorderItems(reorderedItems);
  };

  const getTitle = () => {
    return itemType === "team" ? "Time" : "Resultados";
  };

  if (!isOpen) return null;

  return (
    <div className="z-[100] w-full">
      <EditableModal
        isOpen={isOpen}
        className="absolute top-0 right-0 flex h-[650px] flex-col items-stretch"
        trianglePosition="top-[85px] left-[-8px]"
      >
        <div className="bg-white-neutral-light-100 relative flex h-full flex-col">
          <div
            className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-lg font-medium text-[#2A2A2A]">
              {getTitle()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
            >
              <CloseIcon width="12" height="12" fill="#1C1A22" />
            </button>
          </div>

          <div className="mb-6 flex flex-shrink-0 gap-2">
            {sortedItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item.id!)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                  selectedItemId === item.id
                    ? "border-primary-light-400 bg-primary-light-10 text-primary-light-400"
                    : "border-white-neutral-light-300 text-white-neutral-light-500 bg-white-neutral-light-200 hover:border-text-white-neutral-light-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
            {items.length < 6 && (
              <button
                onClick={handleAddItem}
                className="border-white-neutral-light-300 text-white-neutral-light-700 hover:border-white-neutral-light-400 flex h-8 w-8 items-center justify-center rounded-[8px] border border-dashed text-[24px] font-light transition-colors"
              >
                +
              </button>
            )}
          </div>

          <div className="bg-white-neutral-light-200 mb-4 flex flex-shrink-0 justify-between rounded-[8px] p-[1px]">
            {[
              { id: "conteudo", label: "Conteúdo" },
              { id: "imagem", label: "Imagem" },
              { id: "organizar", label: "Organizar" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`rounded-[8px] border border-transparent px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white-neutral-light-100 text-primary-light-500 border-white-neutral-light-300"
                    : "hover:bg-white-neutral-light-300 bg-transparent text-[#6C747E]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {activeTab === "conteudo" && (
              <ContentTab
                itemType={itemType}
                currentItem={currentItem}
                onUpdate={handleUpdateItem}
                onDelete={() =>
                  selectedItemId && handleDeleteItem(selectedItemId)
                }
              />
            )}

            {activeTab === "imagem" && (
              <ImageTab
                itemType={itemType}
                currentItem={currentItem}
                onUpdate={handleUpdateItem}
              />
            )}

            {activeTab === "organizar" && (
              <OrganizeTab
                itemType={itemType}
                items={sortedItems}
                onReorder={handleReorderItems}
                onDelete={handleDeleteItem}
                onUpdateItem={onUpdateItem}
              />
            )}
          </div>

          <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
            <button
              onClick={handleSave}
              disabled={Object.keys(pendingChanges).length === 0}
              className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
            >
              Alterar
            </button>
          </div>
        </div>
      </EditableModal>
    </div>
  );
}
