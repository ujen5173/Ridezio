// TODO: Dont Re-upload the already uploaded file. Need to fix this asap.

"use client";

import { type DropzoneOptions } from "react-dropzone";
import { toast } from "~/hooks/use-toast";
import { convertMultipleToWebP, webpBase64ToFile } from "~/lib/image";
// import { type UploadedFile } from "~/types";

export const defaultDropzone = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  multiple: true,
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024,
} satisfies DropzoneOptions;

const fileuploaderFunc = async ({
  files,
  setFiles,
  cb,
}: {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  cb: (files: File[]) => void;
}) => {
  if (!files) {
    toast({
      title: "No files to upload",
      variant: "destructive",
    });
    return;
  }
  setFiles(files);
  try {
    const convertedImages = await convertMultipleToWebP(files, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.6,
    });

    // Convert the compressed images back to Files for upload
    const optimizedFiles = convertedImages.map((img) =>
      webpBase64ToFile(img.base64, {
        fileName: img.name,
        fileType: img.type,
      }),
    );

    void cb(optimizedFiles);
  } catch (error) {
    toast({
      title: "Error processing images",
      variant: "destructive",
    });
  }
};

const FileUploaderWrapper = ({
  dropzone = defaultDropzone,
  files,
  setFiles,
  onFileUpload,
  // uploadedFile,
  isUploading,
  progresses,
}: {
  dropzone?: DropzoneOptions;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  onFileUpload: (files: File[]) => void;
  // uploadedFile: UploadedFile[] | undefined;
  isUploading: boolean;
  progresses: number;
}) => {
  return null;
  // <FileUploader
  //   value={files}
  //   onValueChange={(e) =>
  //     fileuploaderFunc({ files: e, setFiles, cb: onFileUpload })
  //   }
  //   dropzoneOptions={dropzone}
  // >
  //   <FileInput>
  //     <div className="flex h-72 w-full flex-col items-center justify-center rounded-md border bg-background hover:bg-slate-100">
  //       <p className="font-medium text-gray-700">Drop files here</p>
  //       <p className="text-xs italic text-gray-600">
  //         (Max {dropzone.maxFiles} files, {dropzone.maxSize} each)
  //       </p>
  //       <p className="text-xs italic text-gray-600">
  //         Accepted types: {dropzone.accept?.["image/*"]?.join(", ")}
  //       </p>
  //     </div>
  //   </FileInput>
  //   <FileUploaderContent className="flex flex-row items-end gap-2">
  //     {files?.map((file, i) => (
  //       <FileUploaderItem
  //         key={i}
  //         removeFile={!((uploadedFile ?? []).length > 0)}
  //         index={i}
  //         disabled={isUploading}
  //         className="size-20 overflow-hidden rounded-md p-0"
  //         aria-roledescription={`file ${i + 1} containing ${file.name}`}
  //       >
  //         {isUploading && (
  //           <div className="absolute inset-0 bg-slate-900/20">
  //             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
  //               <Loader className="animate-spin text-white duration-1500" />
  //             </div>
  //           </div>
  //         )}
  //         <Image
  //           src={URL.createObjectURL(file)}
  //           alt={file.name}
  //           height={80}
  //           width={80}
  //           className="w-20 object-cover p-0"
  //         />
  //       </FileUploaderItem>
  //     ))}

  //     {(files ?? []).length > 0 && (
  //       <span
  //         className={cn(
  //           "gap-2",
  //           buttonVariants({
  //             variant: "outline",
  //             size: "sm",
  //           }),
  //         )}
  //       >
  //         {isUploading && <Loader className="animate-spin" size={15} />}
  //         <label className="inline-block">
  //           {isUploading ? `Uploading ${progresses}%` : "Upload"}
  //         </label>
  //       </span>
  //     )}
  //   </FileUploaderContent>
  // </FileUploader>
};

export default FileUploaderWrapper;
