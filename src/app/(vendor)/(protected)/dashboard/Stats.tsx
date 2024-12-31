"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import BookingProcessing from "~/app/_components/dialog-box/BookingProcessing";
import { inter } from "~/app/utils/font";
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
  paymentMethod: "online" | "cash" | null;
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
        <BookingProcessing
          {...{ bookingModelOpen, setBookingModelOpen, loading, isError }}
        />
      )}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-end">
          <div className="flex-1">
            <h1 className={cn("text-2xl font-bold text-secondary md:text-3xl")}>
              {data.store.name}
            </h1>
          </div>
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
                  "mb-2 text-3xl font-semibold text-slate-700",
                  inter.className,
                )}
              >
                {data.metrics.orders_today}
              </h1>
            </div>
          </div>
          <div className="relative rounded-xl border border-slate-200 p-4">
            <p className="mb-2 text-base font-medium text-slate-500">
              Store Views
            </p>
            <h1
              className={cn(
                "mb-2 text-3xl font-semibold text-slate-700",
                inter.className,
              )}
            >
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(data.metrics.current_month_views)}{" "}
              -
            </h1>
            <div className="relative z-[9] flex items-center gap-2 text-sm font-medium text-slate-500">
              {data.growth.views_growth > 0 ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : data.growth.views_growth === 0 ? (
                "-"
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span>{data.growth.views_growth}% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
              <Chart
                chartColor="hsl(var(--color-2))"
                chartData={data.store_views_chart_data}
              />
            </div>
          </div>
          <div className="chart-wrapper relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
            <p className="mb-2 text-base font-medium text-slate-500">
              Total Revenue
            </p>
            <h1
              className={cn(
                "mb-2 text-3xl font-semibold text-slate-700",
                inter.className,
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
              {data.growth.revenue_growth > 0 ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : data.growth.revenue_growth === 0 ? (
                "-"
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}{" "}
              <span>{data.growth.revenue_growth}% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 z-40 w-1/2 min-w-36">
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
                "mb-2 text-3xl font-semibold text-slate-700",
                inter.className,
              )}
            >
              {new Intl.NumberFormat("en-IN", {}).format(
                data.metrics.orders_total,
              )}
            </h1>
            <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
              {data.growth.orders_growth > 0 ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : data.growth.orders_growth === 0 ? (
                "-"
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}{" "}
              <span>{data.growth.orders_growth}% from last month</span>
            </div>
            <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
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
