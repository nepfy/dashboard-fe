"use client";

import { useRef } from "react";
import Image from "next/image";
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
import type { Client } from "#/types/template-data";
import GrabIcon from "#/components/icons/GrabIcon";

interface OrganizeTabProps {
  items: Client[];
  onUpdate: (data: { reorderedItems: Client[] }) => void;
  onDeleteItem: (itemId: string) => void;
}

interface SortableItemProps {
  item: Client;
  onDeleteItem: (itemId: string) => void;
}

function SortableItem({ item, onDeleteItem }: SortableItemProps) {
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
      className="flex items-stretch gap-3 rounded-lg"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="hover:bg-white-neutral-light-300 flex min-h-[112px] w-10 cursor-grab items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA] active:cursor-grabbing"
      >
        <div className="scale-100">
          <GrabIcon />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 rounded-[10px] border border-[#E0E3E9] bg-white px-3 py-2">
        {item.logo ? (
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={item.logo}
              alt={item.name || "Client logo"}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : null}
        <div className="flex-1 text-left font-medium text-[#161616]">
          {item.name || "Cliente sem nome"}
        </div>
      </div>

      {/* Delete Button */}
      <div className="hover:bg-white-neutral-light-300 flex h-10 w-10 cursor-pointer items-center justify-center self-center rounded border border-[#DBDDDF] bg-[#F6F8FA]">
        <button
          onClick={() => onDeleteItem(item.id!)}
          className="cursor-pointer rounded p-2 text-[#D00003]"
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
  items,
  onUpdate,
  onDeleteItem,
}: OrganizeTabProps) {
  const isUserDragging = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    isUserDragging.current = true;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      // Update sortOrder values to match the new order
      const reorderedItemsWithSortOrder = reorderedItems.map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      }));

      onUpdate({ reorderedItems: reorderedItemsWithSortOrder });
    }

    setTimeout(() => {
      isUserDragging.current = false;
    }, 100);
  };

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Nenhum item para organizar
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 pb-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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
              onDeleteItem={onDeleteItem}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
