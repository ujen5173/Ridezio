import { Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

const BookingProcessing = ({
  bookingModelOpen,
  setBookingModelOpen,
  loading,
  isError,
  paymentMethod,
  user,
}: {
  bookingModelOpen: boolean;
  setBookingModelOpen: (open: boolean) => void;
  loading: boolean;
  isError: boolean;
  paymentMethod: "cash" | "online";
  user: "USER" | "VENDOR";
}) => {
  return (
    <Dialog open={bookingModelOpen} onOpenChange={setBookingModelOpen}>
      <DialogContent className="py-20 text-center sm:max-w-[625px]">
        {paymentMethod === "cash" && user === "USER" && loading && (
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
              Something went wrong while booking. Please contact support and the
              vendor.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader size={24} className="animate-spin text-slate-700" />
              <span className="text-slate-700">Booking in progress...</span>
            </div>
          ) : (
            <div className="">
              <h1 className="mb-4 text-5xl font-bold text-green-600">
                Booking successful.
              </h1>
              {user === "USER" ? (
                <>
                  <p className="mb-10 text-lg font-medium italic text-slate-600">
                    You will get a confirmation email shortly. Please wait for
                    the vendor to confirm your booking.
                  </p>
                  <div className="flex justify-end">
                    <Link href="/orders">
                      <Button variant={"primary"}>Go to Orders</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex justify-end">
                  <Link href="/orders">
                    <Button variant={"primary"}>Go to Orders</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingProcessing;
