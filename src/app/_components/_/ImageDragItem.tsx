"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { OptimizedImage } from "~/components/ui/optimized-image";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const ImageDragItem = ({
  file,
  id,
  index,
  handleRemoveFile,
}: {
  file: string;
  id: string;
  index: number;
  handleRemoveFile: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative h-full w-full"
    >
      <button
        type="button"
        onClick={() => {
          handleRemoveFile(index);
        }}
        className="absolute right-1 top-1 z-20 rounded-sm border border-slate-200/70 bg-slate-200/70 p-1 shadow-sm"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>
      <div
        className={cn(
          isCursorGrabbing ? "cursor-grabbing" : "cursor-grab",
          "group relative h-full w-full",
        )}
        {...listeners}
      >
        <Skeleton className="absolute inset-0" />
        <OptimizedImage
          src={file}
          alt={`Image ${index + 1}`}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default ImageDragItem;
