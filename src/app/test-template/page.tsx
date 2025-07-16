"use client";

import {
  bookingConfirmationEmailToUser,
  bookingEmailToUser,
  bookingEmailToVendor,
  bookingRejectionEmailToUser,
} from "~/lib/email-template";
import { type BookingDetails } from "~/server/api/routers/email";

const sampleBookingDetails: BookingDetails = {
  id: "...29f2d7d01b8a",
  vehicleName: "HARDTAIL - GIANT TALON 1",
  rentalStart: new Date("2025-01-20T10:00:00.000Z"),
  rentalEnd: new Date("2025-01-23T10:00:00.000Z"),
  quantity: 1,
  vehicleImages: [
    {
      url: "http://localhost:3000/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2FoGGp19TCxhl95NW6EneLh2AOIMRStxp7od1v4qUfgnmDeycV&w=1920&q=75",
      id: "img1",
      order: 1,
    },
  ],
  userName: "Ujen Basi",
  userEmail: "ujenbasi@gmail.com",
  userPhoneNumber: "9812345678",
  businessName: "Himalayan Single Track Pvt. Ltd.",
  totalPrice: 3000,
  num_of_days: 3,
  paymentMethod: "cash",
  notes: null,
  businessImages: [
    {
      url: "https://www.Ridezio.me/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2FoGGp19TCxhl9z0iSCrog2rTZhiMdzf39c4oNO6tekp0JKBlA&w=1920&q=75",
      id: "img1",
      order: 1,
    },
  ],
  businessOwnerEmail: "ridezio.company@gmail.com",
  businessPhone: ["98123432432"],
};

export default function EmailTemplateTest() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Email Template Tests</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Booking Email to Vendor</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: bookingEmailToVendor(sampleBookingDetails),
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">2. Booking Email to User</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: bookingEmailToUser(sampleBookingDetails),
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">3. Booking Rejection Email</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: bookingRejectionEmailToUser(sampleBookingDetails),
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">4. Booking Confirmation Email</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: bookingConfirmationEmailToUser(sampleBookingDetails),
          }}
        />
      </div>
    </div>
  );
}
