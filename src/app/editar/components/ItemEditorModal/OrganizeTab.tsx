"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TeamMember, Result } from "#/types/template-data";
import GrabIcon from "#/components/icons/GrabIcon";

interface OrganizeTabProps {
  itemType: "team" | "results";
  items: (TeamMember | Result)[];
  onReorder: (items: TeamMember[] | Result[]) => void;
  onDelete: (itemId: string) => void;
  onUpdateItem: (
    itemId: string,
    data: Partial<TeamMember> | Partial<Result>
  ) => void;
}

interface SortableItemProps {
  item: TeamMember | Result;
  itemType: "team" | "results";
  onDelete: (itemId: string) => void;
}

function SortableItem({ item, itemType, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="hover:bg-white-neutral-light-300 flex h-[38px] w-[32px] cursor-grab items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA] active:cursor-grabbing"
      >
        <GrabIcon />
      </div>

      {/* Name Field */}
      <div className="flex h-[38px] flex-1 items-center rounded border border-[#DBDDDF] bg-[#F6F8FA] px-4 font-medium text-[#161616]">
        {itemType === "team"
          ? (item as TeamMember).name
          : (item as Result).client}
      </div>

      {/* Delete Button */}
      <div className="hover:bg-white-neutral-light-300 flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA]">
        <button
          onClick={() => onDelete(item.id!)}
          className="rounded p-1 text-[#D00003]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function OrganizeTab({
  itemType,
  items,
  onReorder,
  onDelete,
}: OrganizeTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      onReorder(reorderedItems);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Nenhum item para organizar
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3 overflow-y-auto">
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id!)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                itemType={itemType}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
