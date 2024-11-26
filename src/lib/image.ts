interface ConvertedImage {
  name: string;
  type: string;
  size: number;
  base64: string;
  originalSize: number;
}

interface Base64ToFileOptions {
  fileName?: string;
  fileType?: string;
  lastModified?: number;
}

// Define a type for the base64 string result
type Base64String = string;

/**
 * Reads a file and converts it to a base64 string
 */
const readFileAsBase64 = (file: File): Promise<Base64String> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      // Assert the type since we know readAsDataURL returns a string
      const result = event.target.result as Base64String;
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Converts a base64 string to a Uint8Array
 */
const base64ToUint8Array = (base64: Base64String): Uint8Array => {
  const base64String = base64.replace(/^data:image\/\w+;base64,/, "");
  const binaryString = window.atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

/**
 * Converts a WebP base64 string to a File object
 */
const webpBase64ToFile = (
  base64: Base64String,
  options: Base64ToFileOptions = {},
): File => {
  const {
    fileName = "image.webp",
    fileType = "image/webp",
    lastModified = Date.now(),
  } = options;

  const uint8Array = base64ToUint8Array(base64);
  const blob = new Blob([uint8Array], { type: fileType });

  return new File([blob], fileName, {
    type: fileType,
    lastModified,
  });
};

/**
 * Converts multiple WebP base64 strings to File objects
 */
const webpBase64ArrayToFiles = (
  base64Array: Base64String[],
  options: Base64ToFileOptions = {},
): File[] => {
  return base64Array.map((base64, index) => {
    const fileName = options.fileName
      ? `${options.fileName}_${index + 1}.webp`
      : `image_${index + 1}.webp`;

    return webpBase64ToFile(base64, {
      ...options,
      fileName,
    });
  });
};

interface ImageConversionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  fileName?: string;
  fileType?: string;
  maintainAspectRatio?: boolean;
}

const DEFAULT_OPTIONS: ImageConversionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.6,
  maintainAspectRatio: true,
};

/**
 * Calculates new dimensions while maintaining aspect ratio
 */
const calculateAspectRatioDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } => {
  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = (originalHeight * maxWidth) / originalWidth;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newWidth * maxHeight) / newHeight;
  }

  return {
    width: Math.floor(newWidth),
    height: Math.floor(newHeight),
  };
};

/**
 * Converts a file to WebP format with compression and optional resizing
 */
export const convertToWebP = (
  file: File,
  options: ImageConversionOptions = {},
): Promise<ConvertedImage> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }

      img.src = e.target.result as string;
      img.onload = function () {
        const canvas = document.createElement("canvas");

        // Calculate new dimensions
        let { width, height } = img;
        if (
          finalOptions.maintainAspectRatio &&
          finalOptions.maxWidth &&
          finalOptions.maxHeight
        ) {
          const newDimensions = calculateAspectRatioDimensions(
            width,
            height,
            finalOptions.maxWidth,
            finalOptions.maxHeight,
          );
          width = newDimensions.width;
          height = newDimensions.height;
        } else {
          width = finalOptions.maxWidth ?? width;
          height = finalOptions.maxHeight ?? height;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const webpReader = new FileReader();
              webpReader.readAsDataURL(blob);
              webpReader.onloadend = () => {
                if (!webpReader.result) {
                  reject(new Error("Failed to convert to base64"));
                  return;
                }

                const result: ConvertedImage = {
                  name:
                    options.fileName ?? file.name.replace(/\.[^/.]+$/, ".webp"),
                  type: "image/webp",
                  size: blob.size,
                  base64: webpReader.result as string,
                  originalSize: file.size,
                };
                resolve(result);
              };

              webpReader.onerror = () => {
                reject(new Error("Failed to read WebP blob"));
              };
            } else {
              reject(new Error("WebP conversion failed"));
            }
          },
          "image/webp",
          finalOptions.quality,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Batch converts multiple files to optimized WebP format
 */
export const convertMultipleToWebP = async (
  files: File[],
  options: ImageConversionOptions = {},
): Promise<ConvertedImage[]> => {
  try {
    const conversions = files.map((file, index) =>
      convertToWebP(file, {
        ...options,
        fileName: options.fileName
          ? `${options.fileName}_${index + 1}.webp`
          : undefined,
      }),
    );
    return await Promise.all(conversions);
  } catch (error) {
    console.error("Error converting files to WebP:", error);
    throw error;
  }
};

/**
 * Converts a single file to base64
 */
const getBase64 = async (file: File): Promise<Base64String> => {
  try {
    const base64 = await readFileAsBase64(file);
    return base64;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw error;
  }
};

/**
 * Converts multiple files to base64
 */
const getBase64Array = async (files: File[]): Promise<Base64String[]> => {
  if (!files?.length) return [];

  try {
    const base64Array = await Promise.all(
      files.map((file) => readFileAsBase64(file)),
    );
    return base64Array;
  } catch (error) {
    console.error("Error converting files to base64:", error);
    throw error;
  }
};

async function urlToFile(
  url: string,
  fileName: string,
  mimeType: string,
): Promise<File> {
  // Fetch the image data
  const response = await fetch(url);
  const blob = await response.blob(); // Convert response to blob

  // Create a File from the blob
  return new File([blob], fileName, { type: mimeType });
}

export {
  getBase64,
  getBase64Array,
  readFileAsBase64,
  urlToFile,
  webpBase64ArrayToFiles,
  webpBase64ToFile,
  type Base64String,
  type Base64ToFileOptions,
  type ConvertedImage,
};
