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
import { Button } from "~/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "~/components/ui/file-uploader";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type CloudinaryResponse } from "~/hooks/useCloudinaryUpload";
import { convertMultipleToWebP, webpBase64ArrayToFiles } from "~/lib/image";
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
    "image/*": [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".bmp",
      ".tiff",
      ".tif",
      ".avif",
      ".heic",
      ".heif",
    ],
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
  uploadedFiles,
  isUploading,
  images,
  form,
}: {
  dropzone?: DropzoneOptions;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  onFileUpload: (files: File[]) => void;
  uploadedFiles: CloudinaryResponse[];
  isUploading: boolean;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  form: UseFormReturn<z.infer<typeof imageSchema>>;
}) => {
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [localImages, setLocalImages] = useState<
    {
      id: string;
      url: string;
      order: number;
    }[]
  >(images);

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
    if (uploadedFiles && uploadedFiles.length > 0) {
      const processedIds = new Set(uploadedFileIds);
      const existingUrls = new Set(localImages.map((img) => img.url));

      const newUploads = uploadedFiles.filter(
        (file) =>
          !processedIds.has(file.public_id) &&
          !existingUrls.has(file.secure_url),
      );

      if (newUploads.length > 0) {
        const newImages = newUploads.map((file, idx) => ({
          id: file.public_id,
          order: localImages.length + idx + 1,
          url: file.secure_url,
        }));

        const updatedImages = [...localImages, ...newImages];

        setLocalImages(updatedImages);
        setUploadedFileIds((prev) => [
          ...prev,
          ...newUploads.map((file) => file.public_id),
        ]);

        form.setValue("images", updatedImages, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [uploadedFiles, form, uploadedFileIds, localImages]);

  const imageIds = useMemo(
    () => localImages.map((img) => img.id),
    [localImages],
  );

  const handleRemoveFile = (index: number) => {
    if (!setFiles) return;

    setFiles((prevFiles) => {
      if (prevFiles) {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      }
      return prevFiles;
    });

    const updatedLocalImages = localImages.filter((_, idx) => idx !== index);

    setLocalImages(updatedLocalImages);
    form.setValue("images", updatedLocalImages, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <FileUploader
      value={files}
      dropzoneOptions={dropzone}
      onValueChange={async (newFiles) => {
        // Only pass truly new files that haven't been uploaded yet
        const actualNewFiles = newFiles?.filter(
          (newFile) =>
            !files?.some((existingFile) => existingFile.name === newFile.name),
        );

        if (!actualNewFiles) return;

        const convertedToWebp = await convertMultipleToWebP(actualNewFiles);
        const webpToFile = webpBase64ArrayToFiles(
          convertedToWebp.map((e) => e.base64),
        );

        if (webpToFile?.length) {
          setFiles(webpToFile);
          onFileUpload(webpToFile);
        }
      }}
    >
      <FileInput>
        {localImages.length > 0 && dropzone.maxFiles === 1 ? (
          <div
            className="relative mb-4 flex h-72 w-full cursor-default flex-col items-center justify-center rounded-md border bg-background hover:bg-slate-100"
            style={{
              backgroundImage: `url('${localImages[0]!.url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-2 right-2">
              <Button
                type="button"
                onClick={() => {
                  setLocalImages([]);
                  setFiles([]);
                  form.setValue("images", [], {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                variant="outline"
                size="sm"
              >
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex h-72 w-full flex-col items-center justify-center rounded-md border bg-background hover:bg-slate-100">
            {isUploading ? (
              <p className="flex items-center gap-2 font-medium text-gray-700">
                <Loader className="text-primary-500 animate-spin" />
                <span>Uploading...</span>
              </p>
            ) : (
              <>
                <p className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  Drop files here
                </p>
                <span className="block text-center text-base font-medium italic text-gray-500">
                  Upload clear and high-quality images to showcase your store.
                  <br />
                  (Recommended size: 1200x700)
                </span>
              </>
            )}
          </div>
        )}
      </FileInput>
      {dropzone.maxFiles === 1 ? null : (
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
              <ScrollArea className="w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <ScrollBar orientation="horizontal" />

                  {localImages.map((image, index) => (
                    <div key={image.id + index} className="relative h-24 w-32">
                      <ImageDragItem
                        id={image.id}
                        file={image.url}
                        index={index}
                        handleRemoveFile={handleRemoveFile}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SortableContext>
          </DndContext>
        </FileUploaderContent>
      )}
    </FileUploader>
  );
};

export default FileUploaderWrapper;
