import { format } from "date-fns";
import { Calendar, Dot, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { type GetUserOrdersType } from "~/server/api/routers/users";

const OrderCard = ({
  orderDetails,
  setIsOpen,
  setVendorName,
  setSelectedVendor,
}: {
  orderDetails: GetUserOrdersType[number];
  setVendorName: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVendor: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="rounded-md border border-border p-6 shadow-md">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h1 className="line-clamp-1 flex-1 text-2xl font-semibold text-slate-600">
          {orderDetails.vehicleName}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-sm font-semibold capitalize",
              {
                "border-secondary/30 bg-secondary/10 text-secondary":
                  orderDetails.paymentStatus === "complete",
                "border-blue-600/30 bg-blue-600/10 text-blue-600":
                  orderDetails.paymentStatus === "pending",
                "border-slate-600/30 bg-slate-600/10 text-slate-600":
                  orderDetails.paymentStatus === "canceled",
              },
            )}
          >
            Payment: {orderDetails.paymentStatus}
          </span>
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-sm font-semibold capitalize",
              {
                "border-secondary/30 bg-secondary/10 text-secondary":
                  orderDetails.status === "completed",
                "border-blue-600/30 bg-blue-600/10 text-blue-600":
                  orderDetails.status === "pending",
                "border-slate-600/30 bg-slate-600/10 text-slate-600":
                  orderDetails.status === "cancelled",
                "borer-green-600/30 bg-green-600/10 text-green-600":
                  orderDetails.status === "approved",
              },
            )}
          >
            Status: {orderDetails.status}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 font-medium text-slate-600">
        <Store size={20} className="text-slate-600" />
        <p className="text-lg font-medium text-slate-600">
          {orderDetails.vendorName}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1 py-4">
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <MapPin size={20} className="capitalize text-slate-600" />
          <span className="">{orderDetails.location?.address}</span>
        </div>
        <Dot size={20} className="text-foreground" />
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <Calendar size={20} className="text-slate-600" />
          <span className="">
            {format(orderDetails.startDate, "MMM d, yyyy")} -{" "}
          </span>
          <span className="">
            {format(orderDetails.endDate, "MMM d, yyyy")}
          </span>
        </div>
        <Dot size={20} className="text-foreground" />
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <span className="">रु. {orderDetails.totalPrice}/-</span>
        </div>
      </div>

      <div className="border-b border-border pb-4">
        <h5 className="mb-2 text-lg text-slate-600">Vehicle:</h5>
        <div className="relative flex size-20 flex-col items-center justify-between rounded-md border border-border bg-slate-100 p-2">
          <div className="absolute -right-4 top-2 z-10 rounded-sm border border-border bg-white px-2 text-sm font-semibold text-slate-600 shadow-sm">
            x{orderDetails.quantity}
          </div>
          <Image
            alt="Vechile"
            width={100}
            height={100}
            className="size-12 object-cover"
            src={
              orderDetails.type?.includes("car")
                ? "/images/vehicle/car.png"
                : orderDetails.type?.includes("bike")
                  ? "/images/vehicle/bike.png"
                  : "/images/vehicle/bicycle.png"
            }
          />
          <span className="text-xs capitalize">{orderDetails.type}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <span className="font-semibold text-slate-600">
          Booked on{" "}
          <span className="text-secondary">
            {format(orderDetails.bookedOn, "MMM d, yyyy")}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => {
                    if (
                      !orderDetails.canReview ||
                      !(new Date() >= orderDetails.startDate)
                    ) {
                      return;
                    }
                    setIsOpen(true);
                    setVendorName(orderDetails.vendorName);
                    setSelectedVendor(orderDetails.vendorId);
                  }}
                  variant={"outline"}
                  size="sm"
                >
                  Add a review
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {!orderDetails.canReview
                    ? "You have already reviewed this vendor"
                    : new Date() >= orderDetails.startDate
                      ? "Tell us what you think?"
                      : "You can review this vendor after the rental period"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href={`/vendor/${orderDetails.vendorSlug!}`}>
            <Button variant={"destructive"} size="sm">
              Order again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
