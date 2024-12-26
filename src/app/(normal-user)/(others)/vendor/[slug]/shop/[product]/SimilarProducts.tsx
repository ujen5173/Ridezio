"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import { api as trpc } from "~/trpc/react";
import AccessoriesCard from "../AccessoriesCard";

const SimilarProducts = ({ product }: { product: string }) => {
  const { data: similarProducts, isLoading } =
    trpc.accessories.getSimilarProducts.useQuery(
      {
        product: product,
      },
      {
        enabled: !!product,
        refetchOnWindowFocus: false,
      },
    );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1240px] py-8 sm:py-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1
            className={cn(
              "mb-4 text-3xl font-semibold md:text-4xl",
              chakra_petch.className,
            )}
          >
            Similar Products
          </h1>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={current === 0}
                className="size-8 border border-border bg-white hover:border-secondary/80 sm:size-10"
              >
                <ChevronLeft size={20} className="text-foreground" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={current === count - 1}
                className="size-8 border border-border bg-white hover:border-secondary/80 sm:size-10"
              >
                <ChevronRight size={20} className="text-foreground" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start" }}
          >
            <CarouselContent>
              {similarProducts?.map((accessory, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <AccessoriesCard accessory={accessory} slug={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Button variant={"outline"}>Explore all Accessories</Button>
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;
