"use client";

// TODO: Not rendering the data from the url properly

import { differenceInDays, format } from "date-fns";
import { CalendarDays, Clipboard, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { useUser } from "~/app/_components/contexts/root";
import { inter } from "~/app/utils/font";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { useUploadFile } from "~/hooks/useUploadthing";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";
import { type GetBookingsType } from "~/server/api/routers/business";
import { api } from "~/trpc/react";
import { type Vehicle } from "~/types/bookings";

interface BookingsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingsDetails: GetBookingsType;
  paymentId: string;
  paymentMethod: string;
}

const Bookings: React.FC<BookingsProps> = ({
  bookingsDetails,
  open,
  setOpen,
  paymentMethod,
  paymentId,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const vehicle = searchParams.get("vehicle") ?? "";

  const { user } = useUser();

  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(
    Object.keys(bookingsDetails.vehicleTypes)[0]!,
  );

  const [selectedVehicleSubType, setSelectedVehicleSubType] =
    useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(user?.user.name ?? "");
  const [userNumber, setUserNumber] = useState<string>("");

  useMemo(() => {
    setSelectedVehicleType(
      !!type
        ? type.charAt(0) + type.slice(1)
        : Object.keys(bookingsDetails.vehicleTypes)[0]!,
    );
    setSelectedVehicleSubType(category.trim());
    setSelectedModel(vehicle.trim());
  }, [type, category, vehicle]);

  const getSelectedVehicleId = (): string | undefined => {
    const vehicles = getCurrentVehicles();
    return vehicles.find((v) => v.name === selectedModel)?.id;
  };

  const getCurrentVehicles = (): Vehicle[] => {
    if (!selectedVehicleType || !selectedVehicleSubType) return [];

    const type = bookingsDetails.vehicleTypes[selectedVehicleType];
    if (!type) return [];

    const subType = type.types.find(
      (t) => t.category === selectedVehicleSubType,
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

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setDate(undefined); // Reset date when model changes
    setQuantity(1); // Reset quantity when model changes
  };

  const handleCheckout = () => {
    setShowQR(true);
  };

  const getSelectedVehiclePrice = (): number => {
    const vehicles = getCurrentVehicles();
    const selectedVehicle = vehicles.find((v) => v.name === selectedModel);
    const days = getRentalDays();
    return selectedVehicle ? selectedVehicle.basePrice * quantity * days : 0;
  };

  const handleClearDate = () => {
    setDate(undefined);
    setQuantity(1); // Reset quantity when date is cleared
  };

  const isDateSelectionDisabled = useMemo(() => {
    return !selectedVehicleType || !selectedVehicleSubType || !selectedModel;
  }, [selectedVehicleType, selectedVehicleSubType, selectedModel]);

  const { mutateAsync, status } = api.rental.rent.useMutation();

  const handleConfirmBooking = async () => {
    const selectedVehicleId = getSelectedVehicleId();
    if (!selectedVehicleId || !date?.from || !date?.to) {
      return;
    }

    const maxAllowedQuantity = getMaxAllowedQuantity();
    if (quantity > maxAllowedQuantity) {
      toast({
        title: "Booking Exceeded Available Quantity",
        description: `The maximum available quantity for the selected dates is ${maxAllowedQuantity}. Please adjust your booking.`,
      });
      return;
    }

    if (!uploadedFile?.[0]?.url) {
      toast({
        title: "Upload Payment Screenshot",
        description: "Please upload payment screenshot to confirm booking",
      });
      return;
    }

    const startDate = date.from;
    const endDate = date.to;

    const booking = {
      vehicleId: selectedVehicleId,
      startDate,
      totalPrice: getSelectedVehiclePrice(),
      endDate,
      inventory: quantity,
      paymentScreenshot: uploadedFile?.[0]?.url,
      note: message,
    };

    await mutateAsync(booking);

    setOpen(false);
    setShowQR(false);
    setSelectedVehicleType("");
    setSelectedVehicleSubType("");
    setSelectedModel("");
    setDate(undefined);
    setQuantity(1);
    setMessage("");

    toast({
      title: "Booking Confirmed. Wait for confirmation",
      description: "Your booking has been confirmed successfully",
    });
  };

  // Updated quantity change handler
  const handleQuantityChange = (action: "increment" | "decrement") => {
    const maxQuantity = getMaxAllowedQuantity();

    if (action === "increment" && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { width } = useWindowDimensions();

  const { isUploading, progresses, uploadFiles, uploadedFile } =
    useUploadFile("imageUploader");

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
          "flex h-[90vh] max-h-[800px] w-[90vw] flex-col gap-4 p-4 md:w-[80vw] lg:max-w-2xl",
        )}
      >
        {!showQR ? (
          <>
            <DialogHeader className="flex-none border-b border-border pb-2">
              <DialogTitle className="text-center text-lg font-medium text-foreground">
                Reserve a Vehicle
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-4 py-2">
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
                              setSelectedVehicleSubType("");
                              setSelectedModel("");
                              setDate(undefined);
                              setQuantity(1);
                            }}
                          >
                            <span className="text-sm font-medium capitalize">
                              {data.label}
                            </span>
                            <div
                              className={cn(
                                "absolute -bottom-[0.80rem] right-2 rounded-full bg-slate-600 px-3 py-1 text-[0.65rem] text-slate-50",
                              )}
                            >
                              From ${data.startingPrice}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {selectedVehicleType && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 px-1">
                      <Label>Vehicle Category</Label>
                      <Select
                        value={selectedVehicleSubType}
                        onValueChange={(value) => {
                          setSelectedVehicleSubType(value);
                          setSelectedModel("");
                          setDate(undefined);
                          setQuantity(1);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {bookingsDetails.vehicleTypes[
                            selectedVehicleType
                          ]?.types.map((type) => (
                            <SelectItem
                              key={type.category}
                              value={type.category}
                            >
                              {type.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 px-1">
                      <Label>Select Vehicle</Label>
                      <Select
                        value={selectedModel}
                        onValueChange={handleModelSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCurrentVehicles().map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.name}>
                              {vehicle.name} (${vehicle.basePrice}/day)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2 px-1">
                  <Label>Pick up Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between px-4 ${!date && "text-muted-foreground"}`}
                        disabled={isDateSelectionDisabled}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays size={18} className="text-slate-700" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </div>
                        {date && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearDate();
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        disabled={isDateDisabled}
                        defaultMonth={date?.from}
                        selected={date}
                        showOutsideDays={false}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setQuantity(1);
                        }}
                        numberOfMonths={width < 640 ? 1 : 2}
                        classNames={{
                          cell: "relative w-[36px] p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                          head_cell: "font-normal text-sm w-[36px]",
                          day: cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground focus:rounded-sm",
                            "disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed",
                          ),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {date?.from && date?.to && (
                    <Alert variant="default" className="mt-2">
                      <AlertTitle>Booking Period</AlertTitle>
                      <AlertDescription>
                        {getRentalDays()} days rental period
                        {getMaxAllowedQuantity() === 0 && (
                          <p className="mt-1 text-red-500">
                            No vehicles available for selected dates. Please
                            choose different dates.
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2 px-1">
                  <Label>Number of Vehicles</Label>
                  <div className="flex w-min items-center gap-2">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="flex size-6 items-center justify-center rounded-full border-slate-400 bg-slate-400 hover:bg-slate-300"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} className="text-white" />
                    </Button>
                    <div className="w-20">
                      <Input
                        type="text"
                        pattern="[0-9]+"
                        inputMode="numeric"
                        min="1"
                        max={getMaxAllowedQuantity()}
                        readOnly
                        disabled={!!date}
                        value={quantity}
                        className="h-10 text-center"
                      />
                    </div>

                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="flex size-6 items-center justify-center rounded-full border-slate-700 bg-slate-700 hover:bg-slate-600"
                      onClick={() => handleQuantityChange("increment")}
                      disabled={quantity >= getMaxAllowedQuantity()}
                    >
                      <Plus size={18} className="text-white" />
                    </Button>
                  </div>
                  {date?.from && date?.to && (
                    <p className="text-sm text-muted-foreground">
                      Maximum available: {getMaxAllowedQuantity()} vehicles
                    </p>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2 px-1">
                    <Label>Username</Label>
                    <Input
                      value={userName}
                      placeholder="John Doe"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <Label>Phone Number</Label>
                    <Input
                      value={userNumber}
                      placeholder="98********"
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

            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1 text-lg font-semibold">
                <span className="text-nowrap">
                  Total: ${getSelectedVehiclePrice()}
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
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled}
                >
                  {isCheckoutDisabled && getMaxAllowedQuantity() === 0
                    ? "No Availability"
                    : "Checkout"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 p-4">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Booking Summary</h3>
              </div>

              <div className="w-full space-y-2 rounded-md border p-4 shadow-sm">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-semibold">{selectedModel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dates:</span>
                  <span className="font-medium">
                    {date?.from && date?.to
                      ? `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd, yyyy")}`
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold">
                    रु.{getSelectedVehiclePrice()} /-
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-48 w-48">
              <Image
                src="/images/qr.png"
                alt="Payment QR Code"
                fill
                className="rounded-lg object-contain"
                priority
              />
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-2 rounded-md border border-border px-4 py-2 shadow-sm">
                <div className="flex flex-1 items-center">
                  <p className="text-base font-medium text-slate-600">
                    {paymentMethod}: {paymentId}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(paymentId);
                    toast({
                      title: "Payment ID Copied",
                      description: "Payment ID copied to clipboard",
                    });
                  }}
                  size={"sm"}
                  variant={"outline"}
                >
                  <Clipboard size={15} className="mr-1 text-slate-700" />
                  Copy to clipboard
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Upload Payment Screenshot</Label>
                <div className="relative">
                  <Input
                    max="1"
                    pattern="image/*"
                    id="picture"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        void uploadFiles(Array.from(files));
                      }
                    }}
                    type="file"
                    className="leading-[2.5!important]"
                  />
                  {isUploading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white">
                      <span className="text-xs text-secondary">{`Uploading... ${progresses}%`}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  disabled={isUploading}
                  variant="outline"
                  onClick={() => setShowQR(false)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  disabled={isUploading || status === "pending"}
                  onClick={async () => {
                    await handleConfirmBooking();
                  }}
                >
                  {isUploading
                    ? "Uploading File..."
                    : status === "pending"
                      ? "Confirming Booking..."
                      : "Confirm Booking"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Bookings;
