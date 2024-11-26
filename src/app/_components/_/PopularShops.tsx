"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import { api as trpc } from "~/trpc/react";
import VendorCard from "./VendorCard";

const PopularShops = () => {
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data: initialData } = trpc.business.getPopularShops.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  console.log({ popularShops: initialData });

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className={cn("text-2xl font-bold xs:text-3xl")}>
            Popular Shops
          </h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
              className="size-10 border border-border bg-white"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => api?.scrollNext()}
              disabled={current === count - 1}
              className="size-10 border border-border bg-white"
            >
              <ChevronRight size={20} className="text-foreground" />
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
              {initialData?.map((shop, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <VendorCard shop={shop} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* <Button className="gap-1" variant="outline">
            <Map size={18} className="text-slate-600" />
            Explore Shops Around you
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default PopularShops;
