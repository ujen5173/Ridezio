import * as React from "react";
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types";
import { type OurFileRouter } from "~/app/api/uploadthing/core";
import { uploadFiles } from "~/lib/uploadthing";

export type UploadedFileType = {
  name: string;
  size: number;
  key: string;
  url: string;
};

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<AnyFileRoute>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFile?: UploadedFileType;
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFile, ...props }: UseUploadFileProps,
) {
  const [uploadedFile, setUploadedFile] = React.useState<
    UploadedFileType[] | undefined
  >([defaultUploadedFile].filter(Boolean) as UploadedFileType[]);
  const [progresses, setProgresses] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadThings = async (files: File[]) => {
    setIsUploading(true);

    try {
      setUploadedFile(undefined);

      const res = await uploadFiles(endpoint, {
        ...props,
        files: files,
        onUploadProgress: ({ progress }) => {
          if (progress >= 0 && progress <= 100) {
            setProgresses(progress);
          }
        },
      });

      setUploadedFile(res);
      setProgresses(0);
    } finally {
      setIsUploading(false);
      setProgresses(0);
    }
  };

  return {
    uploadedFile,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
