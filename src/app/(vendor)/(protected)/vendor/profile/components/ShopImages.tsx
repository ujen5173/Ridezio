"use client";
import { useState } from "react";
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

  const { uploadFiles, uploadedFile, isUploading } = useUploadFile(
    "imageUploader",
    {},
  );

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
