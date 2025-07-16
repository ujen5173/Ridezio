import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { type Session } from "next-auth";
import {
  bookingConfirmationEmailToUser,
  bookingEmailToUser,
  bookingEmailToVendor,
  bookingRejectionEmailToUser,
} from "~/lib/email-template";
import transporter from "~/lib/nodemailer";
import { db } from "~/server/db";
import { rentals } from "~/server/db/schema";
import { type rentalStatusEnum } from "./../../db/schema";

export type BookingDetails = {
  id: string;
  vehicleName: string;
  rentalStart: Date;
  rentalEnd: Date;
  quantity: number;
  vehicleImages: {
    url: string;
    id: string;
    order: number;
  }[];
  userName: string | null;
  userEmail: string;
  userPhoneNumber: string | null;
  businessName: string | null;
  totalPrice: number;
  num_of_days: number;
  paymentMethod: "online" | "cash" | null;
  notes: string | null;
  businessImages: {
    url: string;
    id: string;
    order: number;
  }[];
  businessOwnerEmail: string | null;
  businessPhone: string[];
};

export type BookingUpdateDetails = {
  id: string;
  vehicleName: string;
  rentalStart: Date;
  rentalEnd: Date;
  businessName: string | null;
  businessPhone: string[];
  quantity: number;
  totalPrice: number;
};

export const sendBookingDetailsEmail = async ({
  bookingId,
  session,
}: {
  session: Session;
  bookingId: string;
}) => {
  try {
    const bookingDetails = await db.query.rentals
      .findFirst({
        where: eq(rentals.id, bookingId),
        columns: {
          id: true,
          rentalStart: true,
          rentalEnd: true,
          quantity: true,
          totalPrice: true,
          num_of_days: true,
          paymentMethod: true,
          notes: true,
        },
        with: {
          user: {
            columns: {
              email: true,
              name: true,
              phoneNumber: true,
            },
          },
          vehicle: {
            columns: {
              name: true,
              images: true,
            },
          },
          business: {
            columns: {
              name: true,
              images: true,
              phoneNumbers: true,
            },
            with: {
              owner: {
                columns: {
                  email: true,
                },
              },
            },
          },
        },
      })
      .then((res) => {
        if (!res) return null;

        const { user, vehicle, business, ...rest } = res;
        return {
          ...rest,
          userName: user.name,
          userEmail: user.email,
          userPhoneNumber: user.phoneNumber,
          vehicleName: vehicle.name,
          vehicleImages: vehicle.images,
          businessName: business.name,
          businessOwnerEmail: business.owner.email,
          businessImages: business.images,
          businessPhone: business.phoneNumbers,
        };
      });

    if (!bookingDetails) {
      return {
        success: false,
      };
    }

    //? Email to VENDOR
    await transporter.sendMail({
      from: "Ridezio Team",
      to: bookingDetails.businessOwnerEmail,
      subject: `Vehicle ${bookingDetails.vehicleName} for ${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}`,
      html: bookingEmailToVendor(bookingDetails),
    });

    // Email to USER
    await transporter.sendMail({
      from: "Ridezio Team",
      to: session.user.email,
      subject: `Vehicle ${bookingDetails.vehicleName} for ${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}`,
      html: bookingEmailToUser(bookingDetails),
    });

    return {
      success: true,
    };
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }

  // after login as user and vendor
  // for user: after the bookings status changed
  // reviews email for user
};

export const sendBookingUpdateEmail = async ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: (typeof rentalStatusEnum.enumValues)[number];
}) => {
  try {
    const bookingDetails = await db.query.rentals
      .findFirst({
        where: eq(rentals.id, bookingId),
        columns: {
          id: true,
          rentalStart: true,
          rentalEnd: true,
          totalPrice: true,
          quantity: true,
        },
        with: {
          user: {
            columns: {
              email: true,
            },
          },
          vehicle: {
            columns: {
              name: true,
            },
          },
          business: {
            columns: {
              name: true,
              images: true,
              phoneNumbers: true,
            },
          },
        },
      })
      .then((res) => {
        if (!res) return null;

        const { vehicle, business, ...rest } = res;
        return {
          ...rest,
          vehicleName: vehicle.name,
          businessName: business.name,
          businessImages: business.images,
          businessPhone: business.phoneNumbers,
        };
      });

    if (!bookingDetails) {
      return {
        success: false,
      };
    }

    //? Email to USER
    await transporter.sendMail({
      from: "Ridezio Team",
      to: bookingDetails.user.email,
      subject: `Vehicle ${bookingDetails.vehicleName} for ${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")} Update Email`,
      html:
        status === "approved"
          ? bookingConfirmationEmailToUser(bookingDetails)
          : bookingRejectionEmailToUser(bookingDetails),
    });
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};
