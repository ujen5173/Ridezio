"use client";

import Link from "next/link";
import { useEffect } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import VendorCardLoading from "~/app/_components/_/VendorCardLoading";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import VendorCard from "../../../_components/_/VendorCard";

const Favourite = () => {
  const { data, isLoading, error } = api.user.getFavourite.useQuery();

  useEffect(() => {
    if (error) {
      toast({
        title: "Something went wrong while fetching Favourite",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <>
      <HeaderHeight />
      <section className="w-full">
        <div className="mx-auto h-full max-w-[1440px] px-4 py-12">
          <div className="mb-4">
            <h1 className={cn("text-4xl font-semibold")}>Favourites</h1>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              <>
                <VendorCardLoading />
                <VendorCardLoading />
                <VendorCardLoading />
                <VendorCardLoading />
              </>
            ) : (
              data?.map((shop) => (
                <div key={shop.id}>
                  <VendorCard shop={shop} />
                </div>
              ))
            )}
          </div>
          {!isLoading && (data ?? []).length === 0 && (
            <div className="flex h-96 flex-col items-center justify-center gap-4 py-6">
              <p className="text-center text-lg font-semibold text-gray-500 md:text-xl">
                Your favourite bucket is empty. <br /> Add some rental shops to
                your favourite.
              </p>
              <Link href="/">
                <Button variant={"secondary"}>
                  <span>Explore Rentals around you</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Favourite;
