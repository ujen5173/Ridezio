import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type GetBusinessVehiclesType } from "~/server/api/routers/vehicle";

const VehicleDetailView = ({
  vehicle,
  setOpen,
}: {
  vehicle: NonNullable<GetBusinessVehiclesType>[number];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="flex-1" variant={"outline"}>
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>
              {vehicle.name}
              <span className="italix ml-2 text-sm text-slate-600">
                ({vehicle.category})
              </span>
            </DialogTitle>
          </DialogHeader>
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {vehicle.images.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full p-1">
                      <div className="relative mb-2 flex aspect-video items-center justify-center">
                        <div className="aspect-video h-[80%] w-auto">
                          <Image
                            alt={`${vehicle.name}`}
                            width={1440}
                            height={1440}
                            layout="fixed"
                            priority
                            className="m-auto h-full w-auto rounded-md object-cover mix-blend-multiply"
                            src={_.url}
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Features</h3>
                <ul className="list-inside list-disc">
                  {vehicle.features.length > 0 ? (
                    vehicle.features.map(({ key, value }, index) => (
                      <div key={value + key} className="grid grid-cols-2">
                        <div
                          className={cn("border border-border p-2 text-xl", {
                            "bg-slate-100": index % 2 === 0,
                          })}
                        >
                          <Label>{key}</Label>
                        </div>
                        <div
                          className={cn("border border-border p-2 text-xl", {
                            "bg-slate-100": index % 2 === 0,
                          })}
                        >
                          <Label>{value}</Label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">No features available</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button type="button" size="sm" variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button asChild size="sm" className="flex-1" variant={"primary"}>
        <Link
          href={{
            query: {
              vehicle: vehicle.name,
              type: vehicle.type,
              category: vehicle.category,
            },
          }}
          scroll={false}
          onClick={async () => {
            setOpen(true);
          }}
          className="flex flex-col gap-2"
        >
          Rent Now
        </Link>
      </Button>
    </div>
  );
};

export default VehicleDetailView;
