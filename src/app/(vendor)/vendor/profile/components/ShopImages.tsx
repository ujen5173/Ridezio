"use client";
import { useEffect, useState } from "react";
import FileUploaderWrapper from "~/app/_components/_/FileUploaderWrapper";
import { Label } from "~/components/ui/label";
import { useUploadFile } from "~/hooks/useUploadthing";
import useBusinessFormContext from "../hooks/useBusinessFormContext";

const ShopImages = () => {
  const { form, business } = useBusinessFormContext();

  const [files, setFiles] = useState<File[] | null>([]);

  const { uploadFiles, progresses, uploadedFile, isUploading } = useUploadFile(
    "imageUploader",
    {},
  );

  useEffect(() => {
    if (uploadedFile && uploadedFile.length > 0) {
      form.setValue(
        "images",
        uploadedFile.map((e) => e.url),
      );
    }
  }, [uploadedFile]);

  return (
    <div className="space-y-6">
      <div className="">
        <Label>Shop Images</Label>
        <p className="text-xs italic text-slate-600">
          (Upload your shop images that will be displayed on your store)
        </p>
      </div>

      <div className="flex items-center gap-2">
        {business.images.map((image, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="size-28 rounded-md border border-slate-200 bg-slate-100"
            ></div>
          </div>
        ))}
      </div>

      <FileUploaderWrapper
        files={files}
        onFileUpload={uploadFiles}
        setFiles={setFiles}
        uploadedFile={uploadedFile}
        isUploading={isUploading}
        progresses={progresses}
      />
    </div>
  );
};

export default ShopImages;
