"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type formSchema } from "../BusinessProfile";
import DragItem from "./DragItem";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export default function CreateFAQs() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const [isOpen, setIsOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  // Watch the faqs field for changes
  const faqs = form.watch("faqs", []);

  // Get sorted FAQs using useMemo with the watched value
  const sortedFaqs = useMemo(() => {
    return [...faqs].sort((a, b) => a.order - b.order);
  }, [faqs]);

  // Create an array of just the IDs for the SortableContext
  const itemIds = useMemo(() => sortedFaqs.map((faq) => faq.id), [sortedFaqs]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    const currentFaqs = faqs;
    const newOrder = Math.max(...currentFaqs.map((faq) => faq.order), 0) + 1;

    const updatedFAQs = [
      ...currentFaqs,
      {
        id: newId,
        question: newFaq.question,
        answer: newFaq.answer,
        order: newOrder,
      },
    ];

    form.setValue("faqs", updatedFAQs, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setNewFaq({ question: "", answer: "" });
    setIsOpen(false);
  };

  const handleUpdate = () => {
    if (!editingFaq) return;

    const updatedFaqs = faqs.map((faq) =>
      faq.id === editingFaq.id
        ? { ...faq, question: newFaq.question, answer: newFaq.answer }
        : faq,
    );

    form.setValue("faqs", updatedFaqs, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setEditingFaq(null);
    setNewFaq({ question: "", answer: "" });
    setIsOpen(false);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = faqs.findIndex((item) => item.id === active.id);
      const newIndex = faqs.findIndex((item) => item.id === over.id);

      // First move the array items
      const reorderedFaqs = arrayMove(faqs, oldIndex, newIndex);

      // Then update the order property for all items
      const updatedFaqs = reorderedFaqs.map((faq, index) => ({
        ...faq,
        order: index + 1,
      }));

      // Update the form state
      form.setValue("faqs", updatedFaqs, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }

  return (
    <FormField
      control={form.control}
      name="faqs"
      render={({ field }) => (
        <div className="py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">FAQ Management</h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingFaq(null);
                  }}
                  variant={"secondary"}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Question
                    </label>
                    <Input
                      value={newFaq.question}
                      onChange={(e) =>
                        setNewFaq({ ...newFaq, question: e.target.value })
                      }
                      placeholder="Enter question..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Answer
                    </label>
                    <Textarea
                      value={newFaq.answer}
                      onChange={(e) =>
                        setNewFaq({ ...newFaq, answer: e.target.value })
                      }
                      placeholder="Enter answer..."
                      rows={4}
                    />
                  </div>
                  <Button
                    className="w-full"
                    variant={"primary"}
                    onClick={editingFaq ? handleUpdate : handleAdd}
                    disabled={!newFaq.question || !newFaq.answer}
                  >
                    {editingFaq ? "Update FAQ" : "Add FAQ"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAQs ({form.getValues("faqs").length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedFaqs.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[
                      restrictToVerticalAxis,
                      restrictToParentElement,
                    ]}
                  >
                    <SortableContext
                      items={itemIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {sortedFaqs.map((faq) => (
                        <DragItem
                          setEditingFaq={setEditingFaq}
                          setNewFaq={setNewFaq}
                          setIsOpen={setIsOpen}
                          key={faq.id}
                          faq={faq}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    No FAQs found. Add a new one!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    />
  );
}
