"use client";

import { TeamMember, Result } from "#/types/template-data";

interface ItemSelectorProps {
  items: (TeamMember | Result)[];
  selectedItemId: string | null;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
}

export default function ItemSelector({
  items,
  selectedItemId,
  onItemSelect,
  onAddItem,
}: ItemSelectorProps) {
  const sortedItems = [...items].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <div className="mb-6 flex flex-shrink-0 gap-2">
      {sortedItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemSelect(item.id!)}
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
          onClick={onAddItem}
          className="border-white-neutral-light-300 text-white-neutral-light-700 hover:border-white-neutral-light-400 flex h-8 w-8 items-center justify-center rounded-[8px] border border-dashed text-[24px] font-light transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
}
