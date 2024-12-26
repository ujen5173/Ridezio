"use client";

import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import TimePicker from "./time-picker";

const DateTimePicker = ({
  label,
}: {
  label: "starting_date" | "ending_date";
}) => {
  const form = useFormContext();
  form?.watch(label);

  const handleSelect = (newDay: Date | undefined) => {
    const date = form?.getValues()[label] as Date;
    if (!newDay) return;
    if (!date) {
      // setDate(newDay);
      form?.setValue(label, newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    // setDate(newDateFull);
    form?.setValue(label, newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !form?.getValues(label) && "text-muted-foreground text-slate-700",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-700" />
          {form?.getValues(label) ? (
            format(
              (form?.getValues(label) as Date | undefined) ?? new Date(),
              "PPP - HH:mm",
            )
          ) : (
            <span>Pick date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={form?.getValues(label) as Date}
          onSelect={(d) => handleSelect(d)}
          initialFocus
          numberOfMonths={1}
          showOutsideDays={false}
          classNames={{
            cell: "relative w-[36px] p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            head_cell: "font-normal text-sm w-[36px]",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:rounded-sm",
              "disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed",
            ),
          }}
          disabled={(e) => {
            // disable past and today dates.if there is a starting_date, disable all dates before it. not the starting_date
            if (label === "ending_date") {
              return e < new Date();
            }
            return (
              e < new Date() || (form?.getValues("starting_date") ?? e) > e
            );
          }}
        />
        <div className="border-t border-border p-3">
          <TimePicker label={label} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
