import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileCount: 10, maxFileSize: "4MB" },
  }).onUploadComplete(() => ({
    sucess: true,
  })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
