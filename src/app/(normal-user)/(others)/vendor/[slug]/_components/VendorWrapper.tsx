"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import BookingProcessing from "~/app/_components/dialog-box/BookingProcessing";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { toast } from "~/hooks/use-toast";
import useViewTracker from "~/hooks/use-view-counter";
import usePayment from "~/hooks/usePayment";
import { type GetVendorType } from "~/server/api/routers/business";
import { api } from "~/trpc/react";
import Bookings from "../../../../../_components/dialog-box/Bookings";
import Faqs from "./Faqs";
import Locations from "./Locations";
import Reviews from "./Reviews";
import Vehicles from "./Vehicles";
import VendorDetails from "./VendorDetails";

export const VendorContext = createContext<{
  vendor?: GetVendorType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {
    // do nothing
  },
});

const VendorWrapper = ({
  data,
  slug,
}: {
  data: GetVendorType;
  slug: string;
}) => {
  const paramsData = useSearchParams().get("data");
  const { transaction_id, pidx } = Object.fromEntries(
    useSearchParams().entries(),
  );

  const paymentMethod =
    paramsData === "success"
      ? "cash"
      : paramsData
        ? "esewa"
        : pidx
          ? "khalti"
          : "cash";

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const bookingProcessData = paramsData || transaction_id;

  const { data: bookingsDetails } = api.business.getBookingsDetails.useQuery(
    {
      businessId: data!.id,
    },
    {
      // data will be fresh for 24 hour
      staleTime: 3600000,
      enabled: !!data,
    },
  );

  useViewTracker({
    slug,
    cooldownHours: 1,
  });

  const router = useRouter();
  const pathname = usePathname();

  const hasProcessedPayment = useRef(false);
  const [bookingModelOpen, setBookingModelOpen] =
    useState<boolean>(!!bookingProcessData);

  const { data: user } = useSession();
  const { processPayment, verifyingPayment, processingBooking, isError } =
    usePayment({
      bookingProcessData,
      pathname,
      pidx,
      paymentMethod,
      userType: user?.user.role ?? "USER",
    });

  useEffect(() => {
    if (paymentMethod !== "cash") {
      if (bookingProcessData && !hasProcessedPayment.current) {
        const handlePayment = async () => {
          hasProcessedPayment.current = true;
          await processPayment();
        };

        void handlePayment();
      }
    }
  }, [bookingProcessData, router, pathname, processPayment]);

  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 550) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add JSON-LD structured data
  const vendorStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${env.NEXT_PUBLIC_APP_URL}/vendor/${data!.slug}`,
    name: data!.name,
    image: data!.images?.[0]?.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: data!.location.address,
      addressLocality: data!.location.city,
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data!.location.lat,
      longitude: data!.location.lng,
    },
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/${data!.slug}`,
    telephone: data!.phoneNumbers[0],
    priceRange: "₨₨-₨₨₨₨",
  };

  if (bookingsDetails === null) {
    toast({
      title: "Vendor Not Found",
      description:
        "Unable to get vendor bookings details. Please try again later.",
    });

    notFound();
  }

  return (
    <VendorContext.Provider
      value={{
        open: open,
        setOpen: setOpen,
        vendor: data,
      }}
    >
      <main className="relative w-full">
        {bookingModelOpen && (
          // Booking Model
          <BookingProcessing
            bookingModelOpen={bookingModelOpen}
            setBookingModelOpen={setBookingModelOpen}
            isError={isError}
            user={user?.user.role ?? "USER"}
            processingBooking={processingBooking}
            verifyingPayment={verifyingPayment}
          />
        )}
        {bookingsDetails !== null &&
          bookingsDetails !== undefined &&
          !!data && (
            <Bookings
              vendorUserId={data?.ownerId}
              open={open}
              fromVendor={data.ownerId === user?.user.id}
              setOpen={setOpen}
              paymentDetails={{
                merchantCode: data?.merchantCode ?? null,
              }}
              bookingsDetails={bookingsDetails}
            />
          )}

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button className="share-button w-full" variant={"outline"}>
            <ExternalLink size={16} className="mr-2" />
            Share
          </Button>
        </motion.div>

        <VendorDetails />

        <div className="[&>section:nth-child(odd)]:bg-slate-50 [&>section]:px-4 [&>section]:py-8 sm:[&>section]:py-16">
          <Vehicles />

          <Reviews
            rating={data?.rating ?? 0}
            ratingCount={data?.ratingCount ?? 0}
            businessId={data?.id}
          />

          <Faqs />

          <Locations />
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vendorStructuredData),
        }}
      />
    </VendorContext.Provider>
  );
};

export default VendorWrapper;
