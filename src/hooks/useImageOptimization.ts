import { useEffect, useState } from "react";

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "avif";
}

export const useImageOptimization = (
  imageUrl: string,
  options: ImageOptimizationOptions = {},
) => {
  const [optimizedUrl, setOptimizedUrl] = useState(imageUrl);

  useEffect(() => {
    const optimizeImage = () => {
      const url = new URL(imageUrl);

      // Add quality parameter
      if (options.quality) {
        url.searchParams.set("q", options.quality.toString());
      }

      // Add width parameter
      if (options.maxWidth) {
        url.searchParams.set("w", options.maxWidth.toString());
      }

      // Add height parameter
      if (options.maxHeight) {
        url.searchParams.set("h", options.maxHeight.toString());
      }

      // Add format parameter
      if (options.format) {
        url.searchParams.set("fm", options.format);
      }

      setOptimizedUrl(url.toString());
    };

    optimizeImage();
  }, [imageUrl, options]);

  return optimizedUrl;
};
