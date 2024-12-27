"use client";

import { Edit, Expand } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const VehicleDashboardFetaure = ({
  vehiclelId,
  vehicleName,
  features,
}: {
  vehiclelId: string;
  vehicleName: string;
  features: { key: string; value: string }[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size="sm">
          <Expand size={13} className="mr-1 text-slate-600" />
          Expand to view
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Features of{" "}
            <span className="font-semibold text-secondary underline underline-offset-2">
              {vehicleName}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mb-2 border border-border">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="flex border-b border-border last:border-0"
              >
                <span className="h-full w-40 border-r border-border bg-slate-100 p-4 text-sm font-semibold">
                  {feature.key}
                </span>
                <span className="p-4 text-sm">{feature.value}</span>
              </div>
            );
          })}
        </div>
        <DialogFooter className="flex items-center">
          <Link href={`/vendor/vehicles/add?edit=${vehiclelId}`}>
            <Button variant={"primary"}>
              <Edit size={18} className="mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant={"outline"}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDashboardFetaure;
