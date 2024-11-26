import { type UseUploadthingProps } from "@uploadthing/react";
import * as React from "react";
import { type OurFileRouter } from "~/app/api/uploadthing/core";
import { useUploadThing } from "~/lib/uploadthing";

type UseUploadThingyProps = Partial<
  UseUploadthingProps<OurFileRouter[keyof OurFileRouter]>
>;

export function useUploadThingy(
  endpoint: keyof OurFileRouter,
  props: UseUploadThingyProps = {},
) {
  const [progress, setProgress] = React.useState(0);
  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => {
      setProgress(p);
    },
    ...props,
  });

  return {
    startUpload,
    isUploading,
    progress,
  };
}
