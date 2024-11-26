import { format } from "date-fns";
import { Calendar, Dot, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type vehicleTypeEnum } from "~/server/db/schema";

type OrderDetailProps = {
  id: number;
  name: string;
  slug: string;
  status: "completed" | "in-progress" | "cancelled" | "active";
  location: string;
  date: {
    start: string;
    end: string;
  };
  price: number;
  inventory: number;
  vehicle: (typeof vehicleTypeEnum.enumValues)[number];
  bookedOn: string;
};

const OrderCard = ({ orderDetails }: { orderDetails: OrderDetailProps }) => {
  return (
    <div className="rounded-md border border-border p-6 shadow-md">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h1 className="line-clamp-1 text-2xl font-semibold">
          <span className="text-slate-500">#{orderDetails.id} - </span>
          {orderDetails.name}
        </h1>
        <span
          className={cn(
            "rounded-md border px-2 py-1 text-sm font-semibold capitalize",
            {
              "border-secondary/30 bg-secondary/10 text-secondary":
                orderDetails.status === "completed",
              "border-blue-600/30 bg-blue-600/10 text-blue-600":
                orderDetails.status === "in-progress",
              "border-slate-600/30 bg-slate-600/10 text-slate-600":
                orderDetails.status === "cancelled",
              "borer-green-600/30 bg-green-600/10 text-green-600":
                orderDetails.status === "active",
            },
          )}
        >
          {orderDetails.status}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1 py-4">
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <MapPin size={20} className="text-slate-600" />
          <span className="">{orderDetails.location}</span>
        </div>
        <Dot size={20} className="text-foreground" />
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <Calendar size={20} className="text-slate-600" />
          <span className="">
            {format(orderDetails.date.start, "MMM d, yyyy")} -{" "}
          </span>
          <span className="">
            {format(orderDetails.date.end, "MMM d, yyyy")}
          </span>
        </div>
        <Dot size={20} className="text-foreground" />
        <div className="flex items-center gap-1 font-medium text-slate-600">
          <span className="">रु. {orderDetails.price}/-</span>
        </div>
      </div>
      <div className="border-b border-border pb-4">
        <h5 className="mb-2 text-lg text-slate-600">Vehicle:</h5>
        <div className="relative flex size-20 flex-col items-center justify-between rounded-md border border-border bg-slate-100 p-2">
          <div className="absolute -right-4 top-2 z-10 rounded-sm border border-border bg-white px-2 text-sm font-semibold text-slate-600 shadow-sm">
            x{orderDetails.inventory}
          </div>
          <Image
            alt="Vechile"
            width={100}
            height={100}
            className="size-12 object-cover"
            src={
              orderDetails.vehicle === "car"
                ? "/images/vehicle/car.png"
                : orderDetails.vehicle === "bike"
                  ? "/images/vehicle/bike.png"
                  : "/images/vehicle/bicycle.png"
            }
          />
          <span className="text-xs capitalize">{orderDetails.vehicle}</span>
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
          <Button variant={"outline"} size="sm">
            Report issue
          </Button>
          <Link href={`/vendor/${orderDetails.slug}`}>
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
