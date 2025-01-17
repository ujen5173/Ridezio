import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "./skeleton";

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  showSkeleton?: boolean;
}

export function OptimizedImage({
  alt,
  src,
  className,
  showSkeleton = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 animate-pulse" />
      )}
      <Image
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        priority
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
