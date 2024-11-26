"use client";

import {
  Dot,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";

const Footer = () => {
  return (
    <section className="w-full bg-tertiary">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex flex-col items-center justify-center border-b border-pink-400/40 py-20">
          <h1
            className={cn(
              "mb-2 text-center text-4xl font-semibold text-slate-100",
              chakra_petch.className,
            )}
          >
            Get the newest updates in your inbox
          </h1>
          <p className="mb-6 text-center text-lg text-slate-200">
            <Balancer>
              Get exclusive offers, new shops, events and more delivered right
              to your inbox.
            </Balancer>
          </p>

          <div className="flex w-full items-center gap-2 sm:w-min">
            <Input
              className="w-full border-rose-500/20 bg-rose-500/20 text-slate-200 placeholder:text-slate-200 sm:w-96"
              placeholder="Your email address"
              type="email"
            />
            <Button variant={"secondary"}>Subscribe</Button>
          </div>
        </div>

        <div className="border-b border-pink-400/40 py-20">
          <div className="flex flex-wrap justify-between gap-20">
            <div className="w-full space-y-10 md:w-auto">
              <p className="text-slate-200">
                Supporting vehicle rental service <br /> around the globe since
                2024
              </p>
              <div>
                <h6 className="mb-2 text-base text-slate-200">Follow us!</h6>
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    title="Facebook"
                    className="flex size-10 items-center justify-center rounded-sm bg-pink-600/20 transition hover:bg-pink-600/30"
                  >
                    <Facebook size={24} className="text-slate-50" />
                  </Link>
                  <Link
                    href="/"
                    title="Twitter"
                    className="flex size-10 items-center justify-center rounded-sm bg-pink-600/20 transition hover:bg-pink-600/30"
                  >
                    <Twitter size={24} className="text-slate-50" />
                  </Link>
                  <Link
                    href="/"
                    title="Youtube"
                    className="flex size-10 items-center justify-center rounded-sm bg-pink-600/20 transition hover:bg-pink-600/30"
                  >
                    <Youtube size={24} className="text-slate-50" />
                  </Link>
                  <Link
                    href="/"
                    title="Instagram"
                    className="flex size-10 items-center justify-center rounded-sm bg-pink-600/20 transition hover:bg-pink-600/30"
                  >
                    <Instagram size={24} className="text-slate-50" />
                  </Link>
                  <Link
                    href="/"
                    title="Linkedin"
                    className="flex size-10 items-center justify-center rounded-sm bg-pink-600/20 transition hover:bg-pink-600/30"
                  >
                    <Linkedin size={24} className="text-slate-50" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-16 sm:flex-row md:w-auto">
              <div>
                <h2 className="text-lg text-slate-300">Discover</h2>
                <ul className="mt-4 flex flex-col gap-2 text-slate-100">
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Ride a Bicycle
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Ride a Bike
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Ride a Car
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg text-slate-300">Contact</h2>
                <ul className="mt-4 flex flex-col gap-2 text-slate-100">
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Help & Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Terms and Condition
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/"
                    >
                      Get in Touch
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-20">
            <Logo tw="h-14 sm:h-20 md:h-26 lg:h-32 fill-pink-400" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 py-10 md:flex-row">
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} disabled>
                  रु Nepali Ruppee (NPR)
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Currency</DialogTitle>
                  <DialogDescription>
                    All prices wil be shown in the selected currency.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="npr">NPR</SelectItem>
                        <SelectItem value="euro">EURO</SelectItem>
                        <SelectItem value="yen">YEN</SelectItem>
                        <SelectItem value="won">WON</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" variant={"secondary"}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-100 sm:flex-nowrap sm:justify-normal sm:gap-0">
            <li>Terms of use</li>
            <Dot className="hidden md:block" size={20} />
            <li>Privacy Policy</li>
            <Dot className="hidden md:block" size={20} />
            <li>Cookie Policy</li>
            <Dot className="hidden md:block" size={20} />
            <li>© 2024 Velocit, Inc. All Rights Reserved.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Footer;
