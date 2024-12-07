"use client";

import { motion } from "framer-motion";
import { ExternalLink, Loader } from "lucide-react";
import Link from "next/link";
import { notFound, usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { toast } from "~/hooks/use-toast";
import { type GetVendorType } from "~/server/api/routers/business";
import { decodeEsewaSignature } from "~/server/utils/generate-payment-token";
import { api } from "~/trpc/react";
import Bookings from "./Bookings";
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
}: {
  data: GetVendorType;
  bookingProcessData: string | undefined;
}) => {
  const [bookingsDetails] = api.business.getBookingsDetails.useSuspenseQuery({
    businessId: data!.id,
  });

  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: rentUpdateStatusMutation, isError } =
    api.rental.rent.useMutation();
  const hasProcessedPayment = useRef(false);
  const [bookingModelOpen, setBookingModelOpen] =
    useState<boolean>(!!bookingProcessData);

  const processPayment = async () => {
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
  };

  useEffect(() => {
    if (bookingProcessData && !hasProcessedPayment.current) {
      const handlePayment = async () => {
        hasProcessedPayment.current = true;
        await processPayment();
      };

      void handlePayment();
    }
  }, [bookingProcessData, router, pathname]);

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
          <Dialog open={bookingModelOpen} onOpenChange={setBookingModelOpen}>
            <DialogContent className="py-20 text-center sm:max-w-[625px]">
              {loading && (
                <div className="mb-4">
                  <h1 className="mb-2 text-3xl font-semibold text-green-500">
                    Payment successful
                  </h1>

                  <p className="text-lg italic text-slate-600">
                    Your payment has been successfully processed.
                  </p>
                </div>
              )}

              <div>
                {isError ? (
                  <div className="text-red-500">
                    Something went wrong while booking. Please contact support
                    and the vendor.
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader size={24} className="animate-spin text-slate-700" />
                    <span className="text-slate-700">
                      Booking in progress...
                    </span>
                  </div>
                ) : (
                  <div className="">
                    <h1 className="mb-4 text-5xl font-bold text-green-600">
                      Booking successful.
                    </h1>
                    <p className="mb-10 text-lg font-medium italic text-slate-600">
                      You will get a confirmation email shortly. Please wait for
                      the vendor to confirm your booking.
                    </p>
                    <div className="flex justify-end">
                      <Link href="/orders">
                        <Button variant={"primary"}>Go to Orders</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        {bookingsDetails !== null &&
          bookingsDetails !== undefined &&
          !!data && (
            <Bookings
              vendorId={data?.id}
              open={open}
              fromVendor={false}
              setOpen={setOpen}
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

        <div className="[&>section:nth-child(odd)]:bg-slate-50 [&>section]:px-4 [&>section]:py-16">
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
