"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";
import { VendorContext } from "./VendorWrapper";

const Vehicles = () => {
  const { slug } = useParams();
  const { setOpen } = useContext(VendorContext);

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

  return (
    <section>
      <div className={cn("mx-auto max-w-[1240px]")}>
        <div className="mb-10 flex items-center justify-between gap-10">
          <h1 className={cn("text-2xl font-bold xs:text-3xl")}>
            Pick Your Ride
          </h1>
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
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
            (vehicles ?? [])?.map((vehicle) => (
              <Link
                href={{
                  query: {
                    vehicle: vehicle.name,
                    type: vehicle.type,
                    category: vehicle.category,
                  },
                }}
                key={vehicle.id}
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
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1" variant={"outline"}>
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1" variant={"primary"}>
                        Rent Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
        {!isLoading && vehicles?.length === 0 && (
          <div className="flex h-52 items-center justify-center">
            <p className="text-lg font-medium text-slate-600">
              No vehicles published yet. Please check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Vehicles;
