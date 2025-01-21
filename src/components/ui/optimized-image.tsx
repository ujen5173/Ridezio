"use client";

import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "./skeleton";

export function OptimizedImage({
  alt,
  src,
  className,
  style,
}: {
  alt: string;
  src: string;
  style?: Record<string, string>;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && <Skeleton className="absolute inset-0 animate-pulse" />}
      <CldImage
        width="1200"
        height="700"
        onLoad={() => setIsLoading(false)}
        src={src}
        alt={alt}
        {...style}
        className={cn(
          "transition-opacity duration-100",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
      />
    </div>
  );
}
