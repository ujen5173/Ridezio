"use client";

import { ArrowRight, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";
import HeaderSearch from "./HeaderSearch";
import LoginButton from "./LoginButton";
import SignOut from "./signout";

type Location = {
  address: {
    country: string;
    country_code: string;
    county: string;
    state: string;
    name: string;
  };
  boundingBox: Record<number, string>;
  class: string;
  display_name: string;
  display_place: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  place_id: string;
  osm_type: string;
  type: string;
  display_address: string;
};

const Header = ({ pth = "/" }: { pth?: string }) => {
  const { data } = useSession();
  const { width } = useWindowDimensions();

  const theme =
    pth === "/"
      ? "text-slate-700 hover:text-slate-600 sm:text-slate-100 sm:hover:text-slate-200"
      : "text-slate-800 hover:text-slate-700";

  return (
    <header
      className={cn(
        "left-0 top-0 z-[45] w-full border-b",
        pth === "/search" ? "fixed" : "absolute",
        pth === "/" ? "border-transparent" : "border-border bg-white shadow-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1440px] items-stretch justify-between gap-6 px-4 md:border-none",
        )}
      >
        <div className="flex h-auto flex-1 items-center space-x-0 py-2 md:py-4">
          <div className="flex items-center gap-2 py-2 md:hidden md:py-4">
            <Sheet>
              <SheetTrigger
                className={buttonVariants({
                  variant: "link",
                  size: "icon",
                  className: "focus-visible:ring-0",
                })}
              >
                <Menu
                  size={26}
                  className={cn(
                    pth === "/"
                      ? "text-slate-600 md:text-slate-100"
                      : "text-slate-600",
                  )}
                />
              </SheetTrigger>
              <SheetContent className="flex flex-col">
                <SheetHeader>
                  <SheetTitle className="mb-8">
                    <Logo tw="h-6 fill-pink-500" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col">
                  <ul className="pb-5">
                    <li>
                      <Link
                        href="/"
                        className="inline-flex w-full items-center justify-between py-2 text-base font-medium text-slate-800 hover:underline"
                      >
                        <span>Explore</span>
                        <ArrowRight className="text-slate-800" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-flex w-full items-center justify-between py-2 text-base font-medium text-slate-800 hover:underline"
                      >
                        <span>Locations</span>
                        <ArrowRight className="text-slate-800" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-flex w-full items-center justify-between py-2 text-base font-medium text-slate-800 hover:underline"
                      >
                        <span>For Business</span>
                        <ArrowRight className="text-slate-800" />
                      </Link>
                    </li>
                  </ul>

                  <Separator />

                  <ul className={cn("mb-10 flex-1 py-5")}>
                    <li>
                      <Link
                        href="/"
                        className="inline-block py-2 text-base font-medium text-slate-700 hover:underline"
                      >
                        Reserve bicycle
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-block py-2 text-base font-medium text-slate-700 hover:underline"
                      >
                        Reserve Bike
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-block py-2 text-base font-medium text-slate-700 hover:underline"
                      >
                        Reserve Scooter
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-block py-2 text-base font-medium text-slate-700 hover:underline"
                      >
                        <span>Reserve Car</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Logo
            tw={cn(
              "h-6",
              pth === "/" ? "fill-secondary md:fill-white" : "fill-secondary",
            )}
          />
        </div>

        {pth !== "/" && <HeaderSearch />}

        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {data ? (
                <div className="flex items-center gap-4">
                  {data?.user.role === "VENDOR" && (
                    <Link href="/dashboard">
                      <Button variant={"outline"} size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <DropdownMenu>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:block">
                        <span className={cn(theme, "text-sm font-semibold")}>
                          {data.user.name}
                        </span>
                      </div>
                      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {data.user.image && (
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              className="object-cover"
                              src={data.user.image}
                            />
                            <AvatarFallback className="border border-border text-xs font-semibold">
                              {data.user.name
                                ?.split(" ")
                                .map((e) => e[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="end" className="w-56">
                      <div>
                        <DropdownMenuLabel>
                          <div className="">
                            <div className="hidden sm:block">
                              <span>{data.user.name}</span>
                            </div>
                            <div className="">
                              <span className="text-xs text-slate-600">
                                {data.user.email}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/orders">
                        <DropdownMenuItem>Orders</DropdownMenuItem>
                      </Link>
                      <Link href="/reviews">
                        <DropdownMenuItem>Reviews</DropdownMenuItem>
                      </Link>
                      <Link href="/favourite">
                        <DropdownMenuItem>Favourites</DropdownMenuItem>
                      </Link>
                      <Link href="/settings">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <SignOut />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-end md:hidden">
                    <LoginButton>
                      <Button variant={"primary"} size="default">
                        Login / Sign up
                      </Button>
                    </LoginButton>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <LoginButton>
                      <Button
                        variant={"link"}
                        className={cn(
                          pth === "/" ? "text-slate-100" : "text-slate-700",
                        )}
                      >
                        Login / Sign up
                      </Button>
                    </LoginButton>
                    <LoginButton>
                      <Button
                        variant={pth === "/" ? "outline-primary" : "primary"}
                        className={cn(
                          "font-semibold uppercase",
                          pth === "/" && "text-slate-100",
                        )}
                      >
                        Start Renting
                      </Button>
                    </LoginButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
