"use client";

import { TeamMember, Result, StepTopic, AboutUsItem, IntroductionService } from "#/types/template-data";

interface ItemSelectorProps {
  items: (TeamMember | Result | StepTopic | AboutUsItem | IntroductionService)[];
  selectedItemId: string | null;
  onItemSelect: (itemId: string) => void;
  onAddItem: () => void;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq" | "aboutUs" | "introServices";
}

export default function ItemSelector({
  items,
  selectedItemId,
  onItemSelect,
  onAddItem,
  itemType,
}: ItemSelectorProps) {
  const sortedItems = [...items].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  // Define maximum items per section type
  const maxItems =
    itemType === "steps" || itemType === "faq" ? 10 :
    itemType === "expertise" ? 9 :
    6; // team, results, testimonials

  return (
    <div className="mb-6 flex flex-shrink-0 flex-wrap gap-2">
      {sortedItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemSelect(item.id!)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors ${
            selectedItemId === item.id
              ? "border-primary-light-400 bg-primary-light-10 text-primary-light-400"
              : "border-white-neutral-light-300 text-white-neutral-light-500 bg-white-neutral-light-200 hover:border-text-white-neutral-light-400"
          }`}
        >
          {index + 1}
        </button>
      ))}
      {items.length < maxItems && (
        <button
          onClick={onAddItem}
          className="border-white-neutral-light-300 text-white-neutral-light-700 hover:border-white-neutral-light-400 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-dashed text-[24px] font-light transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
}
