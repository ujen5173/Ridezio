"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "./skeleton";

export function OptimizedImage({ alt, src, className, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && <Skeleton className="absolute inset-0 animate-pulse" />}
      <Image
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        priority
        src={src}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
