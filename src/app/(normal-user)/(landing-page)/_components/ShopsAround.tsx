"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRootContext } from "~/app/_components/contexts/root";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { api as trpc } from "~/trpc/react";
import VendorCardWithPrefetch from "./VendorCardWithPrefetch";

const ShopsAround = () => {
  const { city, geo } = useRootContext();
  const { data: shopsAroundData, isLoading } =
    trpc.business.getVendorAroundLocation.useQuery(
      {
        geo,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  const [api, setApi] = useState<CarouselApi | undefined>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            className={cn(
              "flex items-center gap-2 text-xl font-bold text-slate-700 xs:text-2xl sm:text-3xl",
            )}
          >
            <span>Rentals Around</span>
            <span className="font-black capitalize text-secondary underline underline-offset-2">
              {city}
            </span>
          </h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
              className="size-8 border border-border bg-white text-foreground hover:border-secondary/80 hover:text-slate-50 sm:size-10"
            >
              <ChevronLeft size={20} className="text-inherit" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => api?.scrollNext()}
              disabled={current === count - 1}
              className="size-8 border border-border bg-white text-foreground hover:border-secondary/80 hover:text-slate-50 sm:size-10"
            >
              <ChevronRight size={20} className="text-inherit" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start" }}
          >
            <CarouselContent>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <Skeleton className="h-48 w-full rounded-md" />
                      <Skeleton className="h-6 w-3/4 rounded-sm" />
                      <Skeleton className="h-6 w-1/2 rounded-sm" />
                    </CarouselItem>
                  ))
                : shopsAroundData?.vendors.map((shop, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <VendorCardWithPrefetch shop={shop} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>

          {shopsAroundData?.vendors.length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center gap-4">
              <p className="text-center text-lg text-foreground">
                Oops! No rentals are available near you.
              </p>
            </div>
          ) : (
            <Button variant={"outline"} asChild>
              <Link href={`/search?location=${city}`}>Explore on Maps</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopsAround;
