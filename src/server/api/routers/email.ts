import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { type Session } from "next-auth";
import {
  bookingConfirmationEmailToUser,
  bookingEmailToUser,
  bookingEmailToVendor,
  bookingRejectionEmailToUser,
} from "~/lib/email-templates";
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
  vehicleImages: string[];
  userName: string | null;
  userEmail: string;
  userPhoneNumber: string | null;
  businessName: string | null;
  totalPrice: number;
  num_of_days: number;
  paymentMethod: "online" | "onsite" | null;
  notes: string | null;
  businessOwnerEmail: string | null;
};

export type BookingUpdateDetails = {
  id: string;
  vehicleName: string;
  rentalStart: Date;
  rentalEnd: Date;
  businessName: string | null;
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
        };
      });

    if (!bookingDetails) {
      return {
        success: false,
      };
    }

    //? Email to VENDOR
    await transporter.sendMail({
      from: "Velocit Team",
      to: bookingDetails.businessOwnerEmail,
      subject: `Vehicle ${bookingDetails.vehicleName} for ${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}`,
      html: bookingEmailToVendor(bookingDetails),
    });

    // Email to USER
    await transporter.sendMail({
      from: "Velocit Team",
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
  session,
  status,
}: {
  bookingId: string;
  session: Session;
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
          vehicle: {
            columns: {
              name: true,
            },
          },
          business: {
            columns: {
              name: true,
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
        };
      });

    if (!bookingDetails) {
      return {
        success: false,
      };
    }

    //? Email to USER
    await transporter.sendMail({
      from: "Velocit Team",
      to: session.user.email,
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
