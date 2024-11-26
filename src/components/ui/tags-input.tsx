"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type InputTagsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          `items-normal flex min-h-12 w-full flex-row flex-wrap rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className,
        )}
      >
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2">
            {value.map((item) => (
              <span
                key={item}
                className={cn(
                  "inline-flex items-center rounded-sm border px-2 text-sm transition-all",
                  "text-tertbg-slate-100-foreground bg-slate-100 hover:bg-slate-100/80 disabled:cursor-not-allowed disabled:opacity-50",
                  "h-8 text-sm",
                )}
              >
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-3 w-3"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <XIcon className="w-3" />
                </Button>
              </span>
            ))}
          </div>
        )}
        <div className="min-w-32 flex-1">
          <input
            className="h-full min-h-10 w-full flex-1 border-0 bg-transparent p-2 outline-none ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addPendingDataPoint();
              } else if (
                e.key === "Backspace" &&
                pendingDataPoint.length === 0 &&
                value.length > 0
              ) {
                e.preventDefault();
                onChange(value.slice(0, -1));
              }
            }}
            {...props}
            ref={ref}
          />
        </div>
      </div>
    );
  },
);

InputTags.displayName = "InputTags";

export { InputTags };
