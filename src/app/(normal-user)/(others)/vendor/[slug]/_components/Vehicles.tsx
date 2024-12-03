"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type GetBusinessVehiclesType } from "~/server/api/routers/vehicle";
import { type vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { VendorContext } from "./VendorWrapper";

const Vehicles = () => {
  const { slug } = useParams();
  const { vendor, setOpen } = useContext(VendorContext);
  const [filter, setFilter] = useState<
    (typeof vehicleTypeEnum.enumValues)[number] | "all"
  >("all");
  const [filteredVehicles, setFilteredVehicles] =
    useState<GetBusinessVehiclesType>([]);

  const { data: vehicles, isLoading } =
    api.vehicle.getBusinessVehicles.useQuery(
      {
        slug: slug as string,
      },
      {
        refetchOnWindowFocus: false,
        enabled: !!slug,
      },
    );

  useEffect(() => {
    if (vehicles) {
      if (filter !== "all") {
        const filtered = vehicles.filter((vehicle) =>
          vehicle.type.includes(filter),
        );
        setFilteredVehicles(filtered);
      } else {
        setFilteredVehicles(vehicles);
      }
    }
  }, [vehicles, filter]);

  return (
    <section>
      <div className={cn("mx-auto max-w-[1240px]")}>
        <div className="mb-10 flex items-center justify-between gap-10">
          <h1 className={cn("text-2xl font-bold xs:text-3xl")}>
            Pick Your Ride
          </h1>
          <Select
            onValueChange={(e) =>
              setFilter(
                e as (typeof vehicleTypeEnum.enumValues)[number] | "all",
              )
            }
          >
            <SelectTrigger className="w-[180px] bg-white capitalize">
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className="capitalize" key={"all"} value={"all"}>
                  All
                </SelectItem>
                {vendor?.availableVehicleTypes?.map((type) => (
                  <SelectItem className="capitalize" key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <section
          className={cn(
            "grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {isLoading ? (
            <>
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </>
          ) : (
            (filteredVehicles ?? [])?.map((vehicle) => (
              <div key={vehicle.id}>
                <Link
                  href={{
                    query: {
                      vehicle: vehicle.name,
                      type: vehicle.type,
                      category: vehicle.category,
                    },
                  }}
                  scroll={false}
                  onClick={async () => {
                    setOpen(true);
                  }}
                  className="flex flex-col gap-2"
                >
                  <div className="relative mb-2 flex aspect-video items-center justify-center">
                    <div className="aspect-video h-[80%] w-auto">
                      <Image
                        alt={`${vehicle.name}`}
                        width={850}
                        height={850}
                        layout="fixed"
                        className="m-auto h-full w-auto rounded-md object-cover mix-blend-multiply"
                        src={vehicle.images[0]!}
                      />
                    </div>
                  </div>
                  <div className="">
                    <h3 className="mb-4 line-clamp-1 text-xl font-semibold">
                      {vehicle.name}
                    </h3>
                    <div>
                      <p className="text-base font-medium uppercase">
                        Starting at
                      </p>

                      <h2 className="mb-4 text-2xl font-bold text-secondary">
                        रु {vehicle.basePrice}{" "}
                        <span className="text-base font-normal">/day</span>
                      </h2>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-1" variant={"outline"}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px]">
                      <DialogHeader>
                        <DialogTitle>
                          {vehicle.name}
                          <span className="italix ml-2 text-sm text-slate-600">
                            ({vehicle.category})
                          </span>
                        </DialogTitle>
                      </DialogHeader>
                      <div>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {vehicle.images.map((_, index) => (
                              <CarouselItem key={index}>
                                <div className="w-full p-1">
                                  <div className="relative mb-2 flex aspect-video items-center justify-center">
                                    <div className="aspect-video h-[80%] w-auto">
                                      <Image
                                        alt={`${vehicle.name}`}
                                        width={1440}
                                        height={1440}
                                        layout="fixed"
                                        className="m-auto h-full w-auto rounded-md object-cover mix-blend-multiply"
                                        src={_}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-0" />
                          <CarouselNext className="right-0" />
                        </Carousel>

                        <div className="mt-4 flex flex-col gap-4">
                          <div>
                            <h3 className="mb-4 text-xl font-semibold">
                              Features
                            </h3>
                            <ul className="list-inside list-disc">
                              {vehicle.features.map(({ key, value }, index) => (
                                <div
                                  key={value + key}
                                  className="grid grid-cols-2"
                                >
                                  <div
                                    className={cn(
                                      "border border-border p-2 text-xl",
                                      {
                                        "bg-slate-100": index % 2 === 0,
                                      },
                                    )}
                                  >
                                    <Label>{key}</Label>
                                  </div>
                                  <div
                                    className={cn(
                                      "border border-border p-2 text-xl",
                                      {
                                        "bg-slate-100": index % 2 === 0,
                                      },
                                    )}
                                  >
                                    <Label>{value}</Label>
                                  </div>
                                </div>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" size="sm" variant={"outline"}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1"
                    variant={"primary"}
                  >
                    <Link
                      href={{
                        query: {
                          vehicle: vehicle.name,
                          type: vehicle.type,
                          category: vehicle.category,
                        },
                      }}
                      scroll={false}
                      onClick={async () => {
                        setOpen(true);
                      }}
                      className="flex flex-col gap-2"
                    >
                      Rent Now
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </section>
        {!isLoading && filteredVehicles?.length === 0 && (
          <div className="flex h-52 items-center justify-center">
            <p className="text-lg font-medium text-slate-600">
              No vehicles published yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Vehicles;
