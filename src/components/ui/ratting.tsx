import { Star } from "lucide-react";
import React, { useState } from "react";
import { cn } from "~/lib/utils";

interface RatingProps {
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg"; // Optional size variants
}

const Rating: React.FC<RatingProps> = ({
  defaultValue = 0,
  max = 5,
  onChange,
  size = "md",
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState(defaultValue);

  const handleHover = (value: number | null) => setHovered(value);
  const handleClick = (value: number) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  const sizeClasses = {
    sm: "h-4 w-4 text-sm",
    md: "h-6 w-6 text-base",
    lg: "h-8 w-8 text-lg",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, index) => {
        const value = index + 1;
        const isActive = hovered ? value <= hovered : value <= selected;

        return (
          <button
            key={value}
            type="button"
            className={cn(
              "rounded-full transition-colors duration-200",
              sizeClasses[size],
              isActive
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-100 text-slate-300",
            )}
            onMouseEnter={() => handleHover(value)}
            onMouseLeave={() => handleHover(null)}
            onClick={() => handleClick(value)}
            aria-label={`Rate ${value}`}
          >
            <Star
              className={cn(sizeClasses[size], "fill-inherit text-inherit")}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
