"use client";
import { Instagram, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import { chakra_petch } from "~/app/utils/font";
import { cn } from "~/lib/utils";
import useVendorDetailsContext from "../hooks/useVendorDetails";

const Locations = () => {
  const { vendor } = useVendorDetailsContext();

  return (
    <section>
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10">
          <h1
            className={cn(
              "mb-4 text-3xl font-semibold md:text-4xl",
              chakra_petch.className,
            )}
          >
            Visit Us
          </h1>
          <p className="lg:7/12 hidden w-full text-lg text-slate-600 sm:block md:w-9/12">
            Visit one of our convenient branches for quick, personalized
            service. Find your nearest location below and enjoy a seamless
            experience tailored to you.
          </p>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="group flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-md border border-border bg-white transition group-hover:bg-slate-100">
              <MapPin size={25} className="text-slate-600" />
            </div>
            <div>
              <p className="text-base text-foreground">
                Locations (<span className="underline">1</span>)
              </p>
              <p className="text-base font-medium text-slate-600">
                {vendor?.location.address}
              </p>
            </div>
          </div>
          <div className="group flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-md border border-border bg-white transition group-hover:bg-slate-100">
              <Phone size={25} className="text-slate-600" />
            </div>
            <div>
              <p className="text-base text-foreground">Phone Number</p>
              <p className="text-base font-medium text-slate-600">
                {vendor?.phoneNumbers.join(", ")}
              </p>
            </div>
          </div>

          <Link
            target="_blank"
            href={`https://www.instagram.com/${vendor?.instagramHandle ?? ""}`}
          >
            <div className="group flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-md border border-border bg-white transition group-hover:bg-slate-100">
                <Instagram size={25} className="text-slate-600" />
              </div>
              <div>
                <p className="text-base text-foreground">Instagram</p>
                <p className="text-base font-medium text-slate-600">
                  {vendor?.instagramHandle ?? "N/A"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <iframe
          src={vendor?.location.map}
          className="h-[40rem] w-full rounded-md border-none"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default Locations;
