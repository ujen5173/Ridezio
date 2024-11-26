"use client";

import { type Row } from "@tanstack/react-table";
import { Package } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { type Vehicle } from "./VehiclesTable";

interface VehicleDetailsSheetProps {
  row: Row<Vehicle>;
}

interface VehicleStats {
  totalRentals: number;
  revenueGenerated: number;
}

const VehicleDetailsSheet = ({ row }: VehicleDetailsSheetProps) => {
  const vehicle = row.original;

  // Memoize computed values to prevent hydration mismatches
  const stats: VehicleStats = useMemo(
    () => ({
      totalRentals: 247, // Example static value, replace with actual data
      revenueGenerated: vehicle.basePrice * 247,
    }),
    [vehicle.basePrice],
  );

  // Memoize formatted date to ensure consistency
  const formattedDate = useMemo(
    () =>
      new Date(vehicle.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [vehicle.createdAt],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="m-4 h-[calc(100vh-2rem)] w-[400px] overflow-y-auto rounded-md p-0 sm:w-[540px]">
        <SheetHeader className="mb-5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-slate-600">
              {vehicle.id}
            </SheetTitle>
          </div>
          <p className="text-base text-foreground">Vehicle details</p>
        </SheetHeader>

        {/* Vehicle Basic Info */}
        <div className="mb-6 px-4">
          <div className="flex items-start gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border">
              {/* Use next/image for optimization */}
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                width={800}
                height={800}
                className="h-8/12 w-8/12 object-cover mix-blend-multiply"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">
                {vehicle.category}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {vehicle.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {vehicle.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Features Section */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-y-2">
            <div>Inventory</div>
            <div className="font-medium">{vehicle.inventory}</div>
            <div>Price</div>
            <div className="font-medium">NPR {vehicle.basePrice}/day</div>
            <div>Created At</div>
            <div className="font-medium">{vehicle.createdAt}</div>
            <div>Model</div>
            <div className="font-medium">N/A</div>
            <div>Mileage</div>
            <div className="font-medium">N/A</div>
            <div>Year</div>
            <div className="font-medium">N/A</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6 px-4">
          <h4 className="mb-4 text-lg font-semibold">Features</h4>
          <div className="grid grid-cols-2 gap-4">
            {vehicle.features.split(",").map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{feature.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6 px-4">
          <h4 className="mb-4 text-lg font-semibold">Availability</h4>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VehicleDetailsSheet;
