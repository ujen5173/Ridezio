"use client";

import { useEffect } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import VendorCardLoading from "~/app/_components/_/VendorCardLoading";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import VendorCard from "../../../_components/_/VendorCard";

const Bookmarks = () => {
  const { data, isLoading, error } = api.user.getBookmarks.useQuery();

  useEffect(() => {
    if (error) {
      toast({
        title: "Something went wrong while fetching bookmarks",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <>
      <HeaderHeight />
      <section className="min-h-[50vh] w-full">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4">
            <h1 className={cn("text-4xl font-semibold")}>Bookmarks</h1>
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
          {(data ?? []).length === 0 && (
            <div className="py-6">
              <p className="text-center text-lg font-semibold text-gray-500 md:text-xl">
                No bookmarks added!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Bookmarks;
