"use client";

import {
  Dot,
  ExternalLink,
  Instagram,
  Minus,
  Phone,
  Plus,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useLayoutEffect, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { extractDirectionsFromIframe } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import { type GetSingleAccessory } from "~/server/api/routers/accessories";

const ProductPage = ({ data }: { data: GetSingleAccessory }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [imageOrientation, setImageOrientation] = useState<
    "horizontal" | "vertical"
  >("vertical");

  const [quantity, setQuantity] = useState(1);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setImageOrientation("horizontal");
      } else {
        setImageOrientation("vertical");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data!.name,
    description: data!.description,
    image: data!.images?.[0]?.url,
    brand: {
      "@type": "Brand",
      name: data!.business?.name,
    },
    offers: {
      "@type": "Offer",
      price: data!.basePrice,
      priceCurrency: "NPR",
      availability:
        data!.inventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: data!.business?.name,
      },
    },
    aggregateRating: data!.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: data!.rating,
          reviewCount: data!.ratingCount,
        }
      : undefined,
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />

      <HeaderHeight />

      <section className="px-4">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-5 py-6 md:flex-row md:py-10 lg:gap-10 lg:py-16">
            <div className="mx-auto flex h-fit w-full flex-col-reverse gap-0 sm:w-10/12 md:w-6/12 lg:flex-row lg:gap-2">
              <div>
                <Carousel
                  orientation={imageOrientation}
                  setApi={setApi}
                  className="w-full"
                >
                  <CarouselContent
                    className={cn(
                      "max-h-[500px] py-2",
                      imageOrientation === "horizontal" ? "px-3" : "py-3",
                    )}
                  >
                    {data?.images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="relative basis-auto px-1 pt-2"
                      >
                        <button className="rounded-sm hover:ring-2 hover:ring-secondary hover:ring-offset-2">
                          <Image
                            onClick={() => {
                              api?.scrollTo(index);
                            }}
                            alt={`Images`}
                            width={450}
                            height={450}
                            layout="fixed"
                            className="size-16 cursor-pointer rounded-sm object-contain md:aspect-square"
                            key={index}
                            src={image.url}
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              <div className="relative h-min lg:flex-1">
                <Carousel setApi={setApi} className="w-full">
                  <CarouselPrevious />
                  <CarouselNext />
                  <CarouselContent className="h-full">
                    {data?.images.map((_, index) => (
                      <CarouselItem key={index} className="relative">
                        <div className="absolute inset-0 z-0 ml-4 animate-pulse rounded-md bg-slate-100"></div>
                        <Image
                          alt={`Images`}
                          width={1360}
                          height={765}
                          priority
                          layout="cover"
                          className="relative z-10 aspect-[16/12] rounded-md bg-transparent object-contain mix-blend-multiply"
                          key={index}
                          src={_.url}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="absolute right-2 top-2 hidden rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-slate-50">
                  Open
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-2 flex items-center">
                <h6 className="text-sm font-medium uppercase text-green-600">
                  {data?.category}
                </h6>
              </div>

              <h1 className="mb-4 text-4xl font-bold text-slate-700 sm:text-3xl">
                {data?.name}
              </h1>

              <div className="mb-4 flex items-center gap-1">
                <Star size={16} className="fill-yellow-500 stroke-yellow-500" />
                <span className="text-base">4.5 (400+ sold)</span>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-secondary md:text-3xl">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "NPR",
                    }).format(data?.basePrice ?? 0)}
                  </h1>
                </div>
                <div className="flex items-center rounded-md border border-border">
                  <button
                    type="button"
                    disabled={quantity === 1}
                    onClick={() => setQuantity((prev) => prev - 1)}
                    className="p-2"
                  >
                    <Minus
                      size={16}
                      className="fill-slate-500 stroke-slate-500"
                    />
                  </button>
                  <input
                    type="text"
                    className="w-12 p-2 text-center text-xl font-medium text-slate-600 outline-none"
                    value={quantity}
                    min={1}
                    max={100}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0 && value <= 100) {
                        setQuantity(value);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2"
                  >
                    <Plus
                      size={16}
                      className="fill-slate-500 stroke-slate-500"
                    />
                  </button>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="mb-4 space-y-2">
                {(!!data?.colors || !!data?.sizes) && (
                  <Label>Select Options</Label>
                )}
                <div className="flex items-center gap-4 space-y-2">
                  {(data?.colors ?? []).length > 0 && (
                    <Select>
                      <SelectTrigger className="h-14 w-full px-4 py-2 text-base font-medium text-slate-700">
                        <SelectValue placeholder="Pick color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Colors</SelectLabel>
                          {(data?.colors ?? []).map((color, index) => (
                            <SelectItem key={index} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {(data?.sizes ?? []).length > 0 && (
                    <Select>
                      <SelectTrigger className="h-14 w-full px-4 py-2 text-base font-medium text-slate-700">
                        <SelectValue placeholder="Pick sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sizes</SelectLabel>
                          {(data?.sizes ?? []).map((size, index) => (
                            <SelectItem key={index} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  disabled
                  className="w-full uppercase"
                  variant={"primary"}
                >
                  Visit store to Buy it for (
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "NPR",
                  }).format((data?.basePrice ?? 0) * quantity)}
                  )
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-8 py-10 lg:flex-row lg:gap-16">
            <div className="flex-[2]">
              <h1 className="mb-8 text-3xl font-bold text-slate-700">
                More Details
              </h1>

              <div className="space-y-4">
                <div className="mb-10 flex flex-col gap-4">
                  <div className="w-40">
                    <p className="text-xl font-semibold text-slate-700">
                      Description
                    </p>
                  </div>
                  <div className="flex-1 text-justify">
                    <p
                      className="text-md text-slate-600 sm:text-lg"
                      dangerouslySetInnerHTML={{
                        __html: data?.description ?? "N/A",
                      }}
                    ></p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-40">
                    <p className="text-xl font-semibold text-slate-700">
                      Delivery
                    </p>
                  </div>
                  <div className="flex-1 text-justify">
                    <p className="text-md italic text-slate-600 sm:text-lg">
                      Please visit the store to purchase.
                    </p>
                  </div>
                </div>
                {data?.business!.instagramHandle && (
                  <div className="flex gap-4">
                    <div className="w-40">
                      <p className="text-lg font-semibold text-slate-600">
                        Instagram
                      </p>
                    </div>
                    <div className="flex-1 text-justify">
                      <Link
                        className="inline-block text-lg text-secondary underline"
                        target="_blank"
                        href={`https://www.instagram.com/${data?.business.instagramHandle}`}
                      >
                        @{data?.business.instagramHandle}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full rounded-md border border-gray-200 bg-gray-50 p-4 lg:flex-1">
              <h1 className="mb-4 text-2xl font-semibold text-slate-700">
                About the Seller
              </h1>

              <div className="mb-4 flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={data?.business!.logo ?? "https://utfs.io/f/7"}
                    alt={data?.business!.name ?? "Business"}
                  />
                  <AvatarFallback>
                    {data
                      ?.business!.name?.split(" ")
                      .map((e) => e[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <Link href={`/v/${data?.business!.slug}`}>
                  <h4 className="text-md font-semibold text-slate-700 transition hover:text-secondary sm:text-lg">
                    {data?.business!.name}
                  </h4>
                </Link>
              </div>

              <div className="mb-6 flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="fill-yellow-500 stroke-yellow-500"
                  />
                  <span className="text-sm">
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                    {data?.business!.rating || "N/A"}
                    {(data?.business!.ratingCount ?? 0) > 0 &&
                      new Intl.NumberFormat("en-US").format(
                        data?.business!.ratingCount ?? 0,
                      ) + " sold"}
                  </span>
                </div>

                <Dot size={16} />

                <div className="flex items-center gap-1">
                  <Phone size={16} className="text-foreground" />
                  <span className="text-sm">
                    {data?.business!.phoneNumbers![0]}
                  </span>
                </div>

                {data?.business!.instagramHandle && (
                  <>
                    <Dot size={16} />
                    <Link
                      target="_blank"
                      href={`https://www.instagram.com/${data?.business.instagramHandle}`}
                    >
                      <div className="flex items-center gap-1 text-secondary hover:underline">
                        <Instagram size={16} className="text-inherit" />
                        <span className="text-sm">Instagram</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant={"secondary"} className="flex-1 gap-2">
                  <Link href={`/v/${data?.business!.slug}`}>View Vehicles</Link>
                </Button>
                <Button asChild variant={"outline"} className="flex-1 gap-2">
                  <Link
                    target="_blank"
                    href={extractDirectionsFromIframe(
                      data?.business!.location.map ?? "",
                    )}
                  >
                    <ExternalLink size={15} className="text-slate-700" />
                    View in Map
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
