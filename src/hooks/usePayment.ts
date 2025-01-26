"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { decodeEsewaSignature } from "~/server/utils/generate-payment-token";
import { api } from "~/trpc/react";
import { toast } from "./use-toast";

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
  notes: string;
};

const usePayment = ({
  bookingProcessData,
  pathname,
  pidx,
  paymentMethod,
  userType,
}: {
  bookingProcessData: string | undefined;
  pathname: string;
  pidx: string | undefined;
  paymentMethod: "esewa" | "khalti" | "cash" | null;
  userType: "VENDOR" | "USER";
}) => {
  const router = useRouter();
  const { mutateAsync: rentUpdateStatusMutation, isError } =
    api.rental.rent.useMutation();

  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(false);

  const processPayment = useCallback(async () => {
    if (!bookingProcessData) {
      return;
    }

    // Skip payment verification for VENDOR
    if (userType === "VENDOR" && paymentMethod) {
      // Directly process the booking without verification
      setProcessingBooking(true);
      const localStorageObject = localStorage.getItem("rental");
      if (!localStorageObject) {
        return false;
      }

      const parsedData = JSON.parse(localStorageObject) as RentalBookingData;

      // Update rental status
      const res = await rentUpdateStatusMutation({
        ...parsedData,
        paymentMethod: "online",
        startDate: new Date(parsedData.startDate),
        endDate: new Date(parsedData.endDate),
        paymentStatus: "complete",
      });

      setProcessingBooking(false);

      if (res) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been successfully processed.",
        });
        toast({
          title: "Wait for Booking Confirmation",
          description: "Please wait while vendor validates your booking.",
        });
        return true;
      }

      return false;
    }

    switch (paymentMethod) {
      case "esewa":
        try {
          // Decode payment signature
          setVerifyingPayment(true);
          const decodedPaymentHash = decodeEsewaSignature(bookingProcessData);
          const paymentData = JSON.parse(
            decodedPaymentHash,
          ) as PaymentBase64Data;

          console.log({ paymentData });

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
          const parsedData = JSON.parse(
            localStorageObject,
          ) as RentalBookingData;

          // Validate transaction
          if (parsedData.paymentId !== paymentData.transaction_uuid) {
            toast({
              variant: "destructive",
              title: "Booking mismatch",
              description: "Please contact support for assistance.",
            });
            return false;
          }

          setProcessingBooking(true);
          setVerifyingPayment(false);

          // Update rental status
          const res = await rentUpdateStatusMutation({
            ...parsedData,
            paymentMethod: "online",
            startDate: new Date(parsedData.startDate),
            endDate: new Date(parsedData.endDate),
            paymentStatus: "complete",
          });

          setProcessingBooking(false);

          if (res) {
            toast({
              title: "Payment Successful",
              description: "Your payment has been successfully processed.",
            });
            toast({
              title: "Wait for Booking Confirmation",
              description: "Please wait while vendor validates your booking.",
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
          setVerifyingPayment(false);
          setProcessingBooking(false);
          localStorage.removeItem("rental");
          router.push(pathname, { scroll: false });
        }
        break;
      case "khalti":
        try {
          setVerifyingPayment(true);
          if (pidx) {
            const { data: khaltiResponse } = await axios.post<{
              pidx: string;
              total_amount: number;
              status:
                | "Completed"
                | "Initiated"
                | "Pending"
                | "Refunded"
                | "Expired"
                | "User canceled";
              transaction_id: string | null;
              fee: number;
              refunded: boolean;
            }>(
              "https://dev.khalti.com/api/v2/epayment/lookup/",
              {
                pidx: pidx,
              },
              {
                headers: {
                  Authorization: `Key live_secret_key_68791341fdd94846a146f0457ff7b455`,
                  "Content-Type": "application/json",
                },
              },
            );

            setTimeout(() => {
              setProcessingBooking(true);
              setVerifyingPayment(false);
            }, 1200);
            if (khaltiResponse.status === "Completed") {
              // Retrieve local storage booking data
              const localStorageObject = localStorage.getItem("rental");
              if (!localStorageObject) {
                return false;
              }

              // Parse local storage data
              const parsedData = JSON.parse(
                localStorageObject,
              ) as RentalBookingData;

              // Update rental status
              const res = await rentUpdateStatusMutation({
                ...parsedData,
                paymentMethod: "online",
                startDate: new Date(parsedData.startDate),
                endDate: new Date(parsedData.endDate),
                paymentStatus: "complete",
              });

              if (res) {
                toast({
                  title: "Payment Successful",
                  description: "Your payment has been successfully processed.",
                });
                toast({
                  title: "Wait for Booking Confirmation",
                  description:
                    "Please wait while vendor validates your booking.",
                });
                return true;
              }

              return false;
            }

            setProcessingBooking(false);
          }
        } catch (error) {
          console.error("Error verifying khalti payment", error);
          toast({
            variant: "destructive",
            title: "Payment Processing Failed",
            description: "Please contact support or vendor.",
          });
          router.push(pathname, { scroll: false });
        } finally {
          setProcessingBooking(false);
          setVerifyingPayment(false);

          localStorage.removeItem("rental");
          router.push(pathname, { scroll: false });
        }

        break;
    }
  }, [bookingProcessData, pathname, pidx, paymentMethod, userType]);

  return {
    processPayment,
    verifyingPayment,
    processingBooking,
    isError,
  };
};

export default usePayment;
