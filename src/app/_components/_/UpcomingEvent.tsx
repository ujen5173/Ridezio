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
import { cn } from "~/lib/utils";
import EventCard from "./EventCard";

export type EventSlide = {
  thumbnail: string;
  title: string;
  hostedBy: string;
  date: string;
  participants: number;
  meetinglocation: string;
  entryFee: number;
  maxParticipants: number;
};

const slides: EventSlide[] = [
  {
    thumbnail: "/images/events/img-event-2.webp",
    title: "Mountain Bike Ride to Sarangkot",
    hostedBy: "Epic Mountain Bike",
    date: "10/25/2024",
    participants: 15,
    meetinglocation: "Pokhara, Nepal",
    entryFee: 700,
    maxParticipants: 25,
  },
  {
    thumbnail: "/images/events/img-event-3.jpg",
    title: "Saddle Ride to Dhulikhel",
    hostedBy: "Saddle Bike Store",
    date: "11/01/2024",
    participants: 10,
    meetinglocation: "Bhaktapur, Nepal",
    entryFee: 400,
    maxParticipants: 18,
  },
  {
    thumbnail: "/images/events/img-event-4.jpg",
    title: "Himalayan Adventure to Shivapuri",
    hostedBy: "Himalayan Single Track Pvt. Ltd",
    date: "11/15/2024",
    participants: 20,
    meetinglocation: "Kathmandu, Nepal",
    entryFee: 600,
    maxParticipants: 30,
  },
  {
    thumbnail: "/images/events/img-event-1.webp",
    title: "Valley Ride through Patan",
    hostedBy: "Valley Riders",
    date: "10/28/2024",
    participants: 18,
    meetinglocation: "Lalitpur, Nepal",
    entryFee: 550,
    maxParticipants: 22,
  },
  {
    thumbnail: "/images/events/img-event-3.jpg",
    title: "Saddle Ride to Dhulikhel",
    hostedBy: "Saddle Bike Store",
    date: "11/01/2024",
    participants: 10,
    meetinglocation: "Bhaktapur, Nepal",
    entryFee: 400,
    maxParticipants: 18,
  },
];

const UpcomingEvent = () => {
  const [api, setApi] = useState<CarouselApi>();
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
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className={cn("block text-2xl font-bold xs:hidden")}>
            Upcoming Events
          </h2>
          <h2 className={cn("hidden text-2xl font-bold xs:block xs:text-3xl")}>
            Participate on Upcoming Events
          </h2>

          <div className="flex gap-2">
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
        </div>

        <div className="flex flex-col items-center gap-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start" }}
          >
            <CarouselContent>
              {slides.map((event, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
