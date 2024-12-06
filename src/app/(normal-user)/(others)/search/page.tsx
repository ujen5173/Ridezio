"use client";

import { MapIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";
import { type GetSearchedShops } from "~/server/api/routers/business";
import { api } from "~/trpc/react";
import { chakra_petch } from "../../../utils/font";
import Filter from "./_components/Filter";
import MapArea from "./_components/MapArea";

export interface MapBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

const Search = ({
  params,
}: {
  params: {
    query: string;
  };
}) => {
  const { width } = useWindowDimensions();
  const [places, setPlaces] = useState<GetSearchedShops>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showingArea, setShowingArea] = useState<"places" | "map" | "both">(
    "both",
  );

  const {
    data: searchBusinesses,
    isLoading: isDataFetching,
    isError,
    refetch,
  } = api.business.search.useQuery(
    {
      query: params.query,
      bounds: bounds!,
    },
    {
      enabled: !!bounds,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setShowingArea(width < 1024 ? "map" : "both");
  }, [width]);

  // Handle initial data loading and subsequent updates
  useEffect(() => {
    if (initialLoad && bounds) {
      setInitialLoad(false);
    }

    if (!isDataFetching && searchBusinesses) {
      setPlaces(searchBusinesses);
      setIsLoading(false);
    }
  }, [searchBusinesses, isDataFetching, bounds, initialLoad]);

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Could not fetch businesses",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [isError]);

  // Debounced resize handler with meaningful width change check
  useLayoutEffect(() => {
    let lastWidth = window.innerWidth;
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const currentWidth = window.innerWidth;

        if (Math.abs(currentWidth - lastWidth) > 50) {
          setShowingArea(currentWidth < 1024 ? "map" : "both");
          lastWidth = currentWidth;
        }
      }, 250);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const toggleAreaView = useCallback(() => {
    setShowingArea((prev) => (prev === "places" ? "map" : "places"));
  }, []);

  return (
    <>
      <section className="relative w-full">
        <div className="fixed bottom-4 left-1/2 z-[50] block -translate-x-1/2 lg:hidden">
          <Button
            disabled={isDataFetching}
            onClick={toggleAreaView}
            variant={"black"}
            rounded={"full"}
          >
            <MapIcon size={18} />
            <span className="ml-2">
              {showingArea === "places" ? "Show Map" : "Show List"}
            </span>
          </Button>
        </div>

        <div className={cn("relative flex h-screen")}>
          <div
            className={cn(
              "remove-scroll max-w-none overflow-auto border-r border-border bg-white lg:max-w-[600px] xl:max-w-[932px]",
              showingArea === "map"
                ? "fixed left-0 top-0 -z-10 h-full w-full"
                : "block w-full",
              showingArea === "both" ? "block" : "",
              "px-8 md:px-4",
            )}
          >
            <HeaderHeight />

            <div className="flex items-center justify-between gap-4 pb-2 pt-4 sm:mb-2 sm:py-4">
              <span
                className={cn(
                  "text-lg font-medium text-foreground",
                  chakra_petch.className,
                )}
              >
                {places.length} Results found in visible area
              </span>
              <div className="hidden sm:block">
                <Filter />
              </div>
            </div>
            {/* <ScrollArea className="">
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {isDataFetching ? (
                  <>
                    <VendorCardLoading />
                    <VendorCardLoading />
                    <VendorCardLoading />
                    <VendorCardLoading />
                    <VendorCardLoading />
                  </>
                ) : places.length > 0 ? (
                  places.map((rental) => (
                    <div
                      className={cn("relative", chakra_petch.className)}
                      key={rental.slug}
                    >
                      <VendorCard
                        shop={rental}
                        separatorColor="bg-slate-200"
                        separatorHeight="h-[3px]"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex h-[80vh] items-center justify-center sm:h-auto">
                    <span className="text-lg font-medium text-foreground">
                      Try Searching in a different area
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea> */}
          </div>
          <div
            className={cn(
              "relative z-30 h-auto min-h-screen flex-1 bg-white",
              showingArea === "places"
                ? "fixed left-0 top-0 -z-10 h-full w-full"
                : "block",
              showingArea === "both" ? "block" : "",
            )}
          >
            <div className="sticky inset-0 left-0 top-0 h-screen">
              <MapArea
                places={places}
                isLoading={isLoading}
                setBounds={setBounds}
                isDataFetching={isDataFetching}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
