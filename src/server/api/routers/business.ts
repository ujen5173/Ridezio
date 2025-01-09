import { type inferRouterOutputs, TRPCError } from "@trpc/server";
import axios from "axios";
import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  not,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import slugify from "slugify";
import { z, ZodError } from "zod";
import { env } from "~/env";
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
  reviews,
  users,
  vehicles,
  vehicleTypeEnum,
  views,
} from "~/server/db/schema";

type DashboardMetrics = {
  total_revenue: number;
  orders_total: number;
  orders_today: number;
  orders_yesterday: number;
  current_month_revenue: number;
  current_month_orders: number;
  previous_month_revenue: number;
  previous_month_orders: number;
  total_views: number;
  views_today: number;
  views_yesterday: number;
  current_month_views: number;
  previous_month_views: number;
};

type GrowthMetrics = {
  revenue_growth: number;
  orders_growth: number;
  daily_orders_growth: number;
  views_growth: number;
  daily_views_growth: number;
};

type ChartDataPoint = {
  date: string;
  value: number;
};

export type IpInfoResponse = {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
};

export type MonthlyData = {
  date: string;
  value?: number;
  orders?: number;
  views?: number;
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

    const currentPeriodStart =
      daysSinceSignUp <= 30
        ? signUpDate
        : (() => {
            const date = new Date(today);
            date.setDate(today.getDate() - 29);
            date.setHours(0, 0, 0, 0);
            return date;
          })();

    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    const formatDateForSQL = (date: Date) => date.toISOString().split("T")[0];

    const metrics = await ctx.db
      .select({
        total_revenue: sql<number>`COALESCE(SUM(${rentals.totalPrice}), 0)`,
        orders_total: sql<number>`COUNT(*)`,
        orders_today: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) = CURRENT_DATE 
        THEN 1 ELSE 0 
      END), 0)`,
        orders_yesterday: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) = CURRENT_DATE - INTERVAL '1 day'
        THEN 1 ELSE 0 
      END), 0)`,
        current_month_revenue: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) >= ${formatDateForSQL(currentPeriodStart)}
        AND DATE(${rentals.createdAt}) <= CURRENT_DATE
        THEN ${rentals.totalPrice} ELSE 0 
      END), 0)`,
        current_month_orders: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) >= ${formatDateForSQL(currentPeriodStart)}
        AND DATE(${rentals.createdAt}) <= CURRENT_DATE
        THEN 1 ELSE 0 
      END), 0)`,
        previous_month_revenue: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) >= ${formatDateForSQL(previousPeriodStart)}
        AND DATE(${rentals.createdAt}) < ${formatDateForSQL(currentPeriodStart)}
        THEN ${rentals.totalPrice} ELSE 0 
      END), 0)`,
        previous_month_orders: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${rentals.createdAt}) >= ${formatDateForSQL(previousPeriodStart)}
        AND DATE(${rentals.createdAt}) < ${formatDateForSQL(currentPeriodStart)}
        THEN 1 ELSE 0 
      END), 0)`,
      })
      .from(rentals)
      .where(eq(rentals.businessId, business.id))
      .then((rows) => rows[0] as DashboardMetrics);

    // Views metrics
    const viewsMetrics = await ctx.db
      .select({
        total_views: sql<number>`COUNT(*)`,
        views_today: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${views.createdAt}) = CURRENT_DATE 
        THEN 1 ELSE 0 
      END), 0)`,
        views_yesterday: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${views.createdAt}) = CURRENT_DATE - INTERVAL '1 day'
        THEN 1 ELSE 0 
      END), 0)`,
        current_month_views: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${views.createdAt}) >= ${formatDateForSQL(currentPeriodStart)}
        AND DATE(${views.createdAt}) <= CURRENT_DATE
        THEN 1 ELSE 0 
      END), 0)`,
        previous_month_views: sql<number>`COALESCE(SUM(CASE 
        WHEN DATE(${views.createdAt}) >= ${formatDateForSQL(previousPeriodStart)}
        AND DATE(${views.createdAt}) < ${formatDateForSQL(currentPeriodStart)}
        THEN 1 ELSE 0 
      END), 0)`,
      })
      .from(views)
      .where(eq(views.businessId, business.id))
      .then(
        (rows) =>
          rows[0] as {
            total_views: number;
            views_today: number;
            views_yesterday: number;
            current_month_views: number;
            previous_month_views: number;
          },
      );

    const monthly = await ctx.db
      .select({
        date: sql<string>`TO_CHAR(${rentals.createdAt}, 'YYYY-MM-DD')`,
        value: sql<number>`${rentals.totalPrice}`,
        orders: sql<number>`1`,
      })
      .from(rentals)
      .where(
        and(
          eq(rentals.businessId, business.id),
          sql`${rentals.createdAt} >= ${currentPeriodStart.toISOString()}::timestamp`,
          sql`${rentals.createdAt} < ${endDate.toISOString()}::timestamp`,
        ),
      )
      .orderBy(sql`${rentals.createdAt}`);

    const monthlyViews = await ctx.db
      .select({
        date: sql<string>`TO_CHAR(${views.createdAt}, 'YYYY-MM-DD')`,
        views: sql<number>`COUNT(*)`,
      })
      .from(views)
      .where(
        and(
          eq(views.businessId, business.id),
          sql`${views.createdAt} >= ${currentPeriodStart.toISOString()}::timestamp`,
          sql`${views.createdAt} < ${endDate.toISOString()}::timestamp`,
        ),
      )
      .groupBy(sql`TO_CHAR(${views.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${views.createdAt}, 'YYYY-MM-DD')`);

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
      const endDate = new Date(today);

      while (formatDateToString(currentDate) <= formatDateToString(endDate)) {
        data.push({
          date: formatDateToString(currentDate).slice(0, 10),
          value: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return data;
    };

    const mergeChartData = (
      initialData: ChartDataPoint[],
      actualData: MonthlyData[],
      valueKey: keyof MonthlyData,
    ): ChartDataPoint[] => {
      const dataMap = new Map<string, number>();

      actualData.forEach((item) => {
        const currentValue = dataMap.get(item.date) ?? 0;
        dataMap.set(item.date, currentValue + (item[valueKey] as number));
      });

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
      monthly,
      "value",
    );

    const store_orders_chart_data = mergeChartData(
      initialChartData,
      monthly,
      "orders",
    );

    const store_views_chart_data = mergeChartData(
      initialChartData,
      monthlyViews,
      "views",
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
      views_growth: calculateGrowth(
        viewsMetrics.current_month_views,
        viewsMetrics.previous_month_views,
        isNewVendor,
      ),
      daily_orders_growth: calculateGrowth(
        metrics.orders_today,
        metrics.orders_yesterday,
        false,
      ),
      daily_views_growth: calculateGrowth(
        viewsMetrics.views_today,
        viewsMetrics.views_yesterday,
        false,
      ),
    };

    return {
      store: {
        id: business.id,
        name: business.name,
      },
      metrics: {
        ...metrics,
        total_views: Math.max(viewsMetrics.total_views, 0),
        views_today: Math.max(viewsMetrics.views_today, 0),
        views_yesterday: Math.max(viewsMetrics.views_yesterday, 0),
        current_month_views: Math.max(viewsMetrics.current_month_views, 0),
        previous_month_views: Math.max(viewsMetrics.previous_month_views, 0),
      },
      growth: growth_metrics,
      store_revenue_chart_data,
      store_orders_chart_data,
      store_views_chart_data,
    };
  }),

  views: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        console.log("VIEW COUNT CALLED...");

        const business = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.slug, input.slug),
        });

        if (!business) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vendor not found",
          });
        }

        await ctx.db
          .update(businesses)
          .set({
            totalViewCount: sql`${businesses.totalViewCount} + 1`,
          })
          .where(eq(businesses.slug, input.slug));

        await ctx.db.insert(views).values({
          businessId: business.id,
          userId: ctx.session?.user.id,
        });

        return true;
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to increment view count",
        });
      }
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
      const result = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.slug, input.slug),
          not(eq(businesses.status, "setup-incomplete")),
        ),
        with: {
          owner: {
            columns: {
              role: true,
            },
          },
        },
      });

      return result;
    }),

  getReviews: publicProcedure
    .input(
      z.object({
        businessId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          content: reviews.review,
          user: {
            name: getTableColumns(users).name,
            image: getTableColumns(users).image,
          },
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.businessId, input.businessId));
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

  getVendorAroundLocation: publicProcedure.query(async ({ ctx }) => {
    try {
      let IP = "27.34.20.194";

      if (env.NODE_ENV === "production") {
        IP = ctx.headers.get("x-forwarded-for") ?? IP;
      }

      const { data: userLocation } = await axios.get<IpInfoResponse>(
        `https://ipinfo.io/${IP}/json?token=${env.IPINFO_API_KEY}`,
      );

      const [lat, lng] = userLocation.loc.split(",").map(Number);

      // Validate location for search
      if (!lat || !lng) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Location coordinates are required",
        });
      }

      const radius = 10; // kilometers
      const distanceCalculation = sql<number>`6371 * 2 * ASIN(
        SQRT(
          POWER(SIN((${lat} - (business.location->>'lat')::numeric) * PI()/180 / 2), 2) +
          COS(${lat} * PI()/180) * COS((business.location->>'lat')::numeric * PI()/180) *
          POWER(SIN((${lng} - (business.location->>'lng')::numeric) * PI()/180 / 2), 2)
        )
      )`;

      // Main query with distance filtering
      const vendorsQuery = await ctx.db
        .select({
          id: businesses.id,
          name: businesses.name,
          slug: businesses.slug,
          rating: businesses.rating,
          distance: distanceCalculation,
          location: businesses.location,
          availableVehiclesTypes: businesses.availableVehicleTypes,
          satisfiedCustomers: businesses.satisfiedCustomers,
          images: businesses.images,
        })
        .from(businesses)
        .where(
          and(
            eq(businesses.status, "active"),
            sql`${distanceCalculation} <= ${radius}`,
          ),
        )
        .orderBy(desc(businesses.totalViewCount), desc(businesses.rating))
        .limit(5);

      return {
        vendors: vendorsQuery,
        location: userLocation.city,
        total: vendorsQuery.length,
      };
    } catch (err) {
      console.log({ getVendorAroundLocationError: err });
      if (err instanceof TRPCError) {
        throw err;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to search vendors. ",
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { northEast, southWest } = input.bounds;
      try {
        const whereConditions: SQL<unknown>[] = [
          eq(businesses.status, "active"),
        ];

        if (input.query) {
          const sqlQuery = or(
            ilike(businesses.name, `%${input.query}%`),
            ilike(businesses.slug, `%${input.query}%`),
            ilike(businesses.instagramHandle, `%${input.query}%`),
            sql`EXISTS (
              SELECT 1 FROM ${vehicles}
              WHERE ${vehicles.businessId} = ${businesses.id}
              AND (
                ${ilike(vehicles.name, `%${input.query}%`)} OR
                ${ilike(vehicles.slug, `%${input.query}%`)} OR
                ${ilike(vehicles.category, `%${input.query}%`)}
              )
            )`,
          )!;
          whereConditions.push(sqlQuery);
        }

        if (input.vehicleType) {
          whereConditions.push(
            sql`${input.vehicleType} = ANY(${businesses.availableVehicleTypes})`,
          );
        }

        whereConditions.push(
          sql`(${businesses.location}->>'lat')::numeric BETWEEN ${southWest.lat} AND ${northEast.lat}`,
          sql`(${businesses.location}->>'lng')::numeric BETWEEN ${southWest.lng} AND ${northEast.lng}`,
        );

        const shops = await ctx.db
          .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            logo: businesses.logo,
            rating: businesses.rating,
            location: businesses.location,
            availableVehiclesTypes: businesses.availableVehicleTypes,
            satisfiedCustomers: businesses.satisfiedCustomers,
            images: businesses.images,
          })
          .from(businesses)
          .where(and(...whereConditions))
          .limit(5)
          .orderBy(desc(businesses.rating));

        return shops;
      } catch (err) {
        console.log({ searchError: err });
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search vendors. ",
        });
      }
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
        images: z.array(
          z.object({
            url: z.string().url(),
            order: z.number(),
            id: z.string(),
          }),
        ),
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
        images: z.array(
          z.object({
            url: z.string().url(),
            order: z.number(),
            id: z.string(),
          }),
        ),
        instagramHandle: z.string().optional(),
        merchantCode: z.string().optional(),
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
        console.log({ error });
        if (error instanceof z.ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid input data",
            cause: error.issues,
          });
        }

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

  addReview: protectedProcedure
    .input(
      z.object({
        businessId: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const business = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.id, input.businessId),
      });

      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vendor not found",
        });
      }

      const existingReviews = await ctx.db
        .select({
          id: reviews.id,
        })
        .from(reviews)
        .where(
          and(
            eq(reviews.businessId, input.businessId),
            eq(reviews.userId, ctx.session.user.id),
          ),
        );

      const hasUserBooked = await ctx.db
        .select({
          id: rentals.id,
        })
        .from(rentals)
        .where(
          and(
            eq(rentals.businessId, input.businessId),
            eq(rentals.userId, ctx.session.user.id),
          ),
        );

      if (existingReviews.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this vendor",
        });
      }

      if (hasUserBooked.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must book with this vendor to review",
        });
      }

      const review = await ctx.db.insert(reviews).values({
        businessId: input.businessId,
        userId: ctx.session.user.id,
        rating: input.rating,
        review: input.review,
        rentalId: hasUserBooked[0]!.id,
      });

      const totalRating =
        (business.rating * (business.ratingCount ?? 0) + input.rating) /
        ((business.ratingCount ?? 0) + 1);

      await ctx.db
        .update(businesses)
        .set({
          rating: totalRating,
          ratingCount: sql`COALESCE(${businesses.ratingCount}, 0) + 1`,
        })
        .where(eq(businesses.id, input.businessId));

      return review;
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
export type GetDashboardInfo =
  inferRouterOutputs<BusinessRouter>["getDashboardInfo"];
export type GetVendorAroundLocation =
  inferRouterOutputs<BusinessRouter>["getVendorAroundLocation"];
