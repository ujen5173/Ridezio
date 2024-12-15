"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const ImageDragItem = ({
  file,
  id,
  index,
}: {
  file: string;
  id: string;
  index: number;
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
      className={cn(
        isCursorGrabbing ? "cursor-grabbing" : "cursor-grab",
        "group relative h-full w-full",
      )}
      {...attributes}
      {...listeners}
    >
      <Skeleton className="absolute inset-0" />
      <Image
        src={file}
        alt={`Image ${index + 1}`}
        fill
        className="aspect-[16/13] h-full w-full rounded-md object-contain"
      />
    </div>
  );
};

export default ImageDragItem;
