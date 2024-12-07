"use client";

// TODO: Not rendering the data from the url properly

import { differenceInDays, format } from "date-fns";
import { CalendarDays, Loader, Minus, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { v4 as uuidv4 } from "uuid";
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
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { cn } from "~/lib/utils";
import { type GetBookingsType } from "~/server/api/routers/business";
import { api } from "~/trpc/react";
import { type Vehicle } from "~/types/bookings";

interface BookingsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingsDetails: GetBookingsType;
  vendorId: string;
  fromVendor: boolean;
}

const Bookings: React.FC<BookingsProps> = ({
  bookingsDetails,
  open,
  setOpen,
  vendorId,
  fromVendor = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const vehicle = searchParams.get("vehicle") ?? "";

  const { data: user } = useSession();

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

  const { mutateAsync: rentMutation } = api.rental.rent.useMutation();
  const [continueWithCashLoading, setContinueWithCashLoading] = useState(false);
  const [continueWithOnlineLoading, setContinueWithOnlineLoading] =
    useState(false);

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
  const { mutateAsync: paymentMutation } = api.payment.create.useMutation();

  const handlePayment = async () => {
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
    const startDate = date.from;
    const endDate = date.to;

    const transactionUuid = `${Date.now()}-${uuidv4()}`;

    try {
      const payment = await paymentMutation({
        method: "esewa",
        amount: getSelectedVehiclePrice(),
        productName: "",
        transactionId: "",
        transactionUuid,
        businessId: vendorId,
      });

      const localStorageObject = {
        vehicleId: selectedVehicleId,
        startDate,
        totalPrice: getSelectedVehiclePrice(),
        endDate,
        quantity: quantity,
        paymentId: transactionUuid,
        paymentMethod: null,
        paymentStatus: "pending",
        notes: message,
      };

      localStorage.setItem("rental", JSON.stringify(localStorageObject));

      toast({
        title: "Payment Initiated",
        description: "Redirecting to eSewa payment gateway...",
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const esewaPayload = {
        amount: payment.amount,
        tax_amount: payment.esewaConfig.tax_amount,
        total_amount: payment.esewaConfig.total_amount,
        transaction_uuid: payment.esewaConfig.transaction_uuid,
        product_code: payment.esewaConfig.product_code,
        product_service_charge: payment.esewaConfig.product_service_charge,
        product_delivery_charge: payment.esewaConfig.product_delivery_charge,
        success_url: payment.esewaConfig.success_url,
        failure_url: payment.esewaConfig.failure_url,
        signed_field_names: payment.esewaConfig.signed_field_names,
        signature: payment.esewaConfig.signature,
      };

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        variant: "destructive",
        title: errorMessage,
        description: "Payment initiation failed. Please try again.",
      });
    }
  };

  const continuePaymentOffline = async (
    method: "cash" | "online-payment" = "cash",
  ) => {
    try {
      if (method === "cash") {
        setContinueWithCashLoading(true);
      } else {
        setContinueWithOnlineLoading(true);
      }
      toast({
        title: "Initiating Booking",
        description: "Please wait while we confirm your booking",
      });
      await rentMutation({
        vehicleId: getSelectedVehicleId()!,
        startDate: date?.from ?? new Date(),
        endDate: date?.to ?? new Date(),
        totalPrice: getSelectedVehiclePrice(),
        quantity: quantity,
        paymentId: null,
        paymentStatus: "pending",
        paymentMethod: method === "cash" ? "onsite" : "online",
        notes: message,
      });
    } catch (err) {
      console.log({ err });
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again",
      });
    } finally {
      setContinueWithCashLoading(false);
      setContinueWithOnlineLoading(false);
      toast({
        title: "Wait for Confirmation from Vendor",
        description: "Your booking request has been sent to the vendor",
      });
      setTimeout(() => {
        setOpen(false);
      }, 600);
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
                {!user && (
                  <Alert
                    className="border-red-300 bg-red-100"
                    variant="default"
                  >
                    <AlertTitle className="text-red-600">
                      Sign in to continue
                    </AlertTitle>
                    <AlertDescription className="text-red-600">
                      You need to sign in to continue booking a vehicle. Please
                      sign in to continue.
                    </AlertDescription>
                  </Alert>
                )}
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
                  Total: रु.{getSelectedVehiclePrice()}/-
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
                  disabled={isCheckoutDisabled || !user}
                >
                  {isCheckoutDisabled && getMaxAllowedQuantity() === 0
                    ? "No Availability"
                    : "Checkout"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <ScrollArea className="flex-1 pr-2">
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

              <div>
                <h1 className="mb-4 text-lg font-semibold">Payment Method</h1>
                {fromVendor ? (
                  <div className="flex w-full flex-wrap items-center justify-center gap-4">
                    <button
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-slate-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                        "h-12 gap-2 px-6 py-3",
                        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                        "rounded-md",
                      )}
                      type="button"
                      onClick={() => {
                        void continuePaymentOffline("online-payment");
                      }}
                    >
                      {continueWithOnlineLoading ? (
                        <>
                          <Loader
                            size={15}
                            className="ml-2 animate-spin text-slate-600"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Continue with Online payment</span>
                      )}
                    </button>
                    <Separator orientation="vertical" className="h-10" />
                    <Button
                      variant={"outline"}
                      onClick={async () => {
                        void continuePaymentOffline("cash");
                      }}
                      className="gap-2 font-medium text-slate-700"
                    >
                      {continueWithCashLoading ? (
                        <>
                          <Loader
                            size={15}
                            className="ml-2 animate-spin text-slate-600"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Continue with Cash</span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 flex items-center gap-2 space-y-1 rounded-md border border-orange-600 bg-orange-100 p-4 text-orange-600">
                      <div>
                        <h1 className="mb-2 text-xl font-semibold">
                          Something to note before booking
                        </h1>
                        <ul className="space-y-2 pl-6">
                          <li className="list-disc">
                            Please contact support and vendor if you have any
                            issues with the booking.
                          </li>
                          <li className="list-disc">
                            Don&apos;t forget to bring your ID card while
                            picking up the vehicle.
                          </li>
                          <li className="list-disc">
                            Once the booking is done, it cannot be cancelled.
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-center gap-4">
                      <button
                        className={cn(
                          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-slate-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                          "h-12 gap-2 px-6 py-3",
                          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                          "rounded-md",
                        )}
                        type="button"
                        onClick={() => void handlePayment()}
                      >
                        <Image
                          src="/esewa.svg"
                          width={23}
                          height={23}
                          alt="EWallet"
                        />
                        <span>Continue with Esewa</span>
                      </button>
                      <Separator orientation="vertical" className="h-10" />
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          void continuePaymentOffline("cash");
                        }}
                        className="gap-2 font-medium text-slate-700"
                      >
                        {continueWithCashLoading ? (
                          <>
                            <Loader
                              size={15}
                              className="ml-2 animate-spin text-slate-600"
                            />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Image
                              src="/cash.svg"
                              width={23}
                              height={23}
                              alt="Cash"
                            />
                            <span>Continue with Cash</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Bookings;
