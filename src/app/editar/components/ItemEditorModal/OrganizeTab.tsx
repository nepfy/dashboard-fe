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
import GrabIcon from "#/components/icons/GrabIcon";

interface OrganizeTabProps {
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
  onUpdate: (data: {
    reorderedItems: (
      | TeamMember
      | Result
      | ExpertiseTopic
      | Testimonial
      | StepTopic
      | FAQItem
      | AboutUsItem
      | IntroductionService
    )[];
  }) => void;
  setShowConfirmExclusion: (show: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

interface SortableItemProps {
  item:
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
    | AboutUsItem
    | IntroductionService;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq" | "aboutUs" | "introServices";
  onDeleteItem: (itemId: string) => void;
}

function SortableItem({
  item,
  itemType,
  onDeleteItem, // Add this prop
}: SortableItemProps) {
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
        className="hover:bg-white-neutral-light-300 flex w-10 min-h-[112px] cursor-grab items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA] active:cursor-grabbing"
      >
        <div className="scale-100">
          <GrabIcon />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-stretch rounded-[10px] border border-[#E0E3E9] bg-white px-3 py-2">
        {itemType === "introServices" ? (
          <div
            className="relative w-full overflow-hidden rounded-[8px] border border-[#DBDDDF] bg-[#F6F8FA]"
            style={{ aspectRatio: "16 / 9", minHeight: "96px" }}
          >
            <Image
              src={
                (item as IntroductionService).image ||
                "/images/templates/flash/placeholder.png"
              }
              alt={(item as IntroductionService).serviceName || "Imagem"}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full text-left font-medium text-[#161616]">
            {itemType === "team"
              ? (item as TeamMember).name
              : itemType === "results"
                ? (item as Result).client
                : itemType === "expertise"
                  ? (item as ExpertiseTopic).title
                  : itemType === "steps"
                    ? (item as StepTopic).title
                    : itemType === "faq"
                      ? (item as FAQItem).question
                      : itemType === "aboutUs"
                        ? (item as AboutUsItem).caption || "Sem descrição"
                        : itemType === "introServices"
                          ? (item as IntroductionService).serviceName || "Sem nome"
                          : (item as Testimonial).name}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <div className="hover:bg-white-neutral-light-300 flex h-10 w-10 self-center cursor-pointer items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA]">
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
  itemType,
  items,
  onUpdate,
  onDeleteItem, // Add this prop
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
        sortOrder: index,
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
              itemType={itemType}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
