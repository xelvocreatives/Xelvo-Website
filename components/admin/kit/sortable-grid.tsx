"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string };

/**
 * A grid the owner can rearrange by dragging the grip on each card (mouse or
 * finger), or with the keyboard: focus the grip, Space to lift, arrows to
 * move, Space to drop.
 */
export function SortableGrid<T extends Item>({
  items,
  onReorder,
  renderItem,
  itemLabel,
  className,
}: {
  items: T[];
  onReorder: (next: T[]) => void;
  renderItem: (item: T, handle: React.ReactNode, index: number) => React.ReactNode;
  itemLabel: (item: T) => string;
  className?: string;
}) {
  const sensors = useSensors(
    // A small move threshold keeps taps and clicks on the grip from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const labelOf = (id: unknown) => {
    const item = items.find((i) => i.id === id);
    return item ? itemLabel(item) : "item";
  };
  const position = (id: unknown) => items.findIndex((i) => i.id === id) + 1;

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "To move this card, press Space. Use the arrow keys to choose a new place, then press Space again to drop it, or Escape to cancel.",
        },
        announcements: {
          onDragStart: ({ active }) => `Picked up ${labelOf(active.id)}.`,
          onDragOver: ({ active, over }) =>
            over ? `${labelOf(active.id)} is now at position ${position(over.id)} of ${items.length}.` : undefined,
          onDragEnd: ({ active, over }) =>
            over ? `${labelOf(active.id)} moved to position ${position(over.id)}.` : `${labelOf(active.id)} dropped.`,
          onDragCancel: ({ active }) => `Moving ${labelOf(active.id)} was cancelled.`,
        },
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <ul className={className}>
          {items.map((item, index) => (
            <SortableCell key={item.id} id={item.id} label={itemLabel(item)}>
              {(handle) => renderItem(item, handle, index)}
            </SortableCell>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableCell({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: (handle: React.ReactNode) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Drag to reorder ${label}`}
      aria-roledescription="sortable"
      className={cn(
        "flex size-9 touch-none items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <GripVertical className="size-4" aria-hidden />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "relative",
        isDragging &&
          "z-20 scale-[1.02] opacity-95 shadow-[0_24px_50px_-16px_rgb(0_0_0/0.9)] [&>*]:ring-2 [&>*]:ring-xa-ink/40",
      )}
    >
      {children(handle)}
    </li>
  );
}

/** Small instruction line shown above a sortable grid. */
export function ReorderHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-[13px] text-xa-muted">
      <GripVertical className="size-3.5" aria-hidden />
      {children}
    </p>
  );
}
