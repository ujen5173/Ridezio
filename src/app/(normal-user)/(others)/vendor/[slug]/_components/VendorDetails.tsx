"use client";

import { Dot, Instagram, MapPin, Phone, Star, Store } from "lucide-react";
import Image from "next/image";
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
import { Separator } from "~/components/ui/separator";
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

  function checkBusinessHours(
    businessHours: Record<string, { open: string; close: string } | null>,
  ) {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });

    if (businessHours[day]) {
      const { open, close } = businessHours[day];
      const [openHour, openMinute, openPeriod] = parseTime(open);
      const [closeHour, closeMinute, closePeriod] = parseTime(close);

      // Normalize the times to 24-hour format
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

      // Handle close time past midnight
      if (
        closeHour < openHour ||
        (closeHour === openHour && closeMinute < openMinute)
      ) {
        closeDate.setDate(closeDate.getDate() + 1);
      }

      if (now < openDate || now > closeDate) {
        return "closed";
      }
    } else {
      return "closed";
    }

    return "open";
  }

  function parseTime(time: string): [number, number, "AM" | "PM"] {
    const [hourMinute, period] = time.split(" ");
    const [hour, minute] = hourMinute!.split(":").map(Number);
    return [hour!, minute!, period === "AM" ? "AM" : "PM"];
  }

  function extractDirectionsFromIframe(iframeSrc: string): string {
    // Check if the source is a valid Google Maps URL
    if (!iframeSrc?.includes("google.com/maps")) {
      return "# ";
    }

    // Extract place name from the URL
    const placeNameMatch = /!2s(.+?)!/.exec(iframeSrc);
    const placeName = placeNameMatch
      ? decodeURIComponent(placeNameMatch[1]!).replace(/\+/g, " ")
      : null;

    // Throw an error if no place name is found
    if (!placeName) {
      return "# ";
    }

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

    return googleMapsLink;
  }

  if (!vendor) return null;

  return (
    <>
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
                    "max-h-[625px] py-2",
                    imageOrientation === "horizontal" ? "px-3" : "py-3",
                  )}
                >
                  {vendor?.images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="relative basis-auto px-1 pt-2"
                    >
                      <button className="rounded-sm hover:ring-2 hover:ring-secondary hover:ring-offset-2">
                        <Image
                          onClick={() => {
                            api?.scrollTo(index);
                          }}
                          alt={`${vendor.name!}'s Images`}
                          width={450}
                          height={450}
                          layout="fixed"
                          className="size-16 cursor-pointer rounded-sm object-cover md:aspect-square"
                          key={index}
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
                      <Image
                        alt={`${vendor.name!}'s Images`}
                        width={1440}
                        height={950}
                        // priority
                        layout="cover"
                        className="relative z-10 aspect-[16/12] rounded-md bg-transparent object-cover"
                        key={index}
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

            <h1 className="mb-4 text-3xl font-bold text-slate-700">
              {vendor.name}
            </h1>

            <div className="flex flex-1 flex-col justify-between">
              <div className="mb-4 flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="fill-yellow-500 stroke-yellow-500"
                  />
                  <span className="text-sm">
                    {vendor.rating !== 0
                      ? parseFloat(vendor.rating.toString()).toFixed(1)
                      : "N/A"}{" "}
                    ({vendor.ratingCount})
                  </span>
                </div>
                <Dot size={16} />
                <div className="flex items-center gap-1">
                  <Phone size={16} className="text-foreground" />
                  <span className="text-sm">{vendor.phoneNumbers[0]}</span>
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
                      <Separator
                        orientation="vertical"
                        className="h-[inherit]"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant={"outline"}
                          className="flex size-20 flex-col items-center justify-between rounded-md p-2"
                        >
                          <Link href={`/vendor/${vendor.name}/shop`}>
                            <div className="flex h-12 w-12 items-center justify-center">
                              <Store size={26} className="text-red-600" />
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
                  <h3 className="text-xl font-bold text-slate-600">
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
                    <Button
                      className="w-full text-slate-700"
                      variant={"outline"}
                    >
                      <MapPin size={16} className="mr-2 text-slate-700" />
                      View in Maps
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VendorDetails;
