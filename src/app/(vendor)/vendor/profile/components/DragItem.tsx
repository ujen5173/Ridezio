"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import useBusinessFormContext from "../hooks/useBusinessFormContext";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const DragItem = ({
  faq,
  setEditingFaq,
  setNewFaq,
  setIsOpen,
}: {
  faq: FAQ;
  setEditingFaq: React.Dispatch<React.SetStateAction<FAQ | null>>;
  setNewFaq: React.Dispatch<
    React.SetStateAction<{ question: string; answer: string }>
  >;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { form } = useBusinessFormContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const faqs = form.watch("faqs");

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setNewFaq({ question: faq.question, answer: faq.answer });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedFaqs = faqs
      .filter((faq) => faq.id !== id)
      .map((faq, index) => ({
        ...faq,
        order: index + 1,
      }));

    form.setValue("faqs", updatedFaqs, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: faq.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border bg-white p-4 transition-colors hover:border-secondary"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <GripVertical
            {...attributes}
            {...listeners}
            className={cn(
              isCursorGrabbing ? "cursor-grabbing" : "cursor-grab",
              "h-5 w-5 cursor-move text-gray-400 outline-none",
            )}
          />
          <div className="flex-1">
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() =>
                setExpandedId(expandedId === faq.id ? null : faq.id)
              }
            >
              <h3 className="font-medium">{faq.question}</h3>
              {expandedId === faq.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            {expandedId === faq.id && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(faq.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DragItem;
