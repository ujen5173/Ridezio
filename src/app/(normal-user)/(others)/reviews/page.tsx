"use client";
import { Dot, Edit, Star, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Button } from "~/components/ui/button";
import { OptimizedImage } from "~/components/ui/optimized-image";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { formatDate } from "~/lib/date";
import { cn } from "~/lib/utils";
import { type GetUserBusinessReviewType } from "~/server/api/routers/users";
import { api } from "~/trpc/react";
import OrdersLoading from "../orders/_components/OrdersLoading";

type TFiltered = "1 Star" | "2 Star" | "3 Star" | "4 Star" | "5 Star" | "all";

const Reviews = () => {
  const { data: user } = useSession();

  if (user?.user.role === "VENDOR") {
    redirect("/dashboard");
  }

  const { data: userReviews, isLoading } = api.user.businessReviews.useQuery();
  const [reviews, setReviews] = useState<GetUserBusinessReviewType>([]);
  const [filteredType, setFilteredType] = useState<TFiltered>("all");

  useEffect(() => {
    if (!isLoading && userReviews) {
      const filteredReviews = userReviews.filter((order) => {
        if (filteredType === "all") return true;
        return `${order.rating} Star` === filteredType;
      });
      setReviews(filteredReviews);
    }
  }, [filteredType, userReviews, isLoading]);

  return (
    <>
      <HeaderHeight />

      <section className={cn("w-full bg-slate-50 p-0")}>
        <div className="border-b border-border">
          <div className="mx-auto max-w-[1400px] px-4">
            <div className="p-0 pb-10 pt-20 md:px-4">
              <h1 className="text-4xl font-bold text-secondary">
                Your reviews
              </h1>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
              <ul className="flex w-max gap-1 pb-2">
                {["all", "1 Star", "2 Star", "3 Star", "4 Star", "5 Star"].map(
                  (status) => (
                    <li
                      key={status}
                      onClick={() => setFilteredType(status as TFiltered)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 border-b-4 px-3 py-2 font-semibold capitalize",
                        filteredType === status
                          ? "border-secondary text-secondary"
                          : "border-transparent text-slate-600",
                        "transition hover:border-secondary hover:text-secondary",
                      )}
                    >
                      {status !== "all" && (
                        <Star
                          size={20}
                          className="fill-yellow-500 stroke-yellow-500"
                        />
                      )}
                      {status}
                    </li>
                  ),
                )}
              </ul>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        <div className="w-full bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8">
            <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
              {isLoading ? (
                <>
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                </>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-md border border-border p-6 shadow-md"
                  >
                    <div className="mb-2">
                      <h1 className="mb-2 line-clamp-1 flex-1 text-2xl font-semibold text-slate-600">
                        Reviewed to:{" "}
                        <Link href={`/vendor/${review.business.slug}`}>
                          <span className="cursor-pointer font-bold text-secondary hover:underline">
                            {review.business.name}
                          </span>
                        </Link>
                      </h1>
                      <div className="mb-8">
                        <p className="mb-2 text-base uppercase text-slate-500">
                          Vehicle Rented:
                        </p>
                        <OptimizedImage
                          src={review.rental.vehicle.images[0]!.url}
                          alt={review.rental.vehicle.name}
                          className="rounded-md"
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={cn(
                                  "stroke-yellow-500",
                                  review.rating > i ? "fill-yellow-500" : "",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-lg font-medium text-slate-600">
                            {review.rating} Star
                          </span>
                        </div>
                        <Dot size={20} className="text-foreground" />
                        <span className="text-lg font-medium text-slate-600">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="mb-6 border-l-4 border-slate-200 pl-2">
                        <p className="text-base text-slate-700">
                          {review.review}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant={"outline"} size="sm" className="gap-1">
                          <Edit size={16} className="text-slate-600" />
                          Edit
                        </Button>
                        <Button
                          variant={"destructive"}
                          size="sm"
                          className="gap-1"
                        >
                          <Trash size={16} className="text-slate-100" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!isLoading && reviews.length === 0 && (
              <div className="flex h-96 items-center justify-center py-8">
                <p className="text-lg font-semibold text-slate-600">
                  No reviews yet!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;
