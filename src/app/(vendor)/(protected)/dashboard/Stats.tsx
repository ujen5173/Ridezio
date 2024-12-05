"use client";

import { Loader, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { lato } from "~/app/utils/font";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { type GetDashboardInfo } from "~/server/api/routers/business";
import { decodeEsewaSignature } from "~/server/utils/generate-payment-token";
import { api } from "~/trpc/react";
import { Chart } from "./Chart";

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
  paymentMethod: "online" | "onsite" | null;
  notes: string;
};

const Stats = ({ data }: { data: GetDashboardInfo }) => {
  const router = useRouter();
  const pathname = usePathname();
  const paymentHash = useSearchParams().get("data");
  const [loading, setLoading] = useState(false);
  const { mutateAsync: rentUpdateStatusMutation, isError } =
    api.rental.rent.useMutation();
  const hasProcessedPayment = useRef(false);

  const [bookingModelOpen, setBookingModelOpen] = useState(false);

  useEffect(() => {
    if (paymentHash) {
      setBookingModelOpen(true);
    }
  }, [paymentHash]);

  const processPayment = async () => {
    setLoading(true);
    if (!paymentHash) {
      return;
    }

    try {
      // Decode payment signature
      const decodedPaymentHash = decodeEsewaSignature(paymentHash);
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
        startDate: new Date(parsedData.startDate),
        endDate: new Date(parsedData.endDate),
        paymentStatus: "complete",
      });

      if (res) {
        toast({
          title: "Booking Successful",
          description: "Your booking has been successfully processed.",
        });
        return true;
      }

      return false;
    } catch (err) {
      console.log({ err });
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
    if (paymentHash && !hasProcessedPayment.current) {
      const handlePayment = async () => {
        hasProcessedPayment.current = true;
        await processPayment();
      };

      void handlePayment();
    }
  }, [paymentHash, router, pathname]);

  return (
    <>
      {bookingModelOpen && (
        // Booking Model
        <Dialog
          open={bookingModelOpen}
          onOpenChange={(e) => setBookingModelOpen(e)}
        >
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
                  Something went wrong while booking. Please contact support and
                  the vendor.
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
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-end">
          <div className="flex-1">
            <h1 className={cn("text-2xl font-semibold md:text-3xl")}>
              {data.store.name}
            </h1>
          </div>
          {/* <Select>
            <SelectTrigger defaultValue={"24hr"} className="w-[180px]">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="24hr">Last 24 Hour</SelectItem>
                <SelectItem value="7day">Last 7 Days</SelectItem>
                <SelectItem value="30day">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
        <div
          className={cn("grid gap-4")}
          style={{
            gridTemplateColumns: "repeat(auto-fit,minmax(225px,1fr))",
          }}
        >
          <div className="relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
            <div>
              <p className="mb-2 text-base font-medium text-slate-500">
                Orders Today
              </p>
              <h1
                className={cn(
                  "mb-2 text-3xl font-semibold text-slate-800",
                  lato.className,
                )}
              >
                {data.metrics.orders_today}
              </h1>
            </div>
          </div>
          <div className="relative rounded-xl border border-slate-200 p-4">
            <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[0.8px]"></div>
            <div className="absolute right-2 top-2 z-10">
              <span
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-200",
                  "border border-input bg-background shadow-sm",
                  "h-8 cursor-default rounded-md px-3 text-xs",
                )}
              >
                Upcoming Feature
              </span>
            </div>
            <p className="mb-2 text-base font-medium text-slate-500">
              Store Views
            </p>
            <h1
              className={cn(
                "mb-2 text-3xl font-semibold text-slate-800",
                lato.className,
              )}
            >
              51k -
            </h1>
            <div className="relative z-[9] flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingUp size={16} className="text-green-600" />
              <span>12% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
              <div className="chart-blur-bottom absolute bottom-0 z-[5] h-6 w-full"></div>
              <div className="chart-blur-right absolute right-2 z-[5] h-12 w-6"></div>
              <Chart
                chartColor="hsl(var(--color-2))"
                chartData={[
                  { date: "2024-01-01", value: 100 },
                  { date: "2024-01-14", value: 220 },
                  { date: "2024-01-28", value: 210 },
                  { date: "2024-02-10", value: 190 },
                  { date: "2024-02-24", value: 230 },
                  { date: "2024-03-09", value: 240 },
                  { date: "2024-03-23", value: 250 },
                  { date: "2024-04-06", value: 215 },
                  { date: "2024-04-20", value: 205 },
                  { date: "2024-05-04", value: 180 },
                  { date: "2024-05-18", value: 220 },
                  { date: "2024-06-01", value: 210 },
                  { date: "2024-06-15", value: 225 },
                  { date: "2024-06-29", value: 240 },
                ]}
              />
            </div>
          </div>
          <div className="chart-wrapper relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
            <p className="mb-2 text-base font-medium text-slate-500">
              Total Revenue
            </p>
            <h1
              className={cn(
                "mb-2 text-3xl font-semibold text-slate-800",
                lato.className,
              )}
            >
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
                style: "currency",
                currency: "NPR",
                notation: "standard",
              }).format(data.metrics.total_revenue)}
              /-
            </h1>
            <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingUp size={16} className="text-green-600" />
              <span>{data.growth.revenue_growth}% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
              <div className="chart-blur-bottom absolute bottom-0 z-20 h-6 w-full"></div>
              <div className="chart-blur-right absolute right-2 z-20 h-12 w-6"></div>
              <Chart
                chartColor="hsl(var(--color-3))"
                chartData={data.store_revenue_chart_data}
              />
            </div>
          </div>
          <div className="chart-wrapper relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
            <p className="mb-2 text-base font-medium text-slate-500">
              Total Orders
            </p>
            <h1
              className={cn(
                "mb-2 text-3xl font-semibold text-slate-800",
                lato.className,
              )}
            >
              {new Intl.NumberFormat("en-IN", {}).format(
                data.metrics.orders_total,
              )}
            </h1>
            <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingUp size={16} className="text-green-600" />
              <span>{data.growth.orders_growth}% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
              <div className="chart-blur-bottom absolute bottom-0 z-20 h-6 w-full"></div>
              <div className="chart-blur-right absolute right-2 z-20 h-12 w-6"></div>
              <Chart
                chartColor="hsl(var(--color-4))"
                chartData={data.store_orders_chart_data}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
