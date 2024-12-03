esewa and khalti code documention:

```
Integrating eSewa and Khalti Payment Gateways in Next.js 14 with Server Actions
Payment gateways are vital for modern applications, allowing seamless transactions for users. In this guide, we’ll walk through how to integrate two popular Nepali payment gateways, eSewa and Khalti, into a Next.js 14 application using Server Actions. These features let you handle payment logic securely on the server side while maintaining an intuitive user experience.

Why Server Actions for Payments?
Server Actions in Next.js simplify server-side operations by enabling server-side code execution directly from React components. This ensures sensitive operations, such as initiating payments, are secure and kept away from the client-side.

Setting Up Payment Initiation
We’ll start by creating a Server Action to handle payment initiation for both eSewa and Khalti.


Server Action Code
Here’s a breakdown of the Server Action responsible for initiating payments:

// app/api/initiate-payment.ts
 'use server';
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
import { PaymentMethod, PaymentRequestData } from "@/lib/types";
function validateEnvironmentVariables() {
const requiredEnvVars = [
"NEXT_PUBLIC_BASE_URL",
"NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
"NEXT_PUBLIC_ESEWA_SECRET_KEY",
"NEXT_PUBLIC_KHALTI_SECRET_KEY",
];
for (const envVar of requiredEnvVars) {
if (!process.env[envVar]) {
throw new Error(`Missing environment variable: ${envVar}`);
}
}
}
export async function POST(req: Request) {
console.log("Received POST request to /api/checkout-session");
try {
validateEnvironmentVariables();
const paymentData: PaymentRequestData = await req.json();
const { amount, productName, transactionId, method } = paymentData;
if (!amount || !productName || !transactionId || !method) {
console.error("Missing required fields:", paymentData);
return NextResponse.json(
{ error: "Missing required fields" },
{ status: 400 }
);
}
switch (method as PaymentMethod) {
case "esewa": {
console.log("Initiating eSewa payment");
const transactionUuid = `${Date.now()}-${uuidv4()}`;
const esewaConfig = {
amount: amount,
tax_amount: "0",
total_amount: amount,
transaction_uuid: transactionUuid,
product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
product_service_charge: "0",
product_delivery_charge: "0",
success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=esewa`,
failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
signed_field_names: "total_amount,transaction_uuid,product_code",
};
const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
const signature = generateEsewaSignature(
process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
signatureString
);
console.log("eSewa config:", { …esewaConfig, signature });
return NextResponse.json({
amount: amount,
esewaConfig: {
…esewaConfig,
signature,
product_service_charge: Number(esewaConfig.product_service_charge),
product_delivery_charge: Number(
esewaConfig.product_delivery_charge
),
tax_amount: Number(esewaConfig.tax_amount),
total_amount: Number(esewaConfig.total_amount),
},
});
}
case "khalti": {
console.log("Initiating Khalti payment");
const khaltiConfig = {
return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=khalti`,
website_url: process.env.NEXT_PUBLIC_BASE_URL!,
amount: Math.round(parseFloat(amount) * 100),
purchase_order_id: transactionId,
purchase_order_name: productName,
customer_info: {
name: "dai",
email: "dai@gmail.com",
phone: "9800000000",
},
};
const response = await fetch(
"https://a.khalti.com/api/v2/epayment/initiate/",
{
method: "POST",
headers: {
Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify(khaltiConfig),
}
);
if (!response.ok) {
const errorData = await response.json();
console.error("Khalti API Error:", errorData);
throw new Error(
`Khalti payment initiation failed: ${JSON.stringify(errorData)}`
);
}
const khaltiResponse = await response.json();
console.log("Khalti payment initiated:", khaltiResponse);
return NextResponse.json({
khaltiPaymentUrl: khaltiResponse.payment_url,
});
}
default:
console.error("Invalid payment method:", method);
return NextResponse.json(
{ error: "Invalid payment method" },
{ status: 400 }
);
}
} catch (err) {
console.error("Payment API Error:", err);
return NextResponse.json(
{
error: "Error creating payment session",
details: err instanceof Error ? err.message : "Unknown error",
},
{ status: 500 }
);
}
}
eSewa Hashing and Secret Key
When integrating eSewa into your Next.js application, it’s crucial to understand the hashing process and the use of the secret key. This ensures secure communication between your application and the eSewa payment gateway.

Payment Components
eSewa Payment Component
The eSewa component collects user input and submits it to the Server Action. Upon successful payment configuration, the user is redirected to the eSewa payment page.

// app/esewa-payment/pages.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DummyDataResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface EsewaConfig {
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

interface PaymentResponse {
  amount: string;
  esewaConfig: EsewaConfig;
}

export default function EsewaPayment() {
  const [amount, setAmount] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDummyData = async () => {
      try {
        const response = await fetch("/api/dummy-data?method=esewa");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DummyDataResponse = await response.json();
        setAmount(data.amount);
        setProductName(data.productName);
        setTransactionId(data.transactionId);

        toast({
          title: "Data loaded successfully",
          description: "Payment details have been pre-filled.",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching dummy data:", errorMessage);

        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to load initial data. Please refresh the page.",
        });
      }
    };

    fetchDummyData();
  }, [toast]);
  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "esewa",
          amount,
          productName,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`);
      }

      const paymentData: PaymentResponse = await response.json();
      toast({
        title: "Payment Initiated",
        description: "Redirecting to eSewa payment gateway...",
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const esewaPayload = {
        amount: paymentData.amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge:
          paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      };
      console.log({ esewaPayload });
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
      console.error("Payment error:", errorMessage);
      setError("Payment initiation failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Payment initiation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>eSewa Payment</CardTitle>
          <CardDescription>Enter payment details for eSewa</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NPR)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                placeholder="Enter product name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="Enter transaction ID"
                maxLength={50}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !amount || !productName || !transactionId}
            >
              {isLoading ? "Processing..." : "Pay with eSewa"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
eSewa Hashing
eSewa uses HMAC-SHA256 hashing to verify the integrity of the payment request. The hash is created using a combination of specific fields from your payment request and your secret key. Here’s how it works:

Concatenate the required fields in a specific order: total_amount,transaction_uuid,product_code
Use your eSewa secret key to create an HMAC-SHA256 hash of this string.
The resulting hash is sent along with your payment request to eSewa.
Here’s an example of how to generate the eSewa signature in TypeScript:

import CryptoJS from "crypto-js";

export function generateEsewaSignature(
  secretKey: string,
  message: string
): string {
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}EPAYTEST and Secret Key
For testing purposes, eSewa provides a test environment with the following details:

Merchant Code: EPAYTEST
Secret Key: 8gBm/:&EnhH.1/q
When using the test environment:

Set your NEXT_PUBLIC_ESEWA_MERCHANT_CODE environment variable to EPAYTEST.
Set your NEXT_PUBLIC_ESEWA_SECRET_KEY environment variable to 8gBm/:&EnhH.1/q.
Remember to update these values with your actual merchant code and secret key when moving to production.

Important Notes
Never expose your secret key on the client-side. Always keep it secure on your server.
The eSewa API endpoint for the test environment is different from the production environment. Make sure to use the correct URL:
Test: https://rc-epay.esewa.com.np/api/epay/main/v2/form
Production: https://epay.esewa.com.np/api/epay/main/v2/form
By understanding and correctly implementing eSewa’s hashing process and using the provided test credentials, you can ensure a secure and successful integration of eSewa payments in your Next.js application.

You can use the following credentials and information for testing

eSewa ID: 9806800001/2/3/4/5
Password: Nepal@123 MPIN: 1122 Token:123456

Khalti Payment Component
The Khalti component functions similarly but redirects the user to Khalti’s payment URL upon success.

// app/khalti-payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Script from "next/script";

export default function KhaltiPayment() {
  const [amount, setAmount] = useState("");
  const [productName, setProductName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDummyData = async () => {
      try {
        const response = await fetch("/api/dummy-data?method=khalti");
        if (!response.ok) {
          throw new Error("Failed to fetch dummy data");
        }
        const data = await response.json();
        setAmount(data.amount);
        setProductName(data.productName);
        setTransactionId(data.transactionId);
      } catch (error) {
        console.error("Error fetching dummy data:", error);
      }
    };

    fetchDummyData();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "khalti",
          amount,
          productName,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const data = await response.json();

      if (!data.khaltiPaymentUrl) {
        throw new Error("Khalti payment URL not received");
      }
      window.location.href = data.khaltiPaymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.22.0.0.0/khalti-checkout.iffe.js"
        strategy="lazyOnload"
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Khalti Payment</CardTitle>
            <CardDescription>Enter payment details for Khalti</CardDescription>
          </CardHeader>
          <form onSubmit={handlePayment}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (NPR)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay with Khalti"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
If you’re integrating Khalti into your application:

For Sandbox Access

Signup from here as a merchant.

Please use 987654 as login OTP for sandbox env.

For Production Access

Please visit here

You can use the following credentials and information for testing

Test Khalti ID for 9800000000 9800000001 9800000002 9800000003 9800000004 9800000005

Test MPIN 1111

Test OTP 987654

```

Bookings component code:

```
"use client";

const Bookings: React.FC<BookingsProps> = ({
  bookingsDetails,
  open,
  setOpen,
  vendorId,
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

  const { isUploading, progresses, uploadFiles, uploadedFile } = useUploadFile(
    "imageUploader",
    {},
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
      quantity: quantity,
      paymentScreenshot: uploadedFile?.[0]?.url,
      note: message,
    };

    console.log({ booking });

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
  const { mutateAsync: paymentMutation } = api.payment.create.useMutation();

  const payviaesewa = async () => {
    const { esewaURL } = await paymentMutation({
      rentalId: vendorId,
      amount: getSelectedVehiclePrice(),
    });

    void router.push(esewaURL);
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
          // ...
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
                  <Button onClick={() => payviaesewa()}>Pay via Esewa</Button>
                  {/* <div className="flex flex-1 items-center">
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
                  </Button> */}
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
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Bookings;
```

---

so i have given you a documentation type file where there is the code to integrate esewa and khalti in nextjs.

now integrate the same thing in my codebase but my codebase has trpc which is from t3-stack with drizzle orm.

i have given you a code which is frontend code which has a booking thing.

build a trpc backend with the integration of khalti and ewsewa.

in my code after the payment succeeded, i have to create a booking with the payment detail. no sure how to handle the booking mutation after the redirection cause the saved data of the bookings will be deleted after the refresh.

build a logic to solve this issue of the booking after payment successful. (or you can first do the booking and after payment update the booking with the updated payment.

just write the code without explaination.
