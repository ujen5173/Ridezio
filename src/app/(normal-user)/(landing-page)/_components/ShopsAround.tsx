"use client";

import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import VendorCard from "~/app/_components/_/VendorCard";
import VendorCardLoading from "~/app/_components/_/VendorCardLoading";
import { type IpInfoResponse } from "~/app/api/ip/route";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { Skeleton } from "~/components/ui/skeleton";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { api as trpc } from "~/trpc/react";
type LatLng = {
  lat: number;
  lng: number;
  city: string;
};

const ShopsAround = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const {
    data: shopsAroundData,
    refetch,
    isLoading,
  } = trpc.business.getVendorAroundLocation.useQuery(
    {
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      maxDistance: 20, // 20 km radius
      vehicleTypes: undefined, // No vehicle type filter
      minRating: undefined, // No minimum rating filter
      limit: 10,
      offset: 0,
    },
    {
      enabled: true,
    },
  );

  useEffect(() => {
    const getLocation = async () => {
      const { data: userLocation } = await axios.get<IpInfoResponse>(
        env.NEXT_PUBLIC_APP_URL + "/api/ip",
      );

      if (!userLocation) {
        return;
      }
      setUserLocation({
        lat: parseFloat(userLocation.loc.split(",")[0]!),
        lng: parseFloat(userLocation.loc.split(",")[1]!),
        city: userLocation.city,
      });
    };

    void getLocation().then(() => {
      void refetch();
    });
  }, []);

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
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            className={cn(
              "flex items-center gap-2 text-2xl font-bold xs:text-3xl",
            )}
          >
            <span>Shops Near</span>
            {!userLocation ? (
              <Skeleton className="h-10 w-28 rounded-sm" />
            ) : (
              <span className="font-black capitalize text-secondary underline underline-offset-2">
                {userLocation?.city}
              </span>
            )}
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
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <VendorCardLoading />
                    </CarouselItem>
                  ))
                : shopsAroundData?.vendors?.map((shop, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <VendorCard shop={shop} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ShopsAround;
