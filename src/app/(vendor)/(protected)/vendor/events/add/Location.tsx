"use client";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

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

type LocationPickerProps = {
  placeholder: string;
  onLocationSelect: (location: Location) => void;
  icon?: JSX.Element;
  locationKey: "meetup_location" | "destination_location";
};

const LocationPicker = ({
  placeholder,
  onLocationSelect,
  locationKey = "meetup_location",
  icon = <MapPin size={18} className="mt-1 text-slate-700" />,
}: LocationPickerProps) => {
  const form = useFormContext();

  form?.watch(locationKey);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

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
          process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY
        }&q=${encodeURIComponent(debouncedSearchQuery)}&limit=5`,
      );

      if (!response.ok) return [];
      return (await response.json()) as Location[];
    },
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const uniqueLocations = Array.from(
    (locations ?? [])
      .reduce((map, item) => {
        if (!map.has(item.place_id)) {
          map.set(item.place_id, item);
        }
        return map;
      }, new Map())
      .values(),
  );

  return (
    <FormField
      control={form?.control}
      name={locationKey}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  className="flex items-start gap-2 rounded-sm border border-slate-200 bg-slate-100 p-3"
                >
                  {icon}
                  <div>
                    <h3 className="flex-1 text-lg text-slate-600">
                      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                      {form?.getValues(locationKey) || placeholder}
                    </h3>
                    {/* <h4 className="flex-1 text-base text-slate-500">
                      {locationAddress}
                    </h4> */}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[90vw] max-w-[694px] flex-1 p-0"
              >
                <Command>
                  <CommandInput
                    placeholder="Search location..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {searchQuery.length < 2
                        ? "Start typing..."
                        : "No locations found"}
                    </CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {isLoading && (
                        <CommandItem disabled>Loading locations...</CommandItem>
                      )}
                      {uniqueLocations.map((location: Location) => (
                        <CommandItem
                          key={location.place_id}
                          className="w-full"
                          value={location.display_place}
                          onSelect={() => {
                            onLocationSelect(location);
                            setSearchQuery("");
                            setOpen(false);
                            field.onChange(location.display_place);
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationPicker;
