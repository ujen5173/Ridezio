"use client";

import { differenceInDays } from "date-fns";
import { ChevronLeft, TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { inter } from "~/app/utils/font";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { type GetBookingsType } from "~/server/api/routers/business";
import { type Vehicle } from "~/types/bookings";
import NumberOfVehicles from "./bookings-components/NumberOfVehicles";
import SigninAlert from "./bookings-components/SigninAlert";
import Summary from "./bookings-components/Summary";
import WhichVehicle from "./bookings-components/WhichVehicle";

enum PaymentMethod {
  Cash = "cash",
  Khalti = "khalti",
  Esewa = "esewa",
}

interface BookingsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingsDetails: GetBookingsType;
  vendorUserId: string;
  fromVendor: boolean;
  paymentDetails: {
    merchantCode: string | null;
  };
}

const Bookings: React.FC<BookingsProps> = ({
  bookingsDetails,
  open,
  setOpen,
  vendorUserId,
  paymentDetails,
  fromVendor = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const vehicle = searchParams.get("vehicle") ?? "";

  const { data: user } = useSession();

  const [selectedVehicle, setSelectedVehicle] = useState<{
    vehicleModel: string;
    vehicleCategory: string;
  }>({
    vehicleModel: vehicle,
    vehicleCategory: category,
  });

  // car | bike | scooter | scooter | bicycle
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(
    Object.keys(bookingsDetails.vehicleTypes)[0]!,
  );

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [userName, setUserName] = useState(user?.user.name ?? "");
  const [userNumber, setUserNumber] = useState("");

  useMemo(() => {
    setSelectedVehicleType(
      !!type
        ? type.charAt(0) + type.slice(1)
        : Object.keys(bookingsDetails.vehicleTypes)[0]!,
    );
    setSelectedVehicle({
      vehicleCategory: category.trim(),
      vehicleModel: vehicle.trim(),
    });
  }, [type, category, vehicle]);

  const allAvailableVehicles = useMemo(() => {
    return Object.values(bookingsDetails.vehicleTypes).reduce(
      (acc, type) => {
        return {
          ...acc,
          [type.label]: type.types.reduce(
            (acc, subType) => {
              return {
                ...acc,
                [subType.category]: subType.vehicles.map((v) => v.name),
              };
            },
            {} as Record<string, string[]>,
          ),
        };
      },
      {} as Record<string, Record<string, string[]>>,
    );
  }, [bookingsDetails.vehicleTypes]);

  const getSelectedVehicleId = (): string | undefined => {
    const vehicles = getCurrentVehicles();
    return vehicles.find((v) => v.name === selectedVehicle.vehicleModel)?.id;
  };

  const getCurrentVehicles = (): Vehicle[] => {
    if (!selectedVehicleType || !selectedVehicle.vehicleCategory) return [];

    const type = bookingsDetails.vehicleTypes[selectedVehicleType];
    if (!type) return [];

    const subType = type.types.find(
      (t) => t.category === selectedVehicle.vehicleCategory,
    );

    return subType?.vehicles ?? [];
  };

  const getAvailableQuantity = (
    vehicleId: string,
    startDate: Date,
    endDate: Date,
  ): number => {
    const vehicle = getCurrentVehicles().find((v) => v.id === vehicleId);
    if (!vehicle) return 0;

    const totalCount = vehicle.inventory;
    const overlappingBookings = bookingsDetails.bookings.filter((booking) => {
      const bookingStart = new Date(booking.rentalStart);
      const bookingEnd = new Date(booking.rentalEnd);
      return (
        booking.vehicleId === vehicleId &&
        !(endDate < bookingStart || startDate > bookingEnd)
      );
    });

    const maxBooked = overlappingBookings.reduce((max, booking) => {
      return Math.max(max, booking.quantity);
    }, 0);

    return totalCount - maxBooked;
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return true;
    }

    const selectedVehicleId = getSelectedVehicleId();
    if (!selectedVehicleId) {
      return false;
    }

    const availableQuantity = getAvailableQuantity(
      selectedVehicleId,
      checkDate,
      checkDate,
    );
    return availableQuantity <= 0;
  };

  const getRentalDays = (): number => {
    if (!date?.from || !date?.to) return 0;
    return differenceInDays(date.to, date.from) + 1;
  };

  const getMaxAllowedQuantity = (): number => {
    const selectedVehicleId = getSelectedVehicleId();
    if (!selectedVehicleId || !date?.from || !date?.to) {
      return 0;
    }

    return getAvailableQuantity(selectedVehicleId, date.from, date.to);
  };

  const isCheckoutDisabled = useMemo(() => {
    if (!date?.from || !date?.to || getRentalDays() === 0) return true;

    const maxQuantity = getMaxAllowedQuantity();
    return maxQuantity === 0 || quantity > maxQuantity;
  }, [date, quantity]);

  const getSelectedVehiclePrice = (): number => {
    const vehicles = getCurrentVehicles();
    const sv = vehicles.find((v) => v.name === selectedVehicle.vehicleModel);
    const days = getRentalDays();
    return sv ? sv.basePrice * quantity * days : 0;
  };

  const handleClearDate = () => {
    setDate(undefined);
    setQuantity(1); // Reset quantity when date is cleared
  };

  const isDateSelectionDisabled = useMemo(() => {
    return (
      !selectedVehicleType ||
      !selectedVehicle.vehicleCategory ||
      !selectedVehicle.vehicleModel
    );
  }, [selectedVehicleType, selectedVehicle]);

  const handleQuantityChange = (action: "increment" | "decrement") => {
    const maxQuantity = getMaxAllowedQuantity();

    if (action === "increment" && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          router.replace(pathname, {
            scroll: false,
          });
        }
        setOpen(e);
      }}
    >
      <DialogContent
        className={cn(
          inter.className,
          "flex h-[90vh] max-h-[800px] w-full max-w-screen-2xl flex-col gap-4 px-4 sm:w-[90vw] sm:max-w-4xl sm:py-4 md:w-full md:max-w-3xl",
        )}
      >
        {!showBookingSummary ? (
          <>
            <DialogHeader className="flex-none border-b border-border pb-2">
              <DialogTitle className="text-center text-lg font-medium text-foreground">
                Reserve a Vehicle
              </DialogTitle>
            </DialogHeader>

            {user?.user.role === "VENDOR" && user?.user.id !== vendorUserId && (
              <Alert variant="default" className="border-red-300 bg-red-100">
                <div className="flex flex-1 items-center gap-4">
                  <TriangleAlert className="h-6 w-6 text-red-600" />
                  <div className="flex-1">
                    <AlertTitle className="text-lg font-medium text-red-600">
                      Vendor cannot book
                    </AlertTitle>
                    <AlertDescription className="text-red-600">
                      Please register as a user to continue booking a vehicle.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-4 py-2">
                {!user && <SigninAlert />}

                {/* Vehicle Type Selection */}
                <div className="mb-8 space-y-2 px-1">
                  <Label>Vehicle Type</Label>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-1 sm:grid-cols-3">
                    {Object.entries(bookingsDetails.vehicleTypes).map(
                      ([type, data]) => {
                        return (
                          <div
                            key={type}
                            className={`relative cursor-pointer rounded-md bg-[#f1f0f5] p-4 text-slate-800 transition-all hover:bg-slate-200 ${
                              selectedVehicleType === type
                                ? "ring-2 ring-secondary"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedVehicleType(type);
                              setSelectedVehicle({
                                vehicleCategory: "",
                                vehicleModel: "",
                              });
                              setDate(undefined);
                              setQuantity(1);
                            }}
                          >
                            <span className="text-sm font-semibold capitalize">
                              {data.label}
                            </span>
                            <div
                              className={cn(
                                "absolute -bottom-[0.80rem] right-2 rounded-full bg-slate-600 px-3 py-1.5 text-xs text-slate-50",
                              )}
                            >
                              Starting from NPR. {data.startingPrice} /-
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <WhichVehicle
                  open={open}
                  date={date}
                  setDate={setDate}
                  setQuantity={setQuantity}
                  handleClearDate={handleClearDate}
                  isDateSelectionDisabled={isDateSelectionDisabled}
                  isDateDisabled={isDateDisabled}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                  selectedVehicleType={selectedVehicleType}
                  allAvailableVehicles={allAvailableVehicles}
                  getRentalDays={getRentalDays}
                  getMaxAllowedQuantity={getMaxAllowedQuantity}
                />

                <NumberOfVehicles
                  handleQuantityChange={handleQuantityChange}
                  quantity={quantity}
                  date={date}
                  getMaxAllowedQuantity={getMaxAllowedQuantity}
                />

                <Separator />

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="space-y-2 px-1">
                    <Label>Username</Label>
                    <Input
                      value={userName}
                      placeholder="John Doe"
                      className="text-sm"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <Label>Phone Number</Label>
                    <Input
                      value={userNumber}
                      placeholder="98********"
                      className="text-sm"
                      onChange={(e) => setUserNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 px-1">
                  <Label>
                    Message to vendor
                    <span className="text-xs italic text-slate-600">
                      (Optional)
                    </span>
                  </Label>
                  <Textarea
                    className="h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special requirements or requests?"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="flex flex-wrap gap-1 text-lg font-semibold">
                <span className="text-nowrap">
                  Total: NPR.{getSelectedVehiclePrice()}/-
                </span>

                {date?.from && date?.to && (
                  <span className="text-nowrap text-sm text-gray-500">
                    for {getRentalDays()} days
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => setOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (
                      user?.user.role === "VENDOR" &&
                      user?.user.id !== vendorUserId
                    ) {
                      return;
                    } else {
                      setShowBookingSummary(true);
                    }
                  }}
                  disabled={
                    isCheckoutDisabled ||
                    !user ||
                    (user?.user.role === "VENDOR" &&
                      user?.user.id !== vendorUserId)
                  }
                >
                  {isCheckoutDisabled && getMaxAllowedQuantity() === 0
                    ? "No Availability"
                    : "Checkout"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <ScrollArea className="relative flex-1 pr-2">
            <button
              type="button"
              onClick={() => {
                setShowBookingSummary(false);
              }}
              className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </button>

            <Summary
              getMaxAllowedQuantity={getMaxAllowedQuantity}
              getSelectedVehicleId={getSelectedVehicleId}
              message={message}
              getSelectedVehiclePrice={getSelectedVehiclePrice}
              selectedVehicle={selectedVehicle}
              date={date}
              quantity={quantity}
              fromVendor={fromVendor}
              acceptedPaymentMethods={(() => {
                const method = [
                  PaymentMethod.Cash,
                  ...(paymentDetails.merchantCode ? [PaymentMethod.Esewa] : []),
                ];

                return method;
              })()}
              setOpen={setOpen}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Bookings;
