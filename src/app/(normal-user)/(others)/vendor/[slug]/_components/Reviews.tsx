import { Dot, Star } from "lucide-react";
import Image from "next/image";
import { chakra_petch } from "~/app/utils/font";
import { Skeleton } from "~/components/ui/skeleton";
import { formatDate } from "~/lib/date";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const Reviews = ({
  rating,
  ratingCount,
  businessId,
}: {
  rating: number;
  ratingCount: number;
  businessId: string | undefined;
}) => {
  const { data: allReviews, isLoading } = api.business.getReviews.useQuery(
    {
      businessId: businessId!,
    },
    {
      enabled: !!businessId,
    },
  );

  return (
    <section>
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10">
          <h1
            className={cn(
              "mb-4 text-4xl font-semibold",
              chakra_petch.className,
            )}
          >
            Reviews from customers
          </h1>
          <p className="lg:7/12 w-full text-lg text-slate-600 md:w-9/12">
            Get to know what our customers have to say about our services.
          </p>
        </div>
        <div className="mb-10 flex items-center text-xl font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Star size={24} className="fill-slate-800 stroke-slate-800" />
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
      </div>
    </section>
  );
};

export default Reviews;
