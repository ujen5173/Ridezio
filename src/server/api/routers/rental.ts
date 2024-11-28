import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  businesses,
  rentals,
  rentalStatusEnum,
  vehicles,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sendBookingDetailsEmail } from "./email";

export const rentalRouter = createTRPCRouter({
  rent: protectedProcedure
    .input(
      z.object({
        vehicleId: z.string(),
        startDate: z.date(),
        totalPrice: z.number(),
        endDate: z.date(),
        quantity: z.number().default(1),
        paymentScreenshot: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate dates
      if (input.startDate > input.endDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End date must be after start date",
        });
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const startDate = new Date(input.startDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Start date cannot be in the past",
        });
      }

      const vehicle = await ctx.db
        .select({
          id: vehicles.id,
          inventory: vehicles.inventory,
          basePrice: vehicles.basePrice,
          businessId: vehicles.businessId,
        })
        .from(vehicles)
        .where(eq(vehicles.id, input.vehicleId))
        .then((results) => results[0]);

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      // Check if requested quantity exceeds total inventory
      if (input.quantity > vehicle.inventory) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Requested number of vehicles exceeds total inventory",
        });
      }

      // Get all existing rentals for this vehicle that overlap with the requested period
      const existingRentals = await ctx.db
        .select({
          quantity: rentals.quantity,
          rentalStart: rentals.rentalStart,
          rentalEnd: rentals.rentalEnd,
          status: rentals.status,
        })
        .from(rentals)
        .where(eq(rentals.vehicleId, input.vehicleId));

      // Filter active rentals that overlap with requested dates
      const activeStatuses = ["pending", "confirmed", "ongoing"];
      const overlappingRentals = existingRentals.filter(
        (rental) =>
          activeStatuses.includes(rental.status) &&
          !(
            rental.rentalEnd < input.startDate ||
            rental.rentalStart > input.endDate
          ),
      );

      // Calculate maximum vehicles rented for each day in the requested period
      const getDatesInRange = (start: Date, end: Date) => {
        const dates: Date[] = [];
        const current = new Date(start);
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      const requestedDates = getDatesInRange(input.startDate, input.endDate);

      for (const date of requestedDates) {
        const rentalsOnDate = overlappingRentals.filter((rental) => {
          const rentalStart = new Date(rental.rentalStart);
          const rentalEnd = new Date(rental.rentalEnd);
          return date >= rentalStart && date <= rentalEnd;
        });

        const totalRentedOnDate = rentalsOnDate.reduce(
          (sum, rental) => sum + rental.quantity,
          0,
        );

        const availableOnDate = vehicle.inventory - totalRentedOnDate;

        if (availableOnDate < input.quantity) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Not enough vehicles available on ${date.toLocaleDateString()}. Only ${availableOnDate} vehicle(s) available.`,
          });
        }
      }

      // Calculate number of days
      const numOfDays =
        Math.floor(
          (input.endDate.getTime() - input.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      // Create rental record
      const [rental] = await ctx.db
        .insert(rentals)
        .values({
          businessId: vehicle.businessId,
          userId: ctx.session.user.id,
          vehicleId: input.vehicleId,
          rentalStart: input.startDate,
          rentalEnd: input.endDate,
          status: rentalStatusEnum.enumValues[0],
          totalPrice: input.totalPrice,
          notes: input.notes,
          paymentMethod: input.paymentScreenshot ? "online" : "onsite",
          quantity: input.quantity,
          num_of_days: numOfDays,
          paymentScreenshot: input.paymentScreenshot,
        })
        .returning();

      if (rental) {
        await sendBookingDetailsEmail({
          session: ctx.session,
          bookingId: rental.id,
        });
      }

      return rental;
    }),

  updatedStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(rentalStatusEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const businessId = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.ownerId, ctx.session.user.id),
      });

      if (!businessId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User is not a business owner",
        });
      }

      const rental = await ctx.db
        .select({
          status: rentals.status,
        })
        .from(rentals)
        .where(
          and(
            eq(rentals.id, input.orderId),
            eq(rentals.businessId, businessId.id),
          ),
        )
        .then((results) => results[0]);

      if (!rental) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rental not found",
        });
      }

      if (rental.status === input.status) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Rental is already in this status",
        });
      }

      const result = await ctx.db
        .update(rentals)
        .set({
          status: input.status,
        })
        .where(eq(rentals.id, input.orderId));

      if (result) {
        // Send email to user after change of status
        // await sendBookingStatusEmail({
        //   session: ctx.session,
        //   bookingId: rental.id,
        // });
      }

      return true;
    }),
});
