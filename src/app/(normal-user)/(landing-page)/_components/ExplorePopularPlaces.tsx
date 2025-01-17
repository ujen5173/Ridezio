"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";

const ExplorePopularPlaces = () => {
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
    <section className="w-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            className={cn(
              "flex items-center gap-2 text-xl font-bold text-slate-700 xs:text-2xl sm:text-3xl",
            )}
          >
            Popular Rental Destinations
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
            <CarouselContent className="">
              {[
                {
                  id: crypto.randomUUID(),
                  label: "Kathmandu",
                  imgSource: "/destinations/kathmandu.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Pokhara",
                  imgSource: "/destinations/pokhara.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Chitwan",
                  imgSource: "/destinations/chitwan.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Lumbini",
                  imgSource: "/destinations/lumbini.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Bandipur",
                  imgSource: "/destinations/bandipur.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Nagarkot",
                  imgSource: "/destinations/nagarkot.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Ilam",
                  imgSource: "/destinations/ilam.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Besisahar",
                  imgSource: "/destinations/besisahar.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Dhulikhel",
                  imgSource: "/destinations/dhulikhel.webp",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Birjung",
                  imgSource: "/destinations/birjung.webp",
                },
              ].map((shop) => (
                <CarouselItem
                  key={shop.id}
                  className="basis-full select-none shadow-sm xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <Link href={`/search?location=${shop.label}`}>
                    <div className="flex flex-col items-center space-y-4 rounded-md border border-slate-200 bg-slate-100 p-4">
                      <Image
                        src={shop.imgSource}
                        alt=""
                        width={500}
                        height={500}
                        className="aspect-square w-full max-w-60 rounded-full object-cover sm:max-w-max"
                      />
                      <p className="whitespace-nowrap break-keep text-center text-lg font-medium text-slate-700">
                        {shop.label}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ExplorePopularPlaces;
