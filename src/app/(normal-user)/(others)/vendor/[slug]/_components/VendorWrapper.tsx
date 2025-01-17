"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { UserBookingProcessing } from "~/app/_components/dialog-box/BookingProcessing";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import useViewTracker from "~/hooks/use-view-counter";
import { type GetVendorType } from "~/server/api/routers/business";
import { decodeEsewaSignature } from "~/server/utils/generate-payment-token";
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

type PaymentBase64Data = {
  status: "COMPLETE" | "PENDING" | "FAILED";
  transaction_uuid: string;
};

type RentalBookingData = {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  quantity: number;
  paymentId: string;
  notes: string;
};

const VendorWrapper = ({
  data,
  bookingProcessData,
  paymentMethod = "cash",
  slug,
}: {
  data: GetVendorType;
  slug: string;
  paymentMethod: "cash" | "online";
  bookingProcessData: string | undefined;
}) => {
  const { data: bookingsDetails } = api.business.getBookingsDetails.useQuery(
    {
      businessId: data!.id,
    },
    {
      enabled: !!data,
    },
  );

  useViewTracker({
    slug,
    cooldownHours: 1,
  });

  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: rentUpdateStatusMutation, isError } =
    api.rental.rent.useMutation();
  const hasProcessedPayment = useRef(false);
  const [bookingModelOpen, setBookingModelOpen] =
    useState<boolean>(!!bookingProcessData);

  const { data: user } = useSession();

  const processPayment = useCallback(async () => {
    setLoading(true);

    if (!bookingProcessData) {
      return;
    }

    try {
      // Decode payment signature
      const decodedPaymentHash = decodeEsewaSignature(bookingProcessData);
      const paymentData = JSON.parse(decodedPaymentHash) as PaymentBase64Data;

      // Validate payment status
      if (paymentData.status !== "COMPLETE") {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Payment initiation failed. Please try again.",
        });
        return false;
      }

      // Retrieve local storage booking data
      const localStorageObject = localStorage.getItem("rental");
      if (!localStorageObject) {
        return false;
      }

      // Parse local storage data
      const parsedData = JSON.parse(localStorageObject) as RentalBookingData;

      // Validate transaction
      if (parsedData.paymentId !== paymentData.transaction_uuid) {
        toast({
          variant: "destructive",
          title: "Booking mismatch",
          description: "Please contact support for assistance.",
        });
        return false;
      }

      // Update rental status
      const res = await rentUpdateStatusMutation({
        ...parsedData,
        paymentMethod: "online",
        startDate: new Date(parsedData.startDate),
        endDate: new Date(parsedData.endDate),
        paymentStatus: "complete",
      });

      if (res) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been successfully processed.",
        });
        toast({
          title: "Wait for Booking Confirmation",
          description: "Please wait while vendor validates your booking.",
        });
        return true;
      }

      return false;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Payment Processing Failed",
        description: "Please contact support or vendor.",
      });
      router.push(pathname, { scroll: false });
    } finally {
      setLoading(false);
      localStorage.removeItem("rental");
      router.push(pathname, { scroll: false });
    }
  }, []);

  useEffect(() => {
    if (paymentMethod === "online") {
      if (bookingProcessData && !hasProcessedPayment.current) {
        const handlePayment = async () => {
          hasProcessedPayment.current = true;
          await processPayment();
        };

        void handlePayment();
      }
    } else {
      if (bookingProcessData) {
        setBookingModelOpen(true);
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
          <UserBookingProcessing
            {...{
              bookingModelOpen,
              setBookingModelOpen,
              loading,
              isError,
              paymentMethod,
            }}
          />
        )}
        {bookingsDetails !== null &&
          bookingsDetails !== undefined &&
          !!data && (
            <Bookings
              vendorId={data?.id}
              vendorUserId={data?.ownerId}
              open={open}
              fromVendor={data.ownerId === user?.user.id ?? false}
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
    </VendorContext.Provider>
  );
};

export default VendorWrapper;
