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
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type DropzoneOptions } from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "~/components/ui/file-uploader";
import { type UploadedFileType } from "~/hooks/useUploadthing";
import ImageDragItem from "./ImageDragItem";

export const imageSchema = z.object({
  images: z
    .object({
      id: z.string(),
      url: z.string().url(),
      order: z.number(),
    })
    .array(),
});

export const defaultDropzone = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  multiple: true,
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024,
} satisfies DropzoneOptions;

const FileUploaderWrapper = ({
  dropzone = defaultDropzone,
  files,
  setFiles,
  onFileUpload,
  uploadedFile,
  isUploading,
  images,
  form,
}: {
  dropzone?: DropzoneOptions;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  onFileUpload: (files: File[]) => void;
  uploadedFile: UploadedFileType[] | undefined;
  isUploading: boolean;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  form: UseFormReturn<z.infer<typeof imageSchema>>;
}) => {
  const [localImages, setLocalImages] = useState<
    {
      id: string;
      url: string;
      order: number;
    }[]
  >(images);

  const [processedUploadKeys, setProcessedUploadKeys] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localImages.findIndex((img) => img.id === active.id);
      const newIndex = localImages.findIndex((img) => img.id === over.id);

      const reorderedImages = arrayMove(localImages, oldIndex, newIndex);

      const updatedImages = reorderedImages.map((img, index) => ({
        ...img,
        order: index + 1,
      }));

      setLocalImages(updatedImages);
      form.setValue("images", updatedImages, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  useEffect(() => {
    if (uploadedFile && uploadedFile.length > 0) {
      // Filter out already uploaded and processed images
      const newUniqueUploads = uploadedFile.filter(
        (newFile) =>
          !localImages.some((existingImg) => existingImg.url === newFile.url) &&
          !processedUploadKeys.includes(newFile.key),
      );

      if (newUniqueUploads.length > 0) {
        const newUploadedImages = newUniqueUploads.map((e, idx) => ({
          id: e.key,
          order: localImages.length + idx + 1,
          url: e.url,
        }));

        const updatedImages = [...localImages, ...newUploadedImages];

        // Use Set to ensure unique URLs before setting state
        const uniqueImages = Array.from(
          new Map(updatedImages.map((img) => [img.url, img])).values(),
        );

        // Track processed upload keys to prevent re-processing
        const newProcessedKeys = [
          ...processedUploadKeys,
          ...newUniqueUploads.map((file) => file.key),
        ];

        setProcessedUploadKeys(newProcessedKeys);
        setLocalImages(uniqueImages);
        form.setValue("images", uniqueImages, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [uploadedFile, form, processedUploadKeys]);

  const imageIds = useMemo(
    () => localImages.map((img) => img.id),
    [localImages],
  );

  return (
    <FileUploader
      value={files}
      dropzoneOptions={dropzone}
      onValueChange={(newFiles) => {
        setFiles(newFiles);
        if (newFiles) {
          onFileUpload(newFiles);
        }
      }}
    >
      <FileInput>
        <div className="mb-4 flex h-72 w-full flex-col items-center justify-center rounded-md border bg-background hover:bg-slate-100">
          <p className="flex items-center gap-2 font-medium text-gray-700">
            {isUploading ? (
              <>
                <Loader className="text-primary-500 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              "Drop files here"
            )}
          </p>
        </div>
      </FileInput>
      <FileUploaderContent className="flex flex-row items-center space-x-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={imageIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center gap-2">
              {localImages.map((image, index) => (
                <div key={image.id} className="relative h-28 w-32">
                  <ImageDragItem id={image.id} file={image.url} index={index} />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </FileUploaderContent>
    </FileUploader>
  );
};

export default FileUploaderWrapper;
