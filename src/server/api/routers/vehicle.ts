import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { slugifyDefault } from "~/lib/helpers";
import { businesses, vehicles, vehicleTypeEnum } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const vehicleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: z.object({
          businessId: z.string(),
          name: z.string(),
          type: z.enum(vehicleTypeEnum.enumValues).optional().default("bike"),
          category: z.string().min(1),
          images: z.array(
            z.object({
              id: z.string(),
              url: z.string().url(),
              order: z.number().default(0),
            }),
          ),
          basePrice: z.number(),
          inventory: z.number().default(1),
          features: z.array(
            z.object({
              key: z.string(),
              value: z.string(),
            }),
          ),
        }),
        editId: z.string().optional(),
        type: z.enum(["edit", "new"]).optional().default("new"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, editId, type } = input;

      try {
        const businesss = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.id, data.businessId),
        });

        if (!businesss) {
          throw new Error("Business not found");
        }

        if (type === "edit" && editId) {
          const updated = await ctx.db
            .update(vehicles)
            .set({
              ...data,
            })
            .where(eq(vehicles.id, editId));

          return updated;
        } else {
          const vehicle = await ctx.db.insert(vehicles).values({
            ...data,
            slug: slugify(data.name, slugifyDefault),
          });

          await ctx.db
            .update(businesses)
            .set({
              vehiclesCount: sql`${businesses.vehiclesCount} + 1`,
            })
            .where(eq(businesses.id, data.businessId));

          return vehicle;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),

  getSingle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const vehicle = await ctx.db.query.vehicles.findFirst({
          where: eq(vehicles.id, input.id),
        });

        return vehicle;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),

  getVendorVehicles: protectedProcedure.query(async ({ ctx }) => {
    try {
      const businessId = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.ownerId, ctx.session.user.id),
      });

      if (!businessId) {
        throw new Error("Business not found");
      }

      const res = await ctx.db
        .select({
          id: vehicles.id,
          name: vehicles.name,
          slug: vehicles.slug,
          basePrice: vehicles.basePrice,
          type: vehicles.type,
          inventory: vehicles.inventory,
          category: vehicles.category,
          images: vehicles.images,
          features: vehicles.features,
          createdAt: vehicles.createdAt,
          totalRentals: sql<number>`(
            SELECT COUNT(*)
            FROM rental
            WHERE vehicle_id = ${vehicles.id}
          )`,
        })
        .from(vehicles)
        .leftJoin(businesses, eq(vehicles.businessId, businesses.id))
        .where(eq(vehicles.businessId, businessId.id))
        .orderBy(desc(vehicles.createdAt));

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, please try again",
      });
    }
  }),

  getBusinessVehicles: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const vehicles = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.slug, input.slug),
          columns: {},
          with: {
            vehicles: {
              columns: {
                images: true,
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                features: true,
                type: true,
                category: true,
              },
            },
          },
        });

        if (!vehicles) {
          throw new Error("Business not found");
        }
        return vehicles.vehicles;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }
    }),
});

export type GetSingleVehicleType = inferRouterOutputs<
  typeof vehicleRouter
>["getSingle"];
export type GetBusinessVehicleType = inferRouterOutputs<
  typeof vehicleRouter
>["getVendorVehicles"];
export type GetBusinessVehiclesType = inferRouterOutputs<
  typeof vehicleRouter
>["getBusinessVehicles"];
