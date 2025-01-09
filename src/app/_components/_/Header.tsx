"use client";

import { ArrowRight, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";
import LoginButton from "../dialog-box/LoginButton";
import HeaderSearch from "./HeaderSearch";
import SignOut from "./signout";

const Header = ({ pth = "/" }: { pth?: string }) => {
  const { data } = useSession();

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
                      <SheetClose className="w-full">
                        <Link
                          href="/search"
                          className="inline-flex w-full items-center justify-between py-2 text-base font-medium text-slate-800 transition hover:text-secondary hover:underline"
                        >
                          <span>Explore</span>
                          <ArrowRight className="text-inherit" />
                        </Link>
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose className="w-full">
                        <Link
                          href="/auth/signin"
                          className="inline-flex w-full items-center justify-between py-2 text-base font-medium text-slate-800 transition hover:text-secondary hover:underline"
                        >
                          <span>For Business</span>
                          <ArrowRight className="text-inherit" />
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>

                  <Separator />

                  <ul className={cn("mb-10 flex-1 py-5")}>
                    <li>
                      <Link
                        href="/search?vehicleType=bicycle"
                        className="block py-2 text-base font-medium text-slate-700 transition hover:text-secondary hover:underline"
                      >
                        <SheetClose className="w-full text-left">
                          Reserve bicycle
                        </SheetClose>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search?vehicleType=bike"
                        className="block py-2 text-base font-medium text-slate-700 transition hover:text-secondary hover:underline"
                      >
                        <SheetClose className="w-full text-left">
                          Reserve Bike
                        </SheetClose>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search?vehicleType=scooter"
                        className="block py-2 text-base font-medium text-slate-700 transition hover:text-secondary hover:underline"
                      >
                        <SheetClose className="w-full text-left">
                          Reserve Scooter
                        </SheetClose>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search?vehicleType=car"
                        className="block py-2 text-base font-medium text-slate-700 transition hover:text-secondary hover:underline"
                      >
                        <SheetClose className="w-full text-left">
                          <span>Reserve Car</span>
                        </SheetClose>
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
                        <span
                          className={cn(
                            pth === "/"
                              ? "text-slate-700 hover:text-slate-600 md:text-slate-100 md:hover:text-slate-200"
                              : "text-slate-800 hover:text-slate-700",
                            "text-sm font-semibold",
                          )}
                        >
                          {data.user.name}
                        </span>
                      </div>
                      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {data.user.image && (
                          <div
                            style={{
                              backgroundImage: `url(${data.user.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            className="size-10 rounded-full object-cover object-center"
                          />
                        )}
                      </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="end" className="w-56">
                      <div>
                        <DropdownMenuLabel>
                          <div className="">
                            <div className="block">
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
                      {data.user.role === "USER" && (
                        <>
                          <Link href="/orders">
                            <DropdownMenuItem>Orders</DropdownMenuItem>
                          </Link>
                          <Link href="/reviews">
                            <DropdownMenuItem>Reviews</DropdownMenuItem>
                          </Link>
                          <Link href="/favourite">
                            <DropdownMenuItem>Favourites</DropdownMenuItem>
                          </Link>
                        </>
                      )}
                      <Link
                        href={
                          data.user.role === "USER"
                            ? "/settings"
                            : "/vendor/profile"
                        }
                      >
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
