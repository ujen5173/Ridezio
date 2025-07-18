import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { and, desc, eq, getTableColumns, not } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { slugifyDefault } from "~/lib/helpers";
import {
  accessories,
  accessoriesOrder,
  accessoriesReviews,
  businesses,
  users,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const accessoriesRouter = createTRPCRouter({
  getSingle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const accessoriesData = await ctx.db.query.accessories.findFirst({
          where: eq(accessories.id, input.id),
        });

        return accessoriesData;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
          images: z
            .object({
              id: z.string(),
              url: z.string(),
              order: z.number(),
            })
            .array(),
          basePrice: z.number(),
          inventory: z.number(),
          brand: z.string().optional(),
          category: z.string(),
          description: z.string().optional(),
          sizes: z.array(z.string()).default([]),
          colors: z.array(z.string()).default([]),
          discount: z.number().optional(),
        }),
        editId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, editId } = input;

      const [business] = await ctx.db
        .select({
          id: businesses.id,
        })
        .from(businesses)
        .where(eq(businesses.ownerId, ctx.session.user.id));

      if (!business) {
        throw new Error("Business not found");
      }

      try {
        if (editId) {
          await ctx.db
            .update(accessories)
            .set({
              ...data,
              slug: slugify(data.name, slugifyDefault),
            })
            .where(eq(accessories.id, editId));

          return true;
        } else {
          await ctx.db.transaction(async (trx) => {
            await trx.insert(accessories).values({
              ...data,
              businessId: business.id,
              slug: slugify(data.name, slugifyDefault),
            });
            await trx
              .update(businesses)
              .set({
                sellGears: true,
              })
              .where(eq(accessories.businessId, business.id));
          });

          return true;
        }
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),

  getVendorAccessories: protectedProcedure.query(async ({ ctx }) => {
    try {
      const businessId = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.ownerId, ctx.session.user.id),
      });

      if (!businessId) {
        throw new Error("Business not found");
      }

      const res = await ctx.db
        .select({
          id: accessories.id,
          name: accessories.name,
          brand: accessories.brand,
          sizes: accessories.sizes,
          colors: accessories.colors,
          inventory: accessories.inventory,
          basePrice: accessories.basePrice,
          images: accessories.images,
          category: accessories.category,
          createdAt: accessories.createdAt,
        })
        .from(accessories)
        .where(eq(accessories.businessId, businessId.id))
        .orderBy(desc(accessories.createdAt));

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, please try again",
      });
    }
  }),

  getAccessories: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.slug, input.slug),
        columns: {
          name: true,
        },
        with: {
          accessories: {
            columns: {
              id: true,
              name: true,
              slug: true,
              images: true,
              basePrice: true,
              inventory: true,
              brand: true,
              category: true,
              discount: true,
            },
          },
        },
      });

      return result;
    }),

  getSingleAccessory: publicProcedure
    .input(
      z.object({
        product: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.accessories.findFirst({
        where: eq(accessories.slug, input.product),
        with: {
          business: {
            columns: {
              name: true,
              slug: true,
              logo: true,
              rating: true,
              ratingCount: true,
              instagramHandle: true,
              phoneNumbers: true,
              location: true,
            },
          },
        },
      });

      return result;
    }),

  getReviews: publicProcedure
    .input(
      z.object({
        accessoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select({
          id: accessoriesReviews.id,
          rating: accessoriesReviews.rating,
          content: accessoriesReviews.review,
          user: {
            name: getTableColumns(users).name,
            image: getTableColumns(users).image,
          },
          createdAt: accessoriesReviews.createdAt,
        })
        .from(accessoriesReviews)
        .innerJoin(users, eq(accessoriesReviews.userId, users.id))
        .where(eq(accessoriesReviews.accessoryId, input.accessoryId));

      return res;
    }),

  getSimilarProducts: publicProcedure
    .input(
      z.object({
        product: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accesory = await ctx.db.query.accessories.findFirst({
        where: eq(accessories.slug, input.product),
      });

      const result = await ctx.db.query.accessories.findMany({
        where: and(
          eq(accessories.category, accesory?.category ?? ""),
          not(eq(accessories.id, accesory?.id ?? "")),
        ),
        limit: 6,
      });

      return result;
    }),

  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const business = await ctx.db.query.businesses.findFirst({
      where: eq(businesses.ownerId, ctx.session.user.id),
    });

    if (!business) {
      throw new Error("Business not found");
    }

    const result = await ctx.db
      .select({
        id: accessoriesOrder.id,
        customerName: accessoriesOrder.customerName,
        total: accessoriesOrder.total,
        quantity: accessoriesOrder.quantity,
        createdAt: accessoriesOrder.createdAt,
      })
      .from(accessoriesOrder)
      .where(eq(accessoriesOrder.businessId, business.id))
      .orderBy(desc(accessoriesOrder.createdAt));

    return result;
  }),

  placeOrder: protectedProcedure
    .input(
      z.object({
        data: z.object({
          accessoryId: z.string(),
          quantity: z.number(),
          customerName: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      try {
        const business = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.ownerId, ctx.session.user.id),
        });

        if (!business) {
          throw new TRPCError({
            message: "Business not found",
            code: "NOT_FOUND",
          });
        }

        const accessory = await ctx.db.query.accessories.findFirst({
          where: eq(accessories.id, data.accessoryId),
        });

        if (!accessory) {
          throw new TRPCError({
            message: "Accessory not found",
            code: "NOT_FOUND",
          });
        }

        const total = accessory.basePrice * data.quantity;

        await ctx.db.transaction(async (trx) => {
          await trx.insert(accessoriesOrder).values({
            businessId: business.id,
            accessoryId: data.accessoryId,
            quantity: data.quantity,
            customerName: data.customerName,
            total,
          });

          await trx.update(accessories).set({
            inventory: accessory.inventory - data.quantity,
          });
        });

        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),
});

export type GetSingleAccessoriesType = inferRouterOutputs<
  typeof accessoriesRouter
>["getSingle"];
export type GetVendorAccessories = inferRouterOutputs<
  typeof accessoriesRouter
>["getVendorAccessories"];
export type GetAccessories = inferRouterOutputs<
  typeof accessoriesRouter
>["getAccessories"];
export type GetSingleAccessory = inferRouterOutputs<
  typeof accessoriesRouter
>["getSingleAccessory"];
export type GetOrders = inferRouterOutputs<
  typeof accessoriesRouter
>["getOrders"];
