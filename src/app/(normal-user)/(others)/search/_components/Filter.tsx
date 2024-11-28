"use client";

import { format } from "date-fns";
import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import VehicleIndicatorIcon from "~/app/_components/_/VehicleIndicatorIcon";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";
import { vehicleTypeEnum } from "~/server/db/schema";

const Filter = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const { width } = useWindowDimensions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <SlidersHorizontal size={15} className="text-slate-600" />
          <span className="ml-2">Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-max sm:min-w-[425px]">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle>Add Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle Types</Label>
            <div className="flex gap-4">
              {vehicleTypeEnum.enumValues
                .filter((e) => !e.includes("e-"))
                .map((vehicle) => (
                  <VehicleIndicatorIcon key={vehicle} vehicle={vehicle} />
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex items-center gap-4">
              <Input type="number" placeholder="Min" className="flex-1" />
              <span>to</span>
              <Input type="number" placeholder="Max" className="flex-1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Available Date</Label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex w-full flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-600 outline-none placeholder:text-slate-600",
                    `justify-between px-4 ${!date && "text-muted-foreground"}`,
                  )}
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays size={18} className="text-slate-600" />
                    <span className="line-clamp-1 w-full text-left">
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
                        <span>Rental Period</span>
                      )}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  disabled={(date) => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate());
                    yesterday.setHours(0, 0, 0, 0);
                    return date < yesterday;
                  }}
                  defaultMonth={date?.from}
                  selected={date}
                  showOutsideDays={false}
                  onSelect={(newDate) => {
                    setDate(newDate);
                  }}
                  numberOfMonths={width < 640 ? 1 : 2}
                  classNames={{
                    cell: "relative w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                    head_cell: "font-normal text-sm w-9",
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
          </div>
          <Separator className="my-8 inline-block" />
          <div className="flex items-center justify-end gap-2">
            <Button variant={"outline"}>Reset</Button>
            <Button variant={"primary"}>Apply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
