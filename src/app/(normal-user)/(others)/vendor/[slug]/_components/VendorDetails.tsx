"use client";

import { Dot, Instagram, Phone, RouteIcon, Star } from "lucide-react";
import Link from "next/link";
import { useContext, useLayoutEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import VehicleIndicatorIcon from "~/app/_components/_/VehicleIndicatorIcon";
import { WEEK_DAYS } from "~/app/utils/helpers";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { OptimizedImage } from "~/components/ui/optimized-image";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { extractDirectionsFromIframe } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import FavroiteButton from "./FavroiteButton";
import { VendorContext } from "./VendorWrapper";

const VendorDetails = () => {
  const { setOpen, vendor } = useContext(VendorContext);

  const [api, setApi] = useState<CarouselApi>();

  const [imageOrientation, setImageOrientation] = useState<
    "horizontal" | "vertical"
  >("vertical");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setImageOrientation("horizontal");
      } else {
        setImageOrientation("vertical");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function parseTime(timeStr: string): [number, number, string] {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time!.split(":").map(Number);
    return [hours!, minutes!, period!];
  }

  function checkBusinessHours(
    businessHours: Record<string, { open: string; close: string } | null>,
  ): "open" | "closed" {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const hours = businessHours[day];

    if (!hours) {
      return "closed";
    }

    try {
      const { open, close } = hours;
      const [openHour, openMinute, openPeriod] = parseTime(open);
      const [closeHour, closeMinute, closePeriod] = parseTime(close);

      const openDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        (openHour % 12) + (openPeriod === "PM" ? 12 : 0),
        openMinute,
      );

      const closeDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        (closeHour % 12) + (closePeriod === "PM" ? 12 : 0),
        closeMinute,
      );

      if (closeDate <= openDate) {
        closeDate.setDate(closeDate.getDate() + 1);
      }

      return now >= openDate && now <= closeDate ? "open" : "closed";
    } catch (error) {
      return "closed";
    }
  }

  if (!vendor) return null;

  return (
    <section className="px-4">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 py-6 md:flex-row md:py-10 lg:gap-10">
        <div className="mx-auto flex h-fit w-full flex-col-reverse gap-0 sm:w-10/12 md:w-7/12 lg:flex-row lg:gap-2">
          <div>
            <Carousel
              orientation={imageOrientation}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent
                className={cn(
                  "max-h-[500px] py-2",
                  imageOrientation === "horizontal" ? "px-3" : "py-3",
                )}
              >
                {vendor?.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="relative basis-auto px-1 pt-2"
                  >
                    <button
                      onClick={() => api?.scrollTo(index)}
                      className="aspect-square size-16 rounded-md hover:ring-2 hover:ring-secondary hover:ring-offset-2"
                    >
                      <OptimizedImage
                        alt={`${vendor.name!}'s Images`}
                        className="aspect-square size-16 rounded-md object-cover"
                        src={image.url}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="relative h-min lg:flex-1">
            <Carousel setApi={setApi} className="w-full">
              <CarouselPrevious />
              <CarouselNext />
              <CarouselContent className="h-full">
                {vendor.images.map((_, index) => (
                  <CarouselItem key={index} className="relative">
                    <div className="absolute inset-0 z-0 ml-4 animate-pulse rounded-md bg-slate-100"></div>
                    <OptimizedImage
                      alt={`${vendor.name!}'s Images`}
                      className="relative z-10 aspect-[16/12] rounded-md object-cover"
                      src={_.url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute right-2 top-2 hidden rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-slate-50">
              Open
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-center">
            <h6 className="text-sm font-medium uppercase text-green-600">
              {vendor.location.address}
            </h6>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-slate-700 sm:text-3xl">
            {vendor.name}
          </h1>

          <div className="flex flex-1 flex-col justify-between">
            <div className="mb-4 flex items-center gap-1">
              <Link
                href="#reviews"
                className="flex items-center gap-1 hover:text-secondary hover:underline"
              >
                <Star size={16} className="fill-yellow-500 stroke-yellow-500" />
                <span className="text-sm">
                  {vendor.rating !== 0
                    ? parseFloat(vendor.rating.toString()).toFixed(1)
                    : "N/A"}{" "}
                  ({vendor.ratingCount})
                </span>
              </Link>
              <Dot size={16} />
              <div
                className="flex cursor-pointer items-center gap-1 text-sm transition hover:text-secondary hover:underline"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    vendor.phoneNumbers[0] ?? "0",
                  );
                  toast({
                    title: "📋 Phone Number Copied!",
                  });
                }}
              >
                <Phone size={16} className="text-foreground" />
                <span>{vendor.phoneNumbers[0]}</span>
              </div>
              {vendor.instagramHandle && (
                <>
                  <Dot size={16} />
                  <Link
                    target="_blank"
                    href={`https://www.instagram.com/${vendor.instagramHandle}`}
                  >
                    <div className="flex items-center gap-1 text-secondary hover:underline">
                      <Instagram size={16} className="text-inherit" />
                      <span className="text-sm">Instagram</span>
                    </div>
                  </Link>
                </>
              )}
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-base font-semibold text-slate-600">
                Available Vehicles
              </h3>
              <div className="flex gap-4">
                <div className="flex flex-1 items-center gap-2">
                  {vendor.availableVehicleTypes.map((vehicle, index) => (
                    <VehicleIndicatorIcon vehicle={vehicle} key={index} />
                  ))}
                </div>
                {vendor.sellGears && (
                  <>
                    <Separator orientation="vertical" className="h-[inherit]" />
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant={"outline"}
                        className="flex size-20 flex-col items-center justify-between rounded-md p-2"
                      >
                        <Link href={`/vendor/${vendor.slug}/shop`}>
                          <div className="flex h-12 w-12 items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="text-secondary"
                              fill="none"
                            >
                              <path
                                d="M3.00003 10.9866V15.4932C3.00003 18.3257 3.00003 19.742 3.87871 20.622C4.75739 21.502 6.1716 21.502 9.00003 21.502H15C17.8284 21.502 19.2426 21.502 20.1213 20.622C21 19.742 21 18.3257 21 15.4932V10.9866"
                                stroke="currentColor"
                                stroke-width="1.5"
                              ></path>
                              <path
                                d="M7.00003 17.9741H11"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                              ></path>
                              <path
                                d="M17.7957 2.50049L6.14986 2.52954C4.41169 2.44011 3.96603 3.77859 3.96603 4.4329C3.96603 5.01809 3.89058 5.8712 2.82527 7.47462C1.75996 9.07804 1.84001 9.55437 2.44074 10.6644C2.93931 11.5857 4.20744 11.9455 4.86865 12.0061C6.96886 12.0538 7.99068 10.2398 7.99068 8.96495C9.03254 12.1683 11.9956 12.1683 13.3158 11.802C14.6386 11.435 15.7717 10.1214 16.0391 8.96495C16.195 10.4021 16.6682 11.2408 18.0663 11.817C19.5145 12.4139 20.7599 11.5016 21.3848 10.9168C22.0097 10.332 22.4107 9.03364 21.2968 7.60666C20.5286 6.62257 20.2084 5.69548 20.1033 4.73462C20.0423 4.17787 19.9888 3.57961 19.5972 3.1989C19.0248 2.64253 18.2036 2.47372 17.7957 2.50049Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>{" "}
                          </div>
                          <span className="text-xs">Shop Gears</span>
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between gap-6">
                <h3 className="text-lg font-bold text-slate-700">
                  Business Hours
                </h3>
                <div className="flex items-center gap-2">
                  {checkBusinessHours(vendor.businessHours) === "open" ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-green-600 underline">
                        Open
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-red-600 underline">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(vendor.businessHours)
                  .sort(
                    ([a], [b]) => WEEK_DAYS.indexOf(a) - WEEK_DAYS.indexOf(b),
                  )
                  .map(([key, value], index) => (
                    <div key={index}>
                      <h6 className="text-base font-semibold capitalize text-slate-600">
                        {key}
                      </h6>
                      {value ? (
                        <p className="text-sm text-slate-600">
                          {value.open} - {value.close}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-600">Closed</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full"
                  variant={"primary"}
                >
                  Reserve Now
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <FavroiteButton id={vendor.id} />
                <Link
                  href={extractDirectionsFromIframe(vendor.location.map!)}
                  target="_blank"
                  className="block w-full"
                >
                  <Button className="w-full text-slate-700" variant={"outline"}>
                    <RouteIcon size={16} className="mr-2 text-slate-700" />
                    Get Directions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorDetails;
