"use client";

import { useState } from "react";

export type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
};

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<CloudinaryResponse[]>([]);

  const uploadToCloudinary = async (files: File[]) => {
    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        return (await response.json()) as CloudinaryResponse;
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(results);
      return results;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadToCloudinary,
    uploadedFiles,
    isUploading,
  };
}
