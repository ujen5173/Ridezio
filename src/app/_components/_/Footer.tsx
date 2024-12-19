"use client";

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";

const Footer = () => {
  const { data: user } = useSession();

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
              defaultValue={user?.user?.email ?? undefined}
              disabled={!!user}
            />
            <Button disabled={!!user} variant={"secondary"}>
              {user ? "Already Subscribed" : "Subscribe"}
            </Button>
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
                      href="/search?vehicleType=bicycle"
                    >
                      Ride a Bicycle
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/search?vehicleType=bike"
                    >
                      Ride a Bike
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/search?vehicleType=car"
                    >
                      Ride a Car
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/auth/login"
                    >
                      Start Renting
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg text-slate-300">Company</h2>
                <ul className="mt-4 flex flex-col gap-2 text-slate-100">
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/terms-of-service"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/vendor-agggrement"
                    >
                      Vendor Aggrement
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/cookie-policy"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-slate-200 hover:underline"
                      href="/disclaimer"
                    >
                      Disclaimer
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

        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-slate-100">
            © {new Date().getFullYear()} Velocit, Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
