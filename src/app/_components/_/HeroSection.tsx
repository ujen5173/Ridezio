"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bike, CalendarDays, Car, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";
import Balancer from "react-wrap-balancer";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { env } from "~/env";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { Icons } from "~/lib/Icons";
import { cn } from "~/lib/utils";

type Location = {
  address: {
    country: string;
    country_code: string;
    county: string;
    state: string;
    name: string;
  };
  boundingBox: Record<number, string>;
  class: string;
  display_name: string;
  display_place: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  place_id: string;
  osm_type: string;
  type: string;
  display_address: string;
};

const HeroSection = () => {
  const { width } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [vehicleType, setVehicleType] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) return [];

      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${
          env.NEXT_PUBLIC_LOCATIONIQ_API_KEY
        }&q=${encodeURIComponent(debouncedSearchQuery)}&limit=5`,
      );

      if (!response.ok) return [];

      const data = (await response.json()) as Location[];

      return data;
    },
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return (
    <section
      className={cn(
        "relative w-full",
        "h-[70vh] max-h-[1240px] min-h-[650px] w-full object-cover",
      )}
    >
      <div className="overlay hidden md:block" />
      <div className="overlay-mobile block md:hidden" />

      <div className="absolute inset-0 flex h-full w-full items-end bg-[#7b7c7d08] sm:bg-transparent">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-5 pt-10 md:py-10">
          <h1
            className={cn(
              "mb-5 text-center text-5xl font-semibold text-slate-700 md:mb-7 md:text-left md:text-slate-100 lg:text-6xl",
              chakra_petch.className,
            )}
          >
            <div className="hidden md:flex">
              <Balancer>
                Rent Cycles, Bikes, Cars, and Scooters from Local Shops Around
                You
              </Balancer>
            </div>
            <div className="flex md:hidden">
              <Balancer>Rent Any Vehicles Right Now Around You</Balancer>
            </div>
          </h1>

          <div className="flex flex-col gap-4 md:flex-row">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  aria-expanded={open}
                  className={cn(
                    "sn:text-slate-100 flex h-12 w-full flex-1 items-center gap-2 bg-slate-200 text-slate-600 md:max-w-80 md:bg-slate-100/30",
                    "rounded-lg bg-slate-200 px-4 py-3 text-base text-slate-600 outline-none placeholder:text-slate-100 md:max-w-80 md:bg-slate-100/30 md:text-slate-100",
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-slate-600 md:text-slate-100" />
                  <span className="line-clamp-1 w-full text-left">
                    {selectedLocation || "Search locations..."}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 md:w-[400px]">
                <Command>
                  <CommandInput
                    placeholder="Search location..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {isLoading && (
                        <CommandItem disabled>Loading locations...</CommandItem>
                      )}
                      {locations?.map((location: Location) => (
                        <CommandItem
                          key={location.place_id}
                          value={location.display_name}
                          onSelect={(value) => {
                            setSelectedLocation(value);
                            setSearchQuery("");
                            setOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {location.display_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex w-full flex-1 items-center gap-2 rounded-lg bg-slate-200 px-4 py-3 text-base text-slate-600 outline-none placeholder:text-slate-600 md:max-w-80 md:bg-slate-100/30 md:text-slate-100 placeholder:md:text-slate-100",
                    `justify-between px-4 ${!date && "text-muted-foreground"}`,
                  )}
                >
                  <div className="flex items-center gap-2 text-slate-600 md:text-slate-100">
                    <CalendarDays
                      size={18}
                      className="text-slate-600 md:text-slate-100"
                    />
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
                        <span>Pick a date</span>
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

            <Select onValueChange={(value) => setVehicleType(value)}>
              <SelectTrigger
                className={cn(
                  "w-full flex-1 border-none bg-slate-200 text-base text-slate-600 md:max-w-80 md:bg-slate-100/30 md:text-slate-100",
                  "h-12 focus:ring-0 focus-visible:ring-0",
                )}
              >
                <div className="flex items-center gap-2 p-1">
                  <SelectValue
                    placeholder="Select Vehicle Type"
                    className="py-2 text-slate-100"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-slate-600">
                  <SelectLabel>Vehicle Type</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="bicycle">
                    <div className="flex items-center gap-1">
                      <Bike className="h-4 w-4 shrink-0 text-inherit" />
                      Bicycle
                    </div>
                  </SelectItem>
                  <SelectItem className="flex items-center gap-1" value="bike">
                    <div className="flex items-center gap-1">
                      <Icons.bike className="h-4 w-4 shrink-0 text-inherit" />
                      Bike
                    </div>
                  </SelectItem>
                  <SelectItem value="scooter">
                    <div className="flex items-center gap-1">
                      <Icons.scooter className="h-4 w-4 shrink-0 text-inherit" />
                      Scooter
                    </div>
                  </SelectItem>
                  <SelectItem className="flex items-center gap-1" value="car">
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4 shrink-0 text-inherit" />
                      Car
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button asChild className="h-12 uppercase">
              <Link
                href={{
                  pathname: "/search",
                  query: {
                    location: selectedLocation,
                    from: date?.from?.toLocaleDateString(),
                    to: date?.to?.toLocaleDateString(),
                    vehicleType,
                  },
                }}
              >
                Search
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
