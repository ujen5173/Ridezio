"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";
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

const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const q = useSearchParams().get("query") ?? "";
  const [searchQuery, setSearchQuery] = useState("");

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

  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `/search?location=${selectedLocation}&query=${inputRef.current?.value}`;

    router.push(url);
  };

  return (
    <form className="hidden items-center md:flex" onSubmit={handleSubmit}>
      <div className="my-auto flex h-10 items-center rounded-full border border-border px-[0.35rem] py-2 shadow-md">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              aria-expanded={open}
              className={cn(
                "h-8 w-32 flex-1 rounded-lg border-none py-2 outline-none",
              )}
            >
              <span className="line-clamp-1 w-full text-center text-xs font-semibold text-slate-800">
                {selectedLocation || "Locations"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="mt-2 w-screen max-w-full p-0 md:max-w-[400px]"
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
                  {locations !== undefined &&
                    locations?.length > 0 &&
                    Array.from(
                      locations
                        .reduce((map, item) => {
                          if (!map.has(item.place_id)) {
                            map.set(item.place_id, item);
                          }
                          return map;
                        }, new Map())
                        .values(),
                    ).map((location: Location) => (
                      <CommandItem
                        key={location.place_id}
                        className="w-full"
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

        <Separator
          className="h-6 w-[1.4px] shrink-0 bg-border"
          orientation="vertical"
        />

        <input
          placeholder="Search Query"
          ref={inputRef}
          defaultValue={q}
          className={cn(
            "h-8 w-28 flex-1 rounded-lg border-none px-2 py-2 text-center text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-600",
          )}
        />

        <button
          type="submit"
          className="flex size-7 items-center justify-center rounded-full bg-secondary outline-none"
        >
          <Search size={12} className="text-white" />
        </button>
      </div>
    </form>
  );
};

export default HeaderSearch;
