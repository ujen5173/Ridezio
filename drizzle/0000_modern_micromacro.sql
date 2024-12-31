CREATE TYPE "public"."business_status" AS ENUM('suspended', 'active', 'inactive', 'setup-incomplete', 'closed', 'de-active');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'complete', 'full_refund', 'partial_refund', 'ambiguous', 'not_found', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."rental_status" AS ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'VENDOR');--> statement-breakpoint
CREATE TYPE "public"."vehicle_type" AS ENUM('bicycle', 'e-bicycle', 'bike', 'scooter', 'e-scooter', 'car', 'e-car');--> statement-breakpoint
CREATE TABLE "accessories" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"images" json[] DEFAULT '{}' NOT NULL,
	"base_price" integer NOT NULL,
	"inventory" integer DEFAULT 1 NOT NULL,
	"brand" varchar(100),
	"business_id" varchar(36) NOT NULL,
	"rating" numeric(3, 1) DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0,
	"category" varchar(100) NOT NULL,
	"description" text,
	"sizes" varchar(100)[] DEFAULT '{}' NOT NULL,
	"colors" varchar(100)[] DEFAULT '{}' NOT NULL,
	"discount" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accessories_order" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"accessory_id" varchar(36) NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"total" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accessories_review" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"accessory_id" varchar(36) NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" varchar(36) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar(36) NOT NULL,
	"name" varchar(130),
	"slug" varchar(130),
	"location" json NOT NULL,
	"phone_numbers" varchar(20)[] DEFAULT '{}' NOT NULL,
	"instagram_handle" varchar(40),
	"sell_gears" boolean DEFAULT false NOT NULL,
	"business_hours" json DEFAULT '{}'::json,
	"vehicles_count" integer DEFAULT 0,
	"rating" numeric(3, 1) DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0,
	"satisfied_customers" integer DEFAULT 0,
	"available_vehicle_types" "vehicle_type"[] DEFAULT '{}' NOT NULL,
	"logo" text,
	"views" integer DEFAULT 0,
	"images" json[] DEFAULT '{}' NOT NULL,
	"faqs" json[] DEFAULT '{}' NOT NULL,
	"status" "business_status" DEFAULT 'setup-incomplete' NOT NULL,
	"merchant_code" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmark" (
	"user_id" varchar(36) NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmark_business_id_user_id_pk" PRIMARY KEY("business_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"rental_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"amount" integer NOT NULL,
	"status" "payment_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"vehicle_id" varchar(36) NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"rental_start" timestamp NOT NULL,
	"rental_end" timestamp NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"phone_number" varchar(20),
	"status" "rental_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"total_price" integer NOT NULL,
	"num_of_days" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"rental_id" varchar(36) NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(100) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(255),
	"role" "user_role" DEFAULT 'USER',
	"deleted" boolean DEFAULT false,
	"phone_number" varchar(20),
	"vendor_setup_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" "vehicle_type" NOT NULL,
	"category" varchar(100) NOT NULL,
	"images" json[] DEFAULT '{}' NOT NULL,
	"base_price" integer NOT NULL,
	"inventory" integer DEFAULT 1 NOT NULL,
	"features" json[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accessories_order" ADD CONSTRAINT "accessories_order_accessory_id_accessories_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accessories_order" ADD CONSTRAINT "accessories_order_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accessories_review" ADD CONSTRAINT "accessories_review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accessories_review" ADD CONSTRAINT "accessories_review_accessory_id_accessories_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_rental_id_rental_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_rental_id_rental_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accessory_name_idx" ON "accessories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "accessory_slug_idx" ON "accessories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "accessory_business_idx" ON "accessories" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "accessory_order_business_idx" ON "accessories_order" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "accessory_order_accessory_idx" ON "accessories_order" USING btree ("accessory_id");--> statement-breakpoint
CREATE INDEX "accessory_review_user_idx" ON "accessories_review" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accessory_review_accessory_idx" ON "accessories_review" USING btree ("accessory_id");--> statement-breakpoint
CREATE INDEX "accessory_review_rating_idx" ON "accessories_review" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "business_name_idx" ON "business" USING btree ("name");--> statement-breakpoint
CREATE INDEX "business_owner_idx" ON "business" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "business_rating_idx" ON "business" USING btree ("rating","rating_count");--> statement-breakpoint
CREATE UNIQUE INDEX "business_slug_idx" ON "business" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "bookmark_user_idx" ON "bookmark" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookmark_business_idx" ON "bookmark" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "payment_rental_idx" ON "payment" USING btree ("rental_id");--> statement-breakpoint
CREATE INDEX "payment_user_idx" ON "payment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rental_user_idx" ON "rental" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rental_vehicle_idx" ON "rental" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "rental_business_idx" ON "rental" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "rental_status_idx" ON "rental" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rental_date_range_idx" ON "rental" USING btree ("rental_start","rental_end");--> statement-breakpoint
CREATE INDEX "review_user_idx" ON "review" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "review_business_idx" ON "review" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "review_rating_idx" ON "review" USING btree ("rating");--> statement-breakpoint
CREATE UNIQUE INDEX "review_rental_idx" ON "review" USING btree ("rental_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "vehicle_business_idx" ON "vehicle" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "vehicle_type_idx" ON "vehicle" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_slug_idx" ON "vehicle" USING btree ("slug");