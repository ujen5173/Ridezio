"use client";

import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";

const PickupVehicle = ({
  date,
  setDate,
  setQuantity,
  handleClearDate,
  isDateSelectionDisabled,
  isDateDisabled,
  getRentalDays,
  getMaxAllowedQuantity,
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setQuantity: (quantity: number) => void;
  handleClearDate: () => void;
  isDateSelectionDisabled: boolean;
  isDateDisabled: (date: Date) => boolean;
  getRentalDays: () => number;
  getMaxAllowedQuantity: () => number;
}) => {
  const { width } = useWindowDimensions();

  return (
    <div className="space-y-2 px-1">
      <Label>Pick up Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between px-4 ${!date && "text-muted-foreground"}`}
            disabled={isDateSelectionDisabled}
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-slate-700" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
            {date && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearDate();
                }}
              >
                <X className="size-4" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            disabled={isDateDisabled}
            defaultMonth={date?.from}
            selected={date}
            showOutsideDays={false}
            onSelect={(newDate) => {
              setDate(newDate);
              setQuantity(1);
            }}
            numberOfMonths={width < 640 ? 1 : 2}
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
          />
        </PopoverContent>
      </Popover>
      {date?.from && date?.to && (
        <Alert variant="default" className="mt-2">
          <AlertTitle>Booking Period</AlertTitle>
          <AlertDescription>
            {getRentalDays()} days rental period
            {getMaxAllowedQuantity() === 0 && (
              <p className="mt-1 text-red-500">
                No vehicles available for selected dates. Please choose
                different dates.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PickupVehicle;
