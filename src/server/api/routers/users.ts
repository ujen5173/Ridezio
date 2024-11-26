import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { bookmarks, businesses, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),

  bookmark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alreadyBookmarked = await ctx.db.query.bookmarks.findFirst({
        where: and(
          eq(bookmarks.userId, ctx.session.user.id),
          eq(bookmarks.businessId, input.id),
        ),
      });
      if (alreadyBookmarked) {
        await ctx.db
          .delete(bookmarks)
          .where(
            and(
              eq(bookmarks.userId, ctx.session.user.id),
              eq(bookmarks.businessId, input.id),
            ),
          );
      } else {
        await ctx.db.insert(bookmarks).values({
          userId: ctx.session.user.id,
          businessId: input.id,
        });
      }
      return true;
    }),

  getBookmarks: protectedProcedure.query(async ({ ctx }) => {
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
      .from(bookmarks)
      .where(eq(bookmarks.userId, ctx.session.user.id))
      .rightJoin(businesses, eq(businesses.id, bookmarks.businessId))
      .orderBy(desc(bookmarks.createdAt));

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
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
    } catch (err) {
      console.log({ err });
    }
  }),
});
