"use client";

import { MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import VendorCard from "~/app/_components/_/VendorCard";
import { Button } from "~/components/ui/button";
import { searchedData } from "~/lib/data";
import { cn } from "~/lib/utils";
import { chakra_petch } from "../../../utils/font";
import Filter from "./_components/Filter";
import MapArea from "./_components/MapArea";

const Search = () => {
  const [showingArea, setShowingArea] = useState<"places" | "map" | "both">(
    "places",
  );

  useEffect(() => {
    const handleResize = () => {
      setShowingArea(window.innerWidth < 1024 ? "places" : "both");
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section className="relative w-full">
        <div className="fixed bottom-4 left-1/2 z-[100] block -translate-x-1/2 lg:hidden">
          <Button
            onClick={() =>
              setShowingArea(showingArea === "places" ? "map" : "places")
            }
            variant={"black"}
            rounded={"full"}
          >
            <MapIcon size={18} />
            <span className="ml-2">
              {showingArea === "places" ? "Show Map" : "Show List"}
            </span>
          </Button>
        </div>

        <div className={cn("relative flex")}>
          <div
            className={cn(
              "max-w-none overflow-auto border-r border-border lg:max-w-[600px] xl:max-w-[932px]",
              showingArea === "map" ? "hidden" : "block w-full",
              showingArea === "both" ? "block" : "",
              "px-8 py-4 md:p-4",
            )}
          >
            <HeaderHeight />

            {/* Keep the original content as is */}
            <div className="mb-2 flex items-center justify-between gap-4">
              <span
                className={cn(
                  "text-lg font-medium text-foreground",
                  chakra_petch.className,
                )}
              >
                {searchedData.length} Results found in visible area
              </span>
              <Filter />
            </div>
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {searchedData.map(({ lonlat, ...shop }) => (
                <div
                  className={cn("relative", chakra_petch.className)}
                  key={shop.slug}
                >
                  <VendorCard
                    shop={shop}
                    separatorColor="bg-slate-200"
                    separatorHeight="h-[3px]"
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "relative z-30 h-auto min-h-screen flex-1",
              showingArea === "places" ? "hidden" : "block",
              showingArea === "both" ? "block" : "",
            )}
          >
            <div className="sticky inset-0 left-0 top-0 h-screen">
              <MapArea />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
