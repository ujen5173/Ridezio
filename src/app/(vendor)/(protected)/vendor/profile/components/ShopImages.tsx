"use client";
import { useCallback, useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import FileUploaderWrapper from "~/app/_components/_/FileUploaderWrapper";
import { Label } from "~/components/ui/label";
import { useUploadFile } from "~/hooks/useUploadthing";
import { type imageSchema } from "../BusinessProfile";

const ShopImages = ({
  images,
  form,
}: {
  form: UseFormReturn<z.infer<typeof imageSchema>>;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
}) => {
  const [files, setFiles] = useState<File[] | null>([]);
  const [processingUpload, setProcessingUpload] = useState(false);

  const { uploadFiles, uploadedFile, isUploading } = useUploadFile(
    "imageUploader",
    {},
  );

  const handleUploadComplete = useCallback(() => {
    if (uploadedFile && uploadedFile.length > 0 && !processingUpload) {
      setProcessingUpload(true);

      const existingImages = form.getValues("images") || [];
      const lastOrder = existingImages.reduce(
        (max, img) => Math.max(max, img.order),
        0,
      );

      const newImages = uploadedFile.map((file, index) => ({
        url: file.url,
        order: lastOrder + index + 1,
        id: file.key,
      }));

      form.setValue("images", [...existingImages, ...newImages], {
        shouldDirty: true,
      });

      // Reset files and processing state
      setFiles([]);
      setProcessingUpload(false);
    }
  }, [uploadedFile, form, processingUpload]);

  useEffect(() => {
    handleUploadComplete();
  }, [handleUploadComplete]);

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    await uploadFiles(files);
  };

  return (
    <div className="space-y-6">
      <div className="">
        <Label>Shop Images</Label>
        <p className="text-xs italic text-slate-600">
          (Upload your shop images that will be displayed on your store)
        </p>
      </div>

      <FileUploaderWrapper
        files={files}
        form={form}
        images={images}
        onFileUpload={handleFileUpload}
        setFiles={setFiles}
        uploadedFile={uploadedFile}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ShopImages;
