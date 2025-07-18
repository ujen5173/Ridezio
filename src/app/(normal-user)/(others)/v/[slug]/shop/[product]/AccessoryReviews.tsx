"use client";

import { Dot, Star } from "lucide-react";
import Image from "next/image";
import { chakra_petch } from "~/app/utils/font";
import { Skeleton } from "~/components/ui/skeleton";
import { formatDate } from "~/lib/date";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const AccessoryReviews = ({
  rating,
  ratingCount,
  accessoryId,
}: {
  rating: number;
  ratingCount: number;
  accessoryId: string | undefined;
}) => {
  const { data: allReviews, isLoading } = api.accessories.getReviews.useQuery(
    {
      accessoryId: accessoryId!,
    },
    {
      enabled: !!accessoryId,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <section className="p-4">
      <div className="mx-auto max-w-[1240px] py-10">
        <div className="mb-10">
          <h1
            className={cn(
              "mb-4 text-2xl font-semibold text-slate-700 sm:text-3xl md:text-4xl",
              chakra_petch.className,
            )}
          >
            What People Say?
          </h1>
          <p className="lg:7/12 w-full text-lg text-slate-600 md:w-9/12">
            Hear from our users and discover what they think of us!
          </p>
        </div>
        <div className="text-md mb-10 flex items-center font-medium text-slate-800 sm:text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Star size={24} className="fill-yellow-500 stroke-yellow-500" />
            <span>{parseFloat(rating.toString()).toFixed(1)}</span>
          </div>
          <Dot size={24} className="fill-slate-800 stroke-slate-800" />
          <span>{ratingCount} reviews</span>
        </div>
        <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {isLoading ? (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-4 w-40" />
                    <Skeleton className="mb-2 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-2 h-20 w-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-4 w-40" />
                    <Skeleton className="mb-2 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-2 h-20 w-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-4 w-40" />
                    <Skeleton className="mb-2 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-2 h-20 w-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-4 w-40" />
                    <Skeleton className="mb-2 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-2 h-20 w-full" />
              </div>
            </>
          ) : (
            (allReviews ?? []).length > 0 &&
            allReviews?.map((review) => (
              <div key={review.id}>
                <div className="mb-4 flex items-center gap-2">
                  <Image
                    src={review.user.image!}
                    width={200}
                    height={200}
                    className="size-10 rounded-full object-cover"
                    alt="User Profile"
                  />
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">
                      {review.user.name}
                    </h2>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {Array(5)
                          .fill(" ---")
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={`${
                                i < review.rating
                                  ? "fill-yellow-500 stroke-yellow-500"
                                  : "stroke-yellow-500"
                              }`}
                            />
                          ))}
                      </div>
                      <Dot
                        size={10}
                        className="fill-slate-800 stroke-slate-800"
                      />
                      <span className="text-sm text-slate-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="line-clamp-4 text-base text-slate-700">
                    {review.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {allReviews?.length === 0 && (
          <div className="flex h-52 w-full items-center justify-center">
            <p className="text-center text-lg">No reviews yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccessoryReviews;
