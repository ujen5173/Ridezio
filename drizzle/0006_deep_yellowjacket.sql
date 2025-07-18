CREATE TABLE "affiliate_stats" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"total_referrals" integer DEFAULT 0 NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"total_free_rentals" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"referrer_user_id" varchar(36) NOT NULL,
	"referred_user_id" varchar(36) NOT NULL,
	"reward_type" varchar(20) NOT NULL,
	"reward_value" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "business_hours" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "merchant_code" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "affiliate_stats" ADD CONSTRAINT "affiliate_stats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral" ADD CONSTRAINT "referral_referrer_user_id_user_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral" ADD CONSTRAINT "referral_referred_user_id_user_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "referral_referrer_idx" ON "referral" USING btree ("referrer_user_id");--> statement-breakpoint
CREATE INDEX "referral_referred_idx" ON "referral" USING btree ("referred_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_referral_idx" ON "referral" USING btree ("referrer_user_id","referred_user_id");