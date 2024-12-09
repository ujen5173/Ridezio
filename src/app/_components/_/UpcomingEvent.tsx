"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { toast } from "~/hooks/use-toast";
import { type EventSlide } from "~/lib/data";
import { cn } from "~/lib/utils";
import EventCard from "./EventCard";

const UpcomingEvent = ({ events }: { events: EventSlide[] | undefined }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (!events) {
    toast({
      title: "Unable to get events",
      description: "Please try again later",
      variant: "destructive",
    });
    return;
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            className={cn(
              "block items-center gap-2 text-xl font-bold xs:text-2xl sm:hidden sm:text-3xl",
            )}
          >
            Upcoming Events
          </h2>
          <h2 className={cn("hidden text-2xl font-bold sm:block sm:text-3xl")}>
            Participate on Upcoming Events
          </h2>

          <div className="flex gap-2">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={current === 0}
                className="size-8 border border-border bg-white sm:size-10"
              >
                <ChevronLeft size={20} className="text-foreground" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={current === count - 1}
                className="size-8 border border-border bg-white sm:size-10"
              >
                <ChevronRight size={20} className="text-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start" }}
          >
            <CarouselContent>
              {events.map((event, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <EventCard event={event} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Button variant={"outline"}>Explore all Events</Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvent;
