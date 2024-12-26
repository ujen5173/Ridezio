"use client";

import { Clock } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { TimePickerInput } from "./time-picker-input";

const TimePicker = ({ label }: { label: "starting_date" | "ending_date" }) => {
  const form = useFormContext();
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  form?.watch(label);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={form?.getValues(label) as Date}
          setDate={(newDate) => {
            form?.setValue(label, newDate ?? new Date());
          }}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={form?.getValues(label) as Date}
          setDate={(newDate) => form?.setValue(label, newDate ?? new Date())}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
};

export default TimePicker;
