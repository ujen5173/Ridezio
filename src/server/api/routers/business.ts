import { type inferRouterOutputs, TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, not, sql } from "drizzle-orm";
import slugify from "slugify";
import { z, ZodError } from "zod";
import { slugifyDefault } from "~/lib/helpers";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  businesses,
  businessStatusEnum,
  rentals,
  users,
  vehicles,
  vehicleTypeEnum,
} from "~/server/db/schema";

interface DashboardMetrics {
  total_revenue: number;
  orders_total: number;
  orders_today: number;
  orders_yesterday: number;
  current_month_revenue: number;
  current_month_orders: number;
  previous_month_revenue: number;
  previous_month_orders: number;
}

interface GrowthMetrics {
  revenue_growth: number;
  orders_growth: number;
  daily_orders_growth: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface DailyData {
  date: string;
  value: number;
  orders: number;
}

// Advanced input validation schema
const VendorSearchInputSchema = z.object({
  // Basic location info
  lat: z.number().optional(),
  lng: z.number().optional(),

  // Distance and filtering options
  maxDistance: z.number().default(10), // km
  minRating: z.number().min(0).max(5).optional(),

  // Vehicle type filtering
  vehicleTypes: z.array(z.enum(["car", "bike", "scooter"])).optional(),

  // Pagination and sorting
  limit: z.number().max(100).default(20),
  offset: z.number().default(0),

  // Additional filtering options
  sellsGears: z.boolean().optional(),
  status: z.enum(["active", "setup-incomplete"]).optional(),
});

// Haversine distance calculation (both for JS and SQL)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const businessRouter = createTRPCRouter({
  getStoreName: protectedProcedure.query(async ({ ctx }) => {
    const business = await ctx.db
      .select({
        name: businesses.name,
      })
      .from(businesses)
      .where(eq(businesses.ownerId, ctx.session.user.id));

    return business[0]?.name;
  }),

  current: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.businesses.findFirst({
      where: eq(businesses.ownerId, ctx.session.user.id),
    });
  }),

  // Get popular shops based on rating
  getPopularShops: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: businesses.id,
        name: businesses.name,
        slug: businesses.slug,
        rating: businesses.rating,
        location: businesses.location,
        availableVehiclesTypes: businesses.availableVehicleTypes,
        satisfiedCustomers: businesses.satisfiedCustomers,
        images: businesses.images,
      })
      .from(businesses)
      .where(
        and(
          sql`${businesses.rating} >= 0`,
          sql`${businesses.ratingCount} >= 0`,
          eq(businesses.status, "active"),
        ),
      )
      .orderBy(sql`(${businesses.rating} * ${businesses.ratingCount}) DESC`)
      .limit(8);
  }),

  getDashboardInfo: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    const business = await ctx.db.query.businesses.findFirst({
      columns: {
        id: true,
        name: true,
        createdAt: true,
      },
      where: eq(businesses.ownerId, ctx.session.user.id),
    });

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Vendor not found",
      });
    }

    const signUpDate = new Date(business.createdAt);
    signUpDate.setHours(0, 0, 0, 0);

    const daysSinceSignUp = Math.floor(
      (today.getTime() - signUpDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    signUpDate.setHours(0, 0, 0, 0);

    const currentPeriodStart =
      daysSinceSignUp <= 30
        ? new Date(signUpDate)
        : (() => {
            const date = new Date(today);
            date.setDate(today.getDate() - 29);
            return date;
          })();

    // For previous period
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    // Format dates for SQL queries - convert to ISO string and take just the date part
    const formatDateForSQL = (date: Date) => date.toISOString().split("T")[0];

    const currentPeriodStartFormatted = sql`${formatDateForSQL(currentPeriodStart)}`;
    const previousPeriodStartFormatted = sql`${formatDateForSQL(previousPeriodStart)}`;

    // Get metrics including current and previous period data
    const metrics = await ctx.db
      .select({
        total_revenue: sql<number>`COALESCE(SUM(${rentals.totalPrice}), 0)`,
        orders_total: sql<number>`COUNT(*)`,
        orders_today: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) = CURRENT_DATE 
          THEN 1 ELSE 0 
        END), 0)`,
        orders_yesterday: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) = CURRENT_DATE - 1
          THEN 1 ELSE 0 
        END), 0)`,
        current_month_revenue: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) >= ${currentPeriodStartFormatted}
          AND DATE(${rentals.createdAt}) <= CURRENT_DATE
          THEN ${rentals.totalPrice} ELSE 0 
        END), 0)`,
        current_month_orders: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) >= ${currentPeriodStartFormatted}
          AND DATE(${rentals.createdAt}) <= CURRENT_DATE
          THEN 1 ELSE 0 
        END), 0)`,
        previous_month_revenue: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) >= ${previousPeriodStartFormatted}
          AND DATE(${rentals.createdAt}) < ${currentPeriodStartFormatted}
          THEN ${rentals.totalPrice} ELSE 0 
        END), 0)`,
        previous_month_orders: sql<number>`COALESCE(SUM(CASE 
          WHEN DATE(${rentals.createdAt}) >= ${previousPeriodStartFormatted}
          AND DATE(${rentals.createdAt}) < ${currentPeriodStartFormatted}
          THEN 1 ELSE 0 
        END), 0)`,
      })
      .from(rentals)
      .where(and(eq(rentals.businessId, business.id)))
      .then((rows) => rows[0] as DashboardMetrics);

    // Get daily aggregated data for charts
    const dailyData = await ctx.db
      .select({
        date: sql<string>`DATE(${rentals.createdAt})::text`,
        value: sql<number>`COALESCE(SUM(${rentals.totalPrice}), 0)`,
        orders: sql<number>`COUNT(*)`,
      })
      .from(rentals)
      .where(
        and(
          eq(rentals.businessId, business.id),
          sql`${rentals.createdAt} >= ${currentPeriodStart.toISOString()}::timestamp`,
          sql`${rentals.createdAt} < ${endDate.toISOString()}::timestamp`,
        ),
      )
      .groupBy(sql`DATE(${rentals.createdAt})`)
      .orderBy(sql`DATE(${rentals.createdAt})`);

    const formatDateToString = (date: Date): string => {
      const isoString = date.toISOString();
      return isoString.split("T")[0]!;
    };

    const generateInitialChartData = (
      currentPeriodStart: Date,
      today: Date,
    ): ChartDataPoint[] => {
      const data: ChartDataPoint[] = [];
      const currentDate = new Date(currentPeriodStart);

      while (formatDateToString(currentDate) <= formatDateToString(today)) {
        data.push({
          date: formatDateToString(currentDate),
          value: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return data;
    };

    const mergeChartData = (
      initialData: ChartDataPoint[],
      actualData: DailyData[],
      valueKey: keyof Pick<DailyData, "value" | "orders">,
    ): ChartDataPoint[] => {
      const dataMap = new Map(
        actualData.map((item) => [item.date, item[valueKey]]),
      );

      return initialData.map((item) => ({
        date: item.date,
        value: +(dataMap.get(item.date) ?? 0),
      }));
    };

    const calculateGrowth = (
      current: number,
      previous: number,
      isNewVendor: boolean,
    ): number => {
      if (isNewVendor) {
        return current > 0 ? 100 : 0;
      }

      if (previous === 0 && current === 0) return 0;
      if (previous === 0) return 100;

      const growth = ((current - previous) / previous) * 100;
      if (growth > 100) return 100;
      if (growth < -100) return -100;

      return Number(growth.toFixed(2));
    };

    const isNewVendor = daysSinceSignUp <= 30;
    const initialChartData = generateInitialChartData(
      currentPeriodStart,
      today,
    );

    const store_revenue_chart_data = mergeChartData(
      initialChartData,
      dailyData,
      "value",
    );

    const store_orders_chart_data = mergeChartData(
      initialChartData,
      dailyData,
      "orders",
    );

    const growth_metrics: GrowthMetrics = {
      revenue_growth: calculateGrowth(
        metrics.current_month_revenue,
        metrics.previous_month_revenue,
        isNewVendor,
      ),
      orders_growth: calculateGrowth(
        metrics.current_month_orders,
        metrics.previous_month_orders,
        isNewVendor,
      ),
      daily_orders_growth: calculateGrowth(
        metrics.orders_today,
        metrics.orders_yesterday,
        false,
      ),
    };

    return {
      store: {
        id: business.id,
        name: business.name,
      },
      metrics: {
        total_revenue: Math.max(metrics.total_revenue, 0),
        orders_total: Math.max(metrics.orders_total, 0),
        orders_today: Math.max(metrics.orders_today, 0),
        orders_yesterday: Math.max(metrics.orders_yesterday, 0),
        current_month_revenue: Math.max(metrics.current_month_revenue, 0),
        current_month_orders: Math.max(metrics.current_month_orders, 0),
        previous_month_revenue: Math.max(metrics.previous_month_revenue, 0),
        previous_month_orders: Math.max(metrics.previous_month_orders, 0),
      },
      growth: growth_metrics,
      store_revenue_chart_data,
      store_orders_chart_data,
    };
  }),

  getOrders: protectedProcedure.query(async ({ ctx }) => {
    // Get business ID
    const business = await ctx.db.query.businesses.findFirst({
      columns: { id: true },
      where: eq(businesses.ownerId, ctx.session.user.id),
    });

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Vendor not found",
      });
    }

    // Get all orders for the business
    const orders = await ctx.db
      .select({
        order: rentals.id,
        customer: users.name,
        payment: rentals.paymentMethod,
        paymentStatus: rentals.paymentStatus,
        status: rentals.status,
        vehicle: vehicles.name,
        vehicle_type: vehicles.type,
        quantity: rentals.quantity,
        amount: rentals.totalPrice,
        date: {
          start: rentals.rentalStart,
          end: rentals.rentalEnd,
        },
        notes: rentals.notes,
        num_of_days: rentals.num_of_days,
        createdAt: rentals.createdAt,
      })
      .from(rentals)
      .where(eq(rentals.businessId, business.id))
      .leftJoin(vehicles, eq(vehicles.id, rentals.vehicleId))
      .leftJoin(users, eq(users.id, rentals.userId))
      .orderBy(desc(rentals.createdAt));

    return orders;
  }),

  getVendor: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            eq(businesses.slug, input.slug),
            not(eq(businesses.status, "setup-incomplete")),
          ),
        );

      return result;
    }),

  allowedVehicles: protectedProcedure.query(async ({ ctx }) => {
    const [business] = await ctx.db
      .select({
        vehicleTypes: businesses.availableVehicleTypes,
      })
      .from(businesses)
      .where(eq(businesses.ownerId, ctx.session.user.id));

    return business?.vehicleTypes;
  }),

  // Search shops with location and availability
  // TODO: add the bounding params instead of kmsgetVendorAroundLocation: publicProcedure
  getVendorAroundLocation: publicProcedure
    .input(VendorSearchInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Validate location for search
        if (!input.lat || !input.lng) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Location coordinates are required",
          });
        }

        // Define distance calculation as a reusable SQL fragment
        const distanceCalculation = sql<number>`6371 * 2 * ASIN(
        SQRT(
          POWER(SIN((${input.lat} - (business.location->>'lat')::numeric) * PI()/180 / 2), 2) +
          COS(${input.lat} * PI()/180) * COS((business.location->>'lat')::numeric * PI()/180) *
          POWER(SIN((${input.lng} - (business.location->>'lng')::numeric) * PI()/180 / 2), 2)
        )
      )`;

        // Main query to fetch vendors
        const vendorsQuery = await ctx.db
          .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            rating: businesses.rating,
            location: businesses.location,
            availableVehiclesTypes: businesses.availableVehicleTypes,
            satisfiedCustomers: businesses.satisfiedCustomers,
            images: businesses.images,
          })
          .from(businesses)
          .where(
            and(
              eq(businesses.status, "active"),
              sql`${distanceCalculation} <= ${input.maxDistance}`,
            ),
          )
          .orderBy(distanceCalculation)
          .limit(input.limit)
          .offset(input.offset);

        // Count total matching vendors
        const [countResult] = await ctx.db
          .select({
            total: sql<number>`COUNT(*)`,
          })
          .from(businesses)
          .where(and(sql`${distanceCalculation} <= ${input.maxDistance}`));

        return {
          vendors: vendorsQuery,
          total: countResult?.total ?? 0,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (err) {
        console.error("Vendor search error:", err);

        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search vendors",
        });
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        bounds: z.object({
          northEast: z.object({
            lat: z.number(),
            lng: z.number(),
          }),
          southWest: z.object({
            lat: z.number(),
            lng: z.number(),
          }),
        }),
        vehicleType: z.enum(vehicleTypeEnum.enumValues).optional(),
        hasAvailableVehicles: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { northEast, southWest } = input.bounds;

      const shops = await ctx.db
        .select({
          id: businesses.id,
          name: businesses.name,
          slug: businesses.slug,
          rating: businesses.rating,
          location: businesses.location,
          availableVehiclesTypes: businesses.availableVehicleTypes,
          satisfiedCustomers: businesses.satisfiedCustomers,
          images: businesses.images,
        })
        .from(businesses)
        .where(
          and(
            eq(businesses.status, "active"),
            input.query
              ? ilike(businesses.name, `%${input.query}%`)
              : undefined,
          ),
        );

      return shops.filter((shop) => {
        const shopLocation = shop.location as {
          lat?: number;
          lng?: number;
        };

        if (shopLocation.lat === undefined || shopLocation.lng === undefined)
          return false;

        return (
          shopLocation.lat <= northEast.lat &&
          shopLocation.lat >= southWest.lat &&
          shopLocation.lng <= northEast.lng &&
          shopLocation.lng >= southWest.lng
        );
      });
    }),

  getMultiple: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            sql`${businesses.id} = ANY(${input.ids})`,
            eq(businesses.status, "active"),
          ),
        );
    }),

  // Get all shops with infinite query
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db
        .select({
          id: businesses.id,
          name: businesses.name,
          location: businesses.location,
          rating: businesses.rating,
          ratingCount: businesses.ratingCount,
          logo: businesses.logo,
          availableVehicles: businesses.availableVehicleTypes,
        })
        .from(businesses)
        .where(
          and(
            input.cursor ? sql`${businesses.id} > ${input.cursor}` : undefined,
            eq(businesses.status, "active"),
          ),
        )
        .orderBy(desc(businesses.id))
        .limit(input.limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get multiple vehicles
  getVehicles: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(vehicles)
        .where(sql`${vehicles.id} = ANY(${input.ids})`);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        location: z.object({
          map: z.string().url(),
          lat: z.number(),
          lng: z.number(),
          address: z.string().min(2).max(50),
          city: z.string().min(2).max(50),
        }),
        phoneNumbers: z.array(z.string().min(10).max(15)),
        businessHours: z.record(
          z.string().min(2).max(50),
          z.object({
            open: z.string().min(2).max(50),
            close: z.string().min(2).max(50),
          }),
        ),
        availableVehicleTypes: z.array(z.enum(vehicleTypeEnum.enumValues)),
        logo: z.string().url(),
        images: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const business = await ctx.db.insert(businesses).values({
          ...input,
          ownerId: ctx.session.user.id,
        });

        return business;
      } catch (error) {
        // check for zod error, trpc error, database error, etc.
        if (error instanceof TRPCError) {
          throw error;
        } else if (error instanceof ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid input",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, {
            message: "Business name must be at least 2 characters",
          })
          .max(50)
          .nullable(),
        location: z.object({
          map: z.string().url(),
          lat: z.number().min(1, { message: "Enter your business latitude" }),
          lng: z.number().min(1, { message: "Enter your business longitude" }),
          address: z
            .string()
            .min(2, { message: "Add Address of you business" })
            .max(50),
          city: z.string().min(2, { message: "Enter City name" }).max(50),
        }),
        sellGears: z.boolean().default(false),
        phoneNumbers: z.array(
          z
            .string()
            .min(9, { message: "Enter a valid Number" })
            .max(15, { message: "Enter a valid Number" }),
        ),
        businessHours: z.record(
          z.string().min(2).max(50),
          z
            .object({
              open: z.string().min(2).max(50),
              close: z.string().min(2).max(50),
            })
            .nullable(),
        ),
        availableVehicleTypes: z
          .array(z.enum(vehicleTypeEnum.enumValues))
          .nonempty(),
        logo: z.string().url().nullable(),
        faqs: z.array(
          z.object({
            id: z.string(),
            question: z.string(),
            answer: z.string(),
            order: z.number(),
          }),
        ),
        images: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const business = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.ownerId, ctx.session.user.id),
          columns: { id: true, status: true },
        });

        if (!business) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vendor not found",
          });
        }

        const updatedBusiness = await ctx.db
          .update(businesses)
          .set({
            ...input,
            slug: slugify(input.name!, slugifyDefault),
            status:
              business.status === "setup-incomplete"
                ? "active"
                : business.status,
          })
          .where(eq(businesses.ownerId, ctx.session.user.id))
          .returning();
        await ctx.db
          .update(users)
          .set({ vendor_setup_complete: true })
          .where(eq(users.id, ctx.session.user.id));

        return updatedBusiness[0];
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

  setBusinessStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(businessStatusEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const business = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.ownerId, ctx.session.user.id),
        columns: { id: true },
      });

      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vendor not found",
        });
      }

      return await ctx.db
        .update(businesses)
        .set({ status: input.status })
        .where(eq(businesses.ownerId, ctx.session.user.id))
        .returning();
    }),

  getBookingsDetails: publicProcedure
    .input(
      z.object({
        businessId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Fetch available vehicle types for the business
      const vehicleTypesData = ctx.db
        .select({ vehicleTypes: businesses.availableVehicleTypes })
        .from(businesses)
        .where(eq(businesses.id, input.businessId));

      // Fetch all vehicles for the business
      const allVendorVehiclesData = ctx.db
        .select({
          id: vehicles.id,
          name: vehicles.name,
          type: vehicles.type,
          category: vehicles.category,
          basePrice: vehicles.basePrice,
          inventory: vehicles.inventory,
        })
        .from(vehicles)
        .where(eq(vehicles.businessId, input.businessId));

      const rentedVehiclesData = ctx.db
        .select({
          rentalStart: rentals.rentalStart,
          rentalEnd: rentals.rentalEnd,
          vehicleId: rentals.vehicleId,
          quantity: rentals.quantity,
        })
        .from(rentals)
        .where(
          and(
            eq(rentals.businessId, input.businessId),
            eq(rentals.status, "approved"),
          ),
        );

      const [, allVendorVehicles, rentedVehicles] = await Promise.all([
        vehicleTypesData,
        allVendorVehiclesData,
        rentedVehiclesData,
      ]);

      // Create a map of the lowest base price for each vehicle type
      const basePricesMap = Object.fromEntries(
        (
          await ctx.db
            .select({
              type: vehicles.type,
              basePrice: vehicles.basePrice,
            })
            .from(vehicles)
            .where(eq(vehicles.businessId, input.businessId))
        ).map(({ type, basePrice }) => [
          type,
          { basePrice: typeof basePrice === "number" ? basePrice : undefined },
        ]),
      );

      const vehicleTypesResult = Object.entries(basePricesMap).map(
        ([type, { basePrice }]) => ({
          [type]: {
            label: type,
            startingPrice: basePrice,
            types: allVendorVehicles
              .filter((vehicle) => vehicle.type === type)
              .reduce(
                (acc, vehicle) => {
                  const { category, id, name, basePrice, inventory } = vehicle;
                  const categoryIndex = acc.findIndex(
                    (c) => c.category === category,
                  );
                  if (categoryIndex === -1) {
                    acc.push({
                      category,
                      vehicles: [{ id, name, basePrice, inventory }],
                    });
                  } else if (acc[categoryIndex]) {
                    acc[categoryIndex].vehicles.push({
                      id,
                      name,
                      basePrice,
                      inventory,
                    });
                  }
                  return acc;
                },
                [] as {
                  category: string;
                  vehicles: {
                    id: string;
                    name: string;
                    basePrice: number;
                    inventory: number;
                  }[];
                }[],
              ),
          },
        }),
      );

      return {
        bookings: rentedVehicles,
        vehicleTypes: Object.fromEntries(
          vehicleTypesResult
            .map((item) => Object.entries(item)[0])
            .filter(
              (
                entry,
              ): entry is [
                string,
                {
                  label: string;
                  startingPrice: number | undefined;
                  types: {
                    category: string;
                    vehicles: {
                      id: string;
                      name: string;
                      basePrice: number;
                      inventory: number;
                    }[];
                  }[];
                },
              ] => entry !== undefined,
            ),
        ),
      };
    }),
});

export type BusinessRouter = typeof businessRouter;
export type GetVendorType = inferRouterOutputs<BusinessRouter>["getVendor"];
export type GetBookingsType =
  inferRouterOutputs<BusinessRouter>["getBookingsDetails"];
export type GetOrdersType = inferRouterOutputs<BusinessRouter>["getOrders"];
export type GetPopularShops =
  inferRouterOutputs<BusinessRouter>["getPopularShops"];
export type GetSearchedShops = inferRouterOutputs<BusinessRouter>["search"];
