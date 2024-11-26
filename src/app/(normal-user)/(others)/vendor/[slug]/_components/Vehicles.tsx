"use client";

import { ListFilter, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { vendorDetail } from "~/lib/data";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { VendorContext } from "./VendorWrapper";

const Vehicles = () => {
  const { slug } = useParams();
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
  const { setOpen } = useContext(VendorContext);

  return (
    <section>
      <div className={cn("mx-auto max-w-[1240px]")}>
        <div className="mb-10 flex items-center justify-between gap-10">
          <h1 className={cn("text-2xl font-bold xs:text-3xl")}>
            Pick Your Ride
          </h1>
          <Button variant={"outline"} className="hover:bg-slate-50">
            <ListFilter size={16} className="mr-2" />
            <span>Filter</span>
          </Button>
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
                <div className="relative mb-2 flex items-center justify-center">
                  <Image
                    alt={`${vehicle.name}`}
                    width={450}
                    height={450}
                    layout="fixed"
                    className="h-60 w-auto max-w-full rounded-md object-cover mix-blend-multiply"
                    src={vehicle.images[0]!}
                  />
                </div>
                <div className="">
                  <h3 className="mb-4 line-clamp-1 text-xl font-semibold">
                    {vehicle.name}
                  </h3>
                  <div className="mb-2 flex items-center gap-1">
                    <Star
                      size={20}
                      className="fill-yellow-500 stroke-yellow-500"
                    />
                    <span>
                      <span className="text-lg font-medium">
                        {vendorDetail.rating} ({vendorDetail.ratingCount})
                      </span>
                    </span>
                  </div>

                  <div>
                    <p className="text-base font-medium uppercase">
                      Starting at
                    </p>

                    <h2 className="text-2xl font-semibold text-slate-700">
                      रु {vehicle.basePrice}{" "}
                      <span className="text-base font-normal">/day</span>
                    </h2>
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
