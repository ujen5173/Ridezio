import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// Enums
export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "bicycle",
  "e-bicycle",
  "bike",
  "scooter",
  "e-scooter",
  "car",
  "e-car",
]);

export const businessStatusEnum = pgEnum("business_status", [
  "suspended",
  "active",
  "inactive",
  "setup-incomplete",
  "closed",
  "de-active",
]);

export const rentalStatusEnum = pgEnum("rental_status", [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed",
]);

export const userRoleEnum = pgEnum("user_role", ["USER", "VENDOR"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "complete",
  "full_refund",
  "partial_refund",
  "ambiguous",
  "not_found",
  "canceled",
]);

export const users = pgTable(
  "user",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 100 }),
    email: varchar("email", { length: 100 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: varchar("image", { length: 255 }),
    role: userRoleEnum("role").default("USER"),
    deleted: boolean("deleted").default(false),
    phoneNumber: varchar("phone_number", { length: 20 }),
    vendor_setup_complete: boolean("vendor_setup_complete").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_idx").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
  }),
);

export const businesses = pgTable(
  "business",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    ownerId: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 130 }),
    slug: varchar("slug", { length: 130 }),
    location: json("location")
      .$type<{
        city?: string;
        address?: string;
        lat?: number;
        lng?: number;
        map?: string;
      }>()
      .notNull()
      .default(sql`'{}'::json`),
    phoneNumbers: varchar("phone_numbers", { length: 20 })
      .array()
      .notNull()
      .default([]),
    instagramHandle: varchar("instagram_handle", { length: 40 }),
    sellGears: boolean("sell_gears").notNull().default(false),
    businessHours: json("business_hours")
      .$type<Record<string, { open: string; close: string } | null>>()
      .default(sql`'{}'::json`),
    vehiclesCount: integer("vehicles_count").default(0),
    rating: decimal("rating", { precision: 3, scale: 1 })
      .$type<number>()
      .notNull()
      .default(0),
    ratingCount: integer("rating_count").default(0),
    satisfiedCustomers: integer("satisfied_customers").default(0),
    availableVehicleTypes: vehicleTypeEnum("available_vehicle_types")
      .array()
      .notNull()
      .default([]),
    logo: text("logo"),
    totalViewCount: integer("total_view_count").default(0),
    images: json("images")
      .array()
      .$type<Array<{ id: string; url: string; order: number }>>()
      .notNull()
      .default([]),
    faqs: json("faqs")
      .array()
      .$type<
        Array<{ question: string; answer: string; id: string; order: number }>
      >()
      .notNull()
      .default([]),
    status: businessStatusEnum("status").notNull().default("setup-incomplete"),
    merchantCode: varchar("merchant_code", { length: 20 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("business_name_idx").on(table.name),
    ownerIdx: index("business_owner_idx").on(table.ownerId),
    ratingIdx: index("business_rating_idx").on(table.rating, table.ratingCount),
    slugIdx: uniqueIndex("business_slug_idx").on(table.slug),
  }),
);

export const views = pgTable(
  "view",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 }).references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdx: index("view_business_idx").on(table.businessId),
  }),
);

export const favourite = pgTable(
  "bookmark",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.businessId, table.userId],
    }),
    userIdx: index("bookmark_user_idx").on(table.userId),
    businessIdx: index("bookmark_business_idx").on(table.businessId),
  }),
);

export const vehicles = pgTable(
  "vehicle",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    type: vehicleTypeEnum("type").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    images: json("images")
      .array()
      .$type<Array<{ id: string; url: string; order: number }>>()
      .notNull()
      .default([]),
    basePrice: integer("base_price").notNull(),
    inventory: integer("inventory").notNull().default(1),
    features: json("features")
      .array()
      .$type<Array<{ key: string; value: string }>>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdx: index("vehicle_business_idx").on(table.businessId),
    typeIdx: index("vehicle_type_idx").on(table.type),
    slugIdx: uniqueIndex("vehicle_slug_idx").on(table.slug),
  }),
);

export const rentals = pgTable(
  "rental",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vehicleId: varchar("vehicle_id", { length: 36 })
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    rentalStart: timestamp("rental_start").notNull(),
    rentalEnd: timestamp("rental_end").notNull(),
    quantity: integer("quantity").notNull().default(1),
    phone_number: varchar("phone_number", { length: 20 }),
    status: rentalStatusEnum("status").notNull().default("pending"),
    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),
    paymentMethod: varchar("payment_method", {
      length: 20,
      enum: ["online", "cash"],
    }).notNull(),
    totalPrice: integer("total_price").notNull(),
    num_of_days: integer("num_of_days").notNull().default(1),
    notes: text("notes"),
    paymentId: text("payment_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("rental_user_idx").on(table.userId),
    vehicleIdx: index("rental_vehicle_idx").on(table.vehicleId),
    businessIdx: index("rental_business_idx").on(table.businessId),
    statusIdx: index("rental_status_idx").on(table.status),
    dateRangeIdx: index("rental_date_range_idx").on(
      table.rentalStart,
      table.rentalEnd,
    ),
  }),
);

export const reviews = pgTable(
  "review",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    rentalId: varchar("rental_id", { length: 36 })
      .notNull()
      .references(() => rentals.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    review: text("review").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("review_user_idx").on(table.userId),
    businessIdx: index("review_business_idx").on(table.businessId),
    ratingIdx: index("review_rating_idx").on(table.rating),
    rentalIdx: uniqueIndex("review_rental_idx").on(table.rentalId),
  }),
);

export const accessories = pgTable(
  "accessories",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    images: json("images")
      .array()
      .$type<Array<{ id: string; url: string; order: number }>>()
      .notNull()
      .default([]),
    basePrice: integer("base_price").notNull(),
    inventory: integer("inventory").notNull().default(1),
    brand: varchar("brand", { length: 100 }),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    rating: decimal("rating", { precision: 3, scale: 1 })
      .$type<number>()
      .notNull()
      .default(0),
    ratingCount: integer("rating_count").default(0),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    sizes: varchar("sizes", { length: 100 }).array().notNull().default([]),
    colors: varchar("colors", { length: 100 }).array().notNull().default([]),
    discount: integer("discount"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("accessory_name_idx").on(table.name),
    slugIdx: uniqueIndex("accessory_slug_idx").on(table.slug),
    businessIdx: index("accessory_business_idx").on(table.businessId),
  }),
);

export const accessoriesReviews = pgTable(
  "accessories_review",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessoryId: varchar("accessory_id", { length: 36 })
      .notNull()
      .references(() => accessories.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    review: text("review").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("accessory_review_user_idx").on(table.userId),
    accessoryIdx: index("accessory_review_accessory_idx").on(table.accessoryId),
    ratingIdx: index("accessory_review_rating_idx").on(table.rating),
  }),
);

export const payments = pgTable(
  "payment",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    rentalId: varchar("rental_id", { length: 36 })
      .notNull()
      .references(() => rentals.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: paymentStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    rentalIdx: index("payment_rental_idx").on(table.rentalId),
    userIdx: index("payment_user_idx").on(table.userId),
    statusIdx: index("payment_status_idx").on(table.status),
  }),
);

export const accessoriesOrder = pgTable(
  "accessories_order",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    accessoryId: varchar("accessory_id", { length: 36 })
      .notNull()
      .references(() => accessories.id, { onDelete: "cascade" }),
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    total: integer("total").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index("accessory_order_business_idx").on(table.businessId),
    accessoryIdIdx: index("accessory_order_accessory_idx").on(
      table.accessoryId,
    ),
  }),
);

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  rentals: many(rentals),
  favourite: many(favourite),
  business: one(businesses, {
    fields: [users.id],
    references: [businesses.ownerId],
  }),
  reviews: many(reviews),
  accessoriesReviews: many(accessoriesReviews),
  payments: many(payments),
  views: many(views),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  vehicles: many(vehicles),
  rentals: many(rentals),
  reviews: many(reviews),
  favourites: many(favourite),
  accessories: many(accessories),
  accessoriesOrders: many(accessoriesOrder),
  views: many(views),
}));

export const viewsRelations = relations(views, ({ one }) => ({
  user: one(users, {
    fields: [views.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [views.businessId],
    references: [businesses.id],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  business: one(businesses, {
    fields: [vehicles.businessId],
    references: [businesses.id],
  }),
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one, many }) => ({
  user: one(users, { fields: [rentals.userId], references: [users.id] }),
  vehicle: one(vehicles, {
    fields: [rentals.vehicleId],
    references: [vehicles.id],
  }),
  business: one(businesses, {
    fields: [rentals.businessId],
    references: [businesses.id],
  }),
  payments: many(payments),
  review: one(reviews, {
    fields: [rentals.id],
    references: [reviews.rentalId],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  business: one(businesses, {
    fields: [reviews.businessId],
    references: [businesses.id],
  }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  rental: one(rentals, {
    fields: [reviews.rentalId],
    references: [rentals.id],
  }),
}));

export const accessoriesRelations = relations(accessories, ({ one, many }) => ({
  business: one(businesses, {
    fields: [accessories.businessId],
    references: [businesses.id],
  }),
  reviews: many(accessoriesReviews),
  orders: many(accessoriesOrder),
}));

export const accessoriesReviewsRelations = relations(
  accessoriesReviews,
  ({ one }) => ({
    user: one(users, {
      fields: [accessoriesReviews.userId],
      references: [users.id],
    }),
    accessory: one(accessories, {
      fields: [accessoriesReviews.accessoryId],
      references: [accessories.id],
    }),
  }),
);

export const accessoriesOrderRelations = relations(
  accessoriesOrder,
  ({ one }) => ({
    accessory: one(accessories, {
      fields: [accessoriesOrder.accessoryId],
      references: [accessories.id],
    }),
    business: one(businesses, {
      fields: [accessoriesOrder.businessId],
      references: [businesses.id],
    }),
  }),
);

export const favouriteRelations = relations(favourite, ({ one }) => ({
  business: one(businesses, {
    fields: [favourite.businessId],
    references: [businesses.id],
  }),
  user: one(users, { fields: [favourite.userId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  rental: one(rentals, {
    fields: [payments.rentalId],
    references: [rentals.id],
  }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Rental = typeof rentals.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Accessory = typeof accessories.$inferSelect;
export type AccessoryReview = typeof accessoriesReviews.$inferSelect;
export type AccessoryOrder = typeof accessoriesOrder.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Favourite = typeof favourite.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewBusiness = typeof businesses.$inferInsert;
export type NewVehicle = typeof vehicles.$inferInsert;
export type NewRental = typeof rentals.$inferInsert;
export type NewReview = typeof reviews.$inferInsert;
export type NewAccessory = typeof accessories.$inferInsert;
export type NewAccessoryReview = typeof accessoriesReviews.$inferInsert;
export type NewAccessoryOrder = typeof accessoriesOrder.$inferInsert;
export type NewPayment = typeof payments.$inferInsert;
export type NewAccount = typeof accounts.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
export type NewFavourite = typeof favourite.$inferInsert;
