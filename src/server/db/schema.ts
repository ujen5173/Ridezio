import { relations, sql, type InferInsertModel } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
export const createTable = pgTableCreator((name) => `${name}`);

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
  "parial_refund",
  "ambiguous",
  "not_found",
  "canceled",
]);

export const users = createTable(
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
    vendor_setup_complete: boolean("vendor_setup_complete"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_idx").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
  }),
);

export const businesses = createTable(
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
        city?: string | undefined;
        address?: string | undefined;
        lat?: number | undefined;
        lng?: number | undefined;
        map?: string | undefined;
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
      .notNull()
      .default(sql`'{}'::json`),
    vehiclesCount: integer("vehicles_count").default(0),
    rating: decimal("rating", { precision: 3, scale: 1 })
      .$type<number>()
      .notNull()
      .default(0.0),
    ratingCount: integer("rating_count").default(0),
    satisfiedCustomers: integer("satisfied_customers").default(0),
    availableVehicleTypes: vehicleTypeEnum("available_vehicle_types")
      .array()
      .notNull()
      .default([]),
    logo: text("logo"),
    images: json("images")
      .array()
      .$type<
        {
          id: string;
          url: string;
          order: number;
        }[]
      >()
      .notNull()
      .default(sql`'{}'::json[]`),
    faqs: json("faqs")
      .array()
      .$type<
        { question: string; answer: string; id: string; order: number }[]
      >()
      .notNull()
      .default(sql`'{}'::json[]`),
    status: businessStatusEnum("status").notNull().default("setup-incomplete"),
    merchantCode: varchar("merchant_code", { length: 20 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("business_name_idx").on(table.name),
    ownerIdx: index("business_owner_idx").on(table.ownerId),
    ratingIdx: index("business_rating_idx").on(table.rating, table.ratingCount),
  }),
);

export const favourite = createTable(
  "bookmark",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
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

export const vehicles = createTable(
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
      .$type<
        {
          id: string;
          url: string;
          order: number;
        }[]
      >()
      .notNull()
      .default(sql`'{}'::json[]`),
    basePrice: integer("base_price").notNull(),
    inventory: integer("inventory").notNull().default(1),
    features: json("features")
      .array()
      .$type<
        {
          key: string;
          value: string;
        }[]
      >()
      .notNull()
      .default(sql`'{}'::json[]`),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdx: index("vehicle_business_idx").on(table.businessId),
    typeIdx: index("vehicle_type_idx").on(table.type),
  }),
);

export const rentals = createTable(
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
    businessId: varchar("business_id", { length: 36 }) // Add this field
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
      enum: ["online", "onsite"],
    }),
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

export const reviews = createTable(
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
    rating: integer("rating").notNull(),
    review: text("review").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("review_user_idx").on(table.userId),
    businessIdx: index("review_business_idx").on(table.businessId),
    ratingIdx: index("review_rating_idx").on(table.rating),
  }),
);

export const payments = createTable(
  "payment",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessesId: varchar("businesses_id", { length: 255 })
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: paymentStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    rentalIdx: index("payment_businesses_idx").on(table.businessesId),
    userIdx: index("payment_user_idx").on(table.userId),
    statusIdx: index("payment_status_idx").on(table.status),
  }),
);

export const faq = createTable(
  "faq",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: varchar("business_id", { length: 36 }) // Changed length to match businesses table
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    businessIdx: index("faq_business_idx").on(table.businessId),
    orderIdx: index("faq_order_idx").on(table.order),
  }),
);

// NextAuth tables
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
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

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
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
}));

export const favouriteRelations = relations(favourite, ({ one }) => ({
  business: one(users, {
    fields: [favourite.businessId],
    references: [users.id],
  }),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  faqs: many(faq),
  vehicles: many(vehicles),
  rentals: many(rentals),
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
  }), // add this
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  rental: one(rentals, {
    fields: [payments.businessesId],
    references: [rentals.id],
  }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const faqRelations = relations(faq, ({ one }) => ({
  business: one(businesses, {
    fields: [faq.businessId],
    references: [businesses.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// zod types:
export type businessesType = InferInsertModel<typeof businesses>["faqs"];
export type usersType = InferInsertModel<typeof users>;
export type vehiclesType = InferInsertModel<typeof vehicles>;
export type favouriteType = InferInsertModel<typeof favourite>;
export type rentalsType = InferInsertModel<typeof rentals>;
