import { PlanIncludedItem } from "#/types/template-data";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import GrabIcon from "#/components/icons/GrabIcon";
import { PlusIcon } from "lucide-react";

interface DeliveriesTabProps {
  includedItems: PlanIncludedItem[];
  onUpdate: (data: { reorderedItems: PlanIncludedItem[] }) => void;
  onDeleteItem: () => void;
}

interface SortableItemProps {
  item: PlanIncludedItem;
  onDeleteItem: () => void;
  isEditing: boolean;
  onChange: (value: string) => void;
  onFinish: () => void;
}
function SortableItem({
  item,
  onDeleteItem,
  onChange,
  onFinish,
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
      <div className="flex flex-1 items-center rounded border border-[#DBDDDF] bg-[#F6F8FA] px-4 py-2 font-medium text-[#161616]">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onFinish}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-full bg-transparent outline-none"
          placeholder="Descreva a entrega"
        />
      </div>

      {/* Delete Button */}
      <div className="hover:bg-white-neutral-light-300 flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[#DBDDDF] bg-[#F6F8FA]">
        <button
          onClick={() => onDeleteItem()}
          className="cursor-pointer rounded p-1 text-[#D00003]"
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

export default function DeliveriesTab({
  includedItems,
  onUpdate,
}: DeliveriesTabProps) {
  const isUserDragging = useRef(false);
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());

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
      const oldIndex = includedItems.findIndex((item) => item.id === active.id);
      const newIndex = includedItems.findIndex((item) => item.id === over.id);

      const reorderedIncludedItems = arrayMove(
        includedItems,
        oldIndex,
        newIndex
      );

      // Update sortOrder values to match the new order
      const reorderedIncludedItemsWithSortOrder = reorderedIncludedItems.map(
        (item, index) => ({
          ...item,
          sortOrder: index,
        })
      );

      onUpdate({ reorderedItems: reorderedIncludedItemsWithSortOrder });
    }

    setTimeout(() => {
      isUserDragging.current = false;
    }, 100);
  };

  const handleAddIncludedItem = () => {
    if (includedItems.length >= 6) return;
    const newItem: PlanIncludedItem = {
      id: `included-${Date.now()}`,
      description: "",
      hideDescription: false,
      sortOrder: includedItems.length,
      hideItem: false,
    } as PlanIncludedItem;

    const nextItems = [...includedItems, newItem];
    onUpdate({ reorderedItems: nextItems });

    setEditingIds((prev) => new Set(prev).add(newItem.id));
  };

  if (includedItems.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center text-gray-500">
        Nenhum item para organizar
        {includedItems.length < 6 && (
          <button
            onClick={handleAddIncludedItem}
            disabled={includedItems.length >= 6}
            className="text-white-neutral-light-900 hover:text-white-neutral-light-700 flex w-full transform cursor-pointer items-center justify-center gap-1 py-4 text-sm font-medium"
          >
            <PlusIcon className="h-3 w-3" /> Adicionar entrega
          </button>
        )}
      </div>
    );
  }

  const handleDeleteIncludedItem = (id: string) => {
    const next = includedItems
      .filter((it) => it.id !== id)
      .map((item, index) => ({ ...item, sortOrder: index }));
    onUpdate({ reorderedItems: next });
  };

  return (
    <div className="mt-4 h-[72%] space-y-3 overflow-y-auto">
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={includedItems.map((item) => item.id!)}
            strategy={verticalListSortingStrategy}
          >
            {includedItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDeleteItem={() => handleDeleteIncludedItem(item.id!)}
                isEditing={
                  editingIds.has(item.id) ||
                  (item.description || "").trim() === ""
                }
                onChange={(value) => {
                  const next = includedItems.map((it) =>
                    it.id === item.id ? { ...it, description: value } : it
                  );
                  onUpdate({ reorderedItems: next });
                }}
                onFinish={() => {
                  setEditingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                  });
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        {includedItems.length < 6 && (
          <button
            onClick={handleAddIncludedItem}
            disabled={includedItems.length >= 6}
            className="text-white-neutral-light-900 hover:text-white-neutral-light-700 flex w-full transform cursor-pointer items-center justify-center gap-1 py-4 text-sm font-medium"
          >
            <PlusIcon className="h-3 w-3" /> Adicionar entrega
          </button>
        )}
      </div>
    </div>
  );
}
