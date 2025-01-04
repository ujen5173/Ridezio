"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import PickupVehicle from "./PickupVehicle";

const WhichVehicle = ({
  open,
  date,
  setDate,
  setQuantity,
  handleClearDate,
  isDateSelectionDisabled,
  isDateDisabled,
  selectedVehicle,
  setSelectedVehicle,
  selectedVehicleType,
  allAvailableVehicles,
  getRentalDays,
  getMaxAllowedQuantity,
}: {
  open: boolean;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setQuantity: (quantity: number) => void;
  handleClearDate: () => void;
  isDateSelectionDisabled: boolean;
  isDateDisabled: (date: Date) => boolean;
  selectedVehicle: { vehicleModel: string; vehicleCategory: string };
  setSelectedVehicle: React.Dispatch<
    React.SetStateAction<{ vehicleModel: string; vehicleCategory: string }>
  >;
  selectedVehicleType: string;
  allAvailableVehicles: Record<string, Record<string, string[]>>;
  getRentalDays: () => number;
  getMaxAllowedQuantity: () => number;
}) => {
  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-5 px-1 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Which Vehicle?</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-4"
            >
              <div className="line-clamp-1">
                {selectedVehicle.vehicleModel
                  ? selectedVehicle.vehicleModel
                  : "Select category..."}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              <CommandInput placeholder="Search category..." />
              <ScrollArea className="min-h-36 w-full">
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(allAvailableVehicles)
                      .map((data) => {
                        if (
                          data[0]
                            .toLowerCase()
                            .includes(selectedVehicleType.toLowerCase())
                        ) {
                          return Object.entries(data[1]);
                        }
                      })
                      .find((data) => data)
                      ?.map(([category, vehicles]) => {
                        return (
                          <div key={category}>
                            <CommandItem
                              disabled
                              className="px-2 py-1.5 font-semibold text-slate-950"
                            >
                              {category}
                            </CommandItem>
                            {vehicles.map((vehicleName) => (
                              <PopoverClose
                                className="flex w-full"
                                key={vehicleName}
                              >
                                <CommandItem
                                  className="w-full pl-4"
                                  value={vehicleName}
                                  onSelect={() => {
                                    setSelectedVehicle({
                                      vehicleModel: vehicleName,
                                      vehicleCategory: category,
                                    });
                                  }}
                                >
                                  {vehicleName}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      selectedVehicle.vehicleModel ===
                                        vehicleName
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              </PopoverClose>
                            ))}
                          </div>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <PickupVehicle
        date={date}
        setDate={setDate}
        setQuantity={setQuantity}
        handleClearDate={handleClearDate}
        isDateSelectionDisabled={isDateSelectionDisabled}
        isDateDisabled={isDateDisabled}
        getMaxAllowedQuantity={getMaxAllowedQuantity}
        getRentalDays={getRentalDays}
      />
    </div>
  );
};

export default WhichVehicle;
