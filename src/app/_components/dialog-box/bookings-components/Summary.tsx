"use client";

import { type CheckedState } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { CalendarClock, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { type DateRange } from "react-day-picker";
import { v4 as uuidv4 } from "uuid";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

enum PaymentMethod {
  Cash = "cash",
  Khalti = "khalti",
  Esewa = "esewa",
}

const Summary = ({
  getMaxAllowedQuantity,
  getSelectedVehicleId,
  getSelectedVehiclePrice,
  selectedVehicle,
  date,
  quantity,
  fromVendor,
  message,
  acceptedPaymentMethods,
  setOpen,
}: {
  getMaxAllowedQuantity: () => number;
  getSelectedVehicleId: () => string | undefined;
  getSelectedVehiclePrice: () => number;
  selectedVehicle: {
    vehicleModel: string;
    vehicleCategory: string;
  };
  date: DateRange | undefined;
  quantity: number;
  fromVendor: boolean;
  message: string;
  acceptedPaymentMethods: PaymentMethod[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useSession();

  const acceptOnline =
    acceptedPaymentMethods.includes(PaymentMethod.Esewa) ||
    acceptedPaymentMethods.includes(PaymentMethod.Khalti);

  const [acceptTerms, setAcceptTerms] = useState<CheckedState>(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "online" | "cash"
  >(acceptOnline ? "online" : "cash");
  const [selectedWallet, setSelectedWallet] = useState<
    "esewa" | "khalti" | null
  >(null);

  const { mutateAsync: paymentMutation } = api.payment.create.useMutation();

  const { mutateAsync: rentMutation } = api.rental.rent.useMutation();
  const [loading, setLoading] = useState(false);

  const reserveBooking = async (method: "cash" | "online-payment" = "cash") => {
    try {
      setLoading(true);

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
        paymentMethod: method === "cash" ? "cash" : "online",
        notes: message,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
      setLoading(false);
      if (fromVendor) {
        toast({
          title: "Booking Confirmed",
          description: "The booking has been confirmed",
        });
      } else {
        toast({
          title: "Wait for Confirmation from Vendor",
          description: "Your booking request has been sent to the vendor",
        });
      }
      setTimeout(() => {
        setOpen(false);
      }, 600);
    }
  };

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

    switch (selectedWallet) {
      case "esewa":
        const startDate = date.from;
        const endDate = date.to;

        const transactionUuid = `${Date.now()}-${uuidv4()}`;

        try {
          const payment = await paymentMutation({
            method: "esewa",
            amount: getSelectedVehiclePrice(),
            productName: "",

            transactionUuid,
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

          if (payment?.esewaConfig) {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

            const esewaPayload = {
              amount: payment.amount,
              tax_amount: payment.esewaConfig.tax_amount,
              total_amount: payment.esewaConfig.total_amount,
              transaction_uuid: payment.esewaConfig.transaction_uuid,
              product_code: payment.esewaConfig.product_code,
              product_service_charge:
                payment.esewaConfig.product_service_charge,
              product_delivery_charge:
                payment.esewaConfig.product_delivery_charge,
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
          } else {
            throw new Error(
              "eSewa configuration not received or payment object is invalid",
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          toast({
            variant: "destructive",
            title: errorMessage,
            description: "Payment initiation failed. Please try again.",
          });
        }
        break;
      case "khalti":
        try {
          const startDate = date.from;
          const endDate = date.to;

          const transactionUuid = `${Date.now()}-${uuidv4()}`;

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

          const transactionId = `${Date.now()}-${uuidv4()}`;

          const data = await paymentMutation({
            method: "khalti",
            amount: getSelectedVehiclePrice(),
            productName: selectedVehicle.vehicleModel,
            transactionUuid: transactionId,
          });

          if (!data.khaltiPaymentUrl) {
            throw new Error("Khalti payment URL not received");
          }

          router.push(data.khaltiPaymentUrl);
        } catch (error) {
          console.error("Payment error:", error);
          alert("Payment initiation failed. Please try again.");
        } finally {
        }
        break;

      default:
        break;
    }
  };

  const checkOut = async () => {
    if (user?.user.role === "VENDOR") {
      await reserveBooking(
        selectedPaymentMethod === "online" ? "online-payment" : "cash",
      );
      router.push(pathname + `?data=success&paymentMethod=cash`, {
        scroll: false,
      });
    } else {
      if (selectedPaymentMethod === "online") {
        if (selectedWallet === "esewa") {
          void handlePayment();
        } else if (selectedWallet === "khalti") {
          void handlePayment();
        } else {
          toast({
            title: "Select a Payment Wallet",
            description: "Please select a payment wallet to proceed.",
          });
        }
      } else {
        await reserveBooking("cash");
        router.push(pathname + `?data=success&paymentMethod=cash`, {
          scroll: false,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Booking Summary
          </h3>
        </div>

        <div className="w-full space-y-2 rounded-md border p-4 shadow-sm">
          <div className="flex justify-between">
            <span>Vehicle:</span>
            <span className="font-semibold text-slate-700">
              {selectedVehicle.vehicleModel}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
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
              {Intl.NumberFormat("en-NP", {
                style: "currency",
                currency: "NPR",
              }).format(getSelectedVehiclePrice())}{" "}
              /-
            </span>
          </div>
        </div>
      </div>

      <Separator className="" />

      <div className="w-full space-y-6">
        {!fromVendor && (
          <>
            <div className="">
              <h1 className="mb-4 text-lg font-bold text-slate-800">
                Cancellation policy
              </h1>
              <p className="text-sm text-slate-600">
                Once the booking is done, it{" "}
                <u>
                  <em>cannot be cancelled</em>.
                </u>{" "}
                Please contact support and vendor if you have any issues with
                the booking.
              </p>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <CalendarClock className="size-8 text-secondary" />
              <p className="flex-1 text-sm text-slate-700">
                Your reservation won&apos;t be confirmed until the Vendor
                accepts your request. You will receive a email on update from
                vendor.
              </p>
            </div>

            <Separator />

            <div className="">
              <h1 className="mb-4 text-lg font-bold text-slate-800">
                Required Documents on Pickup
              </h1>
              <ul className="list-disc pl-6 text-sm text-slate-600">
                <li>ID card (Citizenship card or Passport)</li>
                <li>Driving License if it is bike or car</li>
              </ul>
            </div>

            <Separator />
          </>
        )}
        <div className="">
          <h1 className="mb-4 text-lg font-bold text-slate-800">
            Choose how to pay
          </h1>
          <div className="rounded-lg border border-border">
            <RadioGroup
              onValueChange={(e: "online" | "cash") => {
                setSelectedPaymentMethod(e);
              }}
              className="gap-0"
              defaultValue={acceptOnline ? "online" : "cash"}
            >
              <Label
                htmlFor="online"
                role="button"
                className={cn(
                  "flex items-center justify-between px-4 py-4",
                  acceptOnline
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-55",
                )}
              >
                <p className="flex-1">
                  Pay{" "}
                  {Intl.NumberFormat("en-NP", {
                    style: "currency",
                    currency: "NPR",
                  }).format(getSelectedVehiclePrice())}{" "}
                  /- now
                </p>
                <div className="flex items-center gap-2">
                  {!acceptOnline ? (
                    <span className="text-xs text-destructive">
                      (Online Not Available)
                    </span>
                  ) : null}
                  <RadioGroupItem
                    disabled={!acceptOnline}
                    value="online"
                    id="online"
                  />
                </div>
              </Label>
              <Separator />
              <Label
                htmlFor="cash"
                role="button"
                className="flex items-center justify-between px-4 py-4"
              >
                <p className="flex-1">Cash on Pickup</p>
                <RadioGroupItem value="cash" id="cash" />
              </Label>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="mb-4 text-lg font-bold text-slate-800">Pay with</h1>
          </div>

          <RadioGroup
            onValueChange={(e: "esewa" | "khalti") => {
              setSelectedWallet(e);
            }}
            disabled={selectedPaymentMethod === "cash"}
            className="flex gap-2"
          >
            <Label
              htmlFor="esewa"
              role="button"
              className={cn(
                "flex size-28 items-center justify-center rounded-md border border-border px-4 py-6 transition",
                selectedPaymentMethod === "online"
                  ? cn(
                      selectedWallet === "esewa"
                        ? "border-secondary/30 bg-secondary/30"
                        : "hover:bg-slate-100",
                    )
                  : "pointer-events-none cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/esewa.svg"}
                  width={100}
                  height={100}
                  alt="Pay with esewa"
                  className="mb-3 aspect-square size-7 object-contain"
                />
                <span className="text-center text-base text-slate-700">
                  eSewa
                </span>
              </div>
              <RadioGroupItem value="esewa" id="esewa" hidden />
            </Label>
            <Label
              htmlFor="khalti"
              role="button"
              className={cn(
                "flex size-28 items-center justify-center rounded-md border border-border px-4 py-6 transition",
                selectedPaymentMethod === "online"
                  ? cn(
                      selectedWallet === "khalti"
                        ? "border-secondary/30 bg-secondary/30"
                        : "hover:bg-slate-100",
                    )
                  : "pointer-events-none cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/khalti.png"}
                  width={100}
                  height={100}
                  alt="Pay with khalti"
                  className="mb-3 aspect-square size-7 object-contain"
                />
                <span className="text-center text-base text-slate-700">
                  Khalti
                </span>
              </div>
              <RadioGroupItem value="khalti" id="khalti" hidden />
            </Label>
          </RadioGroup>
        </div>

        <Separator />
        {!fromVendor && (
          <div className="flex items-center space-x-2 px-1">
            <Checkbox
              defaultChecked={acceptTerms}
              onCheckedChange={(e) => setAcceptTerms(e)}
              id="terms"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link
                className="text-secondary underline"
                href="/terms-of-service"
              >
                Terms of Service
              </Link>
              , and I acknowledge the{" "}
              <Link className="text-secondary underline" href="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            className="gap-2"
            disabled={loading}
            onClick={checkOut}
            variant={"secondary"}
          >
            {loading && <Loader className="size-4 animate-spin" />}
            {loading
              ? "Processing..."
              : !fromVendor
                ? "Request to book"
                : "Book Now"}
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
            variant={"outline"}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
