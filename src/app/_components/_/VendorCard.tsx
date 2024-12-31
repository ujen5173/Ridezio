import { Dot, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { bricolage } from "~/app/utils/font";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { type GetPopularShops } from "~/server/api/routers/business";

type Props = {
  shop: GetPopularShops[number];
  separatorColor?: string;
  separatorHeight?: string;
};

const VendorCard = ({ separatorHeight, separatorColor, shop }: Props) => {
  return (
    <div className={cn(bricolage.className, "relative z-10")}>
      <div className="relative">
        <Carousel
          opts={{
            dragFree: false,
            watchDrag: false,
          }}
          draggable={false}
          className="w-full"
        >
          <CarouselPrevious />
          <CarouselNext />
          <CarouselContent>
            {shop.images
              .sort((a, b) => a.order - b.order)
              .map((image, index) => (
                <CarouselItem key={index} className="relative">
                  <Link href={`/vendor/${shop.slug}`}>
                    <Image
                      alt={`${shop.name}'s Images`}
                      width={450}
                      height={450}
                      layout="fixed"
                      priority
                      className="m-auto h-full w-full rounded-md object-fill mix-blend-multiply"
                      key={index}
                      src={image.url}
                    />
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>

      <Link href={`/vendor/${shop.slug}`}>
        <div className="pt-4">
          <h1 className="mb-2 line-clamp-1 text-lg font-medium">{shop.name}</h1>
          <div className="select-none">
            <div className="mb-4 flex items-center">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-yellow-500 stroke-yellow-500" />
                <span className="text-sm">
                  {+shop.rating <= 0 ? "N/A" : +shop.rating}
                </span>
              </div>
              <Dot size={18} />
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span className="line-clamp-1 text-sm">
                  {shop.location?.city}
                </span>
              </div>
            </div>
            <div>
              <h4 className="mb-1 text-sm uppercase">Available Vehicles</h4>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {shop.availableVehiclesTypes.map((type, index) => {
                  return (
                    <div
                      key={index + shop.id}
                      className={cn(
                        "flex items-center gap-1 rounded-sm border px-2 py-1 font-medium",
                        `${type}-badge`,
                      )}
                    >
                      <div
                        className={cn("size-1.5 rounded-full", {
                          "bg-car-color": type === "car",
                          "bg-e-car-color": type === "e-car",
                          "bg-bike-color": type === "bike",
                          "bg-bicycle-color": type === "bicycle",
                          "bg-e-bicycle-color": type === "e-bicycle",
                          "bg-scooter-color": type === "scooter",
                        })}
                      ></div>
                      <span className="text-xs uppercase">{type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {Math.floor((shop.satisfiedCustomers ?? 0) / 5) > 5 && (
              <>
                <Separator
                  className={cn(
                    "mt-4",
                    separatorColor ?? "bg-pink-500",
                    separatorHeight ?? "h-1",
                  )}
                />
                <div className="py-2">
                  <span className="text-sm">
                    {Math.floor((shop.satisfiedCustomers ?? 0) / 5) * 5}+
                    satisfied customers
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VendorCard;
