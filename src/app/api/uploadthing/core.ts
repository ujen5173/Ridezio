import { createUploadthing } from "uploadthing/next";
import { type FileRouter } from "uploadthing/types";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileCount: 10, maxFileSize: "4MB" },
  })
    .middleware(() => ({}))
    .onUploadComplete(() => ({ success: true })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
