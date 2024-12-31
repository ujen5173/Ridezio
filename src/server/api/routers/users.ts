import { type inferRouterOutputs, TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import {
  businesses,
  favourite,
  rentals,
  reviews,
  users,
  vehicles,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),

  bookmark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alreadyBookmarked = await ctx.db.query.favourite.findFirst({
        where: and(
          eq(favourite.userId, ctx.session.user.id),
          eq(favourite.businessId, input.id),
        ),
      });
      if (alreadyBookmarked) {
        await ctx.db
          .delete(favourite)
          .where(
            and(
              eq(favourite.userId, ctx.session.user.id),
              eq(favourite.businessId, input.id),
            ),
          );
      } else {
        await ctx.db.insert(favourite).values({
          userId: ctx.session.user.id,
          businessId: input.id,
        });
      }
      return true;
    }),

  favourite: protectedProcedure
    .input(
      z.object({
        vendor: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.favourite.findFirst({
        where: and(
          eq(favourite.userId, ctx.session.user.id),
          eq(favourite.businessId, input.vendor),
        ),
      });

      return !!result;
    }),

  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        id: rentals.id,
        vendorId: rentals.businessId,
        vendorName: getTableColumns(businesses).name,
        vendorSlug: getTableColumns(businesses).slug,
        status: rentals.status,
        location: getTableColumns(businesses).location,
        quantity: rentals.quantity,
        paymentStatus: rentals.paymentStatus,
        bookedOn: rentals.createdAt,
        startDate: rentals.rentalStart,
        endDate: rentals.rentalEnd,
        totalPrice: rentals.totalPrice,
        type: getTableColumns(vehicles).type,
        vehicleName: getTableColumns(vehicles).name,
      })
      .from(rentals)
      .leftJoin(businesses, eq(businesses.id, rentals.businessId))
      .leftJoin(vehicles, eq(vehicles.id, rentals.vehicleId))
      .orderBy(desc(rentals.createdAt))
      .where(eq(rentals.userId, ctx.session.user.id));

    const canUserReview = await ctx.db
      .select({ id: reviews.id, businessId: reviews.businessId })
      .from(reviews)
      .where(eq(reviews.userId, ctx.session.user.id));

    return result.map((order) => ({
      ...order,
      canReview: !canUserReview.some(
        (review) => review.businessId === order.vendorId,
      ),
    }));
  }),

  getFavourite: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        id: getTableColumns(businesses).id,
        name: getTableColumns(businesses).name,
        slug: getTableColumns(businesses).slug,
        rating: getTableColumns(businesses).rating,
        ratingCount: getTableColumns(businesses).ratingCount,
        images: getTableColumns(businesses).images,
        location: getTableColumns(businesses).location,
        satisfiedCustomers: getTableColumns(businesses).satisfiedCustomers,
        availableVehiclesTypes:
          getTableColumns(businesses).availableVehicleTypes,
      })
      .from(favourite)
      .where(eq(favourite.userId, ctx.session.user.id))
      .rightJoin(businesses, eq(businesses.id, favourite.businessId))
      .orderBy(desc(favourite.createdAt));

    return result;
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        phoneNumber: z.string().max(11).optional().nullable(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.db
          .update(users)
          .set(input)
          .where(eq(users.id, ctx.session.user.id))
          .returning();

        return updatedUser[0];
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid input data",
            cause: error.issues,
          });
        }

        console.error("Unexpected error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(users)
      .set({
        deleted: true,
      })
      .where(eq(users.id, ctx.session.user.id));
    return true;
  }),

  changeRole: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        role: z.enum(["USER", "VENDOR"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id ?? ctx.session.user.id));
      return true;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.select().from(users).where(eq(users.id, input.id));
    }),

  getUserDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });

    return user;
  }),

  businessReviews: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.reviews.findMany({
      where: eq(reviews.userId, ctx.session.user.id),
      with: {
        business: {
          columns: {
            name: true,
            slug: true,
          },
        },
        rental: {
          columns: {
            id: true,
            quantity: true,
            rentalStart: true,
            rentalEnd: true,
            totalPrice: true,
          },
          with: {
            vehicle: {
              columns: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return result;
  }),
});
export type UserRouter = typeof userRouter;

export type GetUserOrdersType = inferRouterOutputs<UserRouter>["getUserOrders"];
export type GetUserBusinessReviewType =
  inferRouterOutputs<UserRouter>["businessReviews"];
