import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

const BookingProcessing = ({
  bookingModelOpen,
  setBookingModelOpen,
  isError,
  user,
  verifyingPayment,
  processingBooking,
}: {
  bookingModelOpen: boolean;
  setBookingModelOpen: (open: boolean) => void;
  isError: boolean;
  user: "USER" | "VENDOR";
  verifyingPayment: boolean;
  processingBooking: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const processStage = useCallback(() => {
    if (isError) return "error";
    if (verifyingPayment) return "verifying";
    if (processingBooking) return "processing-booking";
    return "success";
  }, [isError, processingBooking, verifyingPayment]);

  const renderContent = () => {
    switch (processStage()) {
      case "error":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertTriangle className="text-rose-500" size={64} />
            <h2 className="text-2xl font-bold text-rose-600">Booking Failed</h2>
            <p className="text-slate-600">
              Something went wrong while booking. Please contact support and the
              vendor.
            </p>
            <Button
              variant="destructive"
              onClick={() => setBookingModelOpen(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        );

      case "verifying":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="animate-spin text-green-500" size={64} />
            <h2 className="text-2xl font-semibold text-slate-700">
              Verifying Payment
            </h2>
            <p className="text-slate-600">
              Please wait while we verify your payment. This might take a
              moment.
            </p>
          </div>
        );

      case "processing-booking":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="italic text-slate-600">
              Payment Verification Successful. Proceeding to book your order.
            </p>
            <Loader2 className="animate-spin text-green-500" size={64} />
            <h2 className="text-2xl font-semibold text-slate-700">
              Processing Booking
            </h2>
            <p className="text-slate-600">
              Please wait while we process your booking. This might take a
              moment.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <DotLottieReact
              src="https://lottie.host/9611fd9a-a78c-4e56-b796-5a6910970759/Nazs6eX5F6.lottie"
              autoplay
              speed={1.5}
              className="h-32 w-32 object-cover"
            />
            <h1 className="text-3xl font-bold text-sky-600">
              Booking Successful
            </h1>

            {user === "USER" && (
              <p className="text-lg italic text-slate-600">
                You will get a confirmation email shortly. Please wait for the
                vendor to confirm your booking.
              </p>
            )}

            <div className="flex space-x-4">
              <Link href="/orders">
                <Button variant="primary">Go to Orders</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setBookingModelOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={bookingModelOpen}
      onOpenChange={(change) => {
        setBookingModelOpen(change);
        router.push(pathname, { scroll: false });
      }}
    >
      <DialogContent
        hideClose
        className="overflow-hidden px-8 py-16 text-center sm:max-w-[500px]"
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default BookingProcessing;
