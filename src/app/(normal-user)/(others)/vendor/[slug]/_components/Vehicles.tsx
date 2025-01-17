"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import VehicleDetailView from "~/app/_components/dialog-box/VehicleDetailView";
import { chakra_petch } from "~/app/utils/font";
import { OptimizedImage } from "~/components/ui/optimized-image";
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
        enabled: !!slug,
        refetchOnWindowFocus: false,
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
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10 flex items-center justify-between gap-10">
          <h1
            className={cn(
              "mb-4 text-3xl font-semibold text-slate-700 md:text-4xl",
              chakra_petch.className,
            )}
          >
            Pick Your Ride
          </h1>
          <div className="hidden sm:block">
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
        </div>

        <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            <>
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </>
          ) : (
            (filteredVehicles ?? [])?.map((vehicle, index) => (
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
                    <div className="aspect-[16/10] w-auto">
                      <OptimizedImage
                        alt={vehicle.name}
                        width={850}
                        height={570}
                        priority={index === 0}
                        quality={75}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="aspect-video w-full rounded-md object-cover mix-blend-multiply"
                        loading={index === 0 ? "eager" : "lazy"}
                        src={
                          (vehicle.images ?? []).sort(
                            (a, b) => a.order - b.order,
                          )[0]?.url ?? "/vehicle-placeholder.png"
                        }
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
                        NPR{" "}
                        {Intl.NumberFormat("en-IN").format(
                          vehicle.basePrice ?? 0,
                        )}{" "}
                        <span className="text-base font-normal">/day</span>
                      </h2>
                    </div>
                  </div>
                </Link>

                <VehicleDetailView vehicle={vehicle} setOpen={setOpen} />
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
