CREATE TABLE "view" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"business_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "total_view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "view" ADD CONSTRAINT "view_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "view" ADD CONSTRAINT "view_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "view_user_idx" ON "view" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "view_business_idx" ON "view" USING btree ("business_id");--> statement-breakpoint
ALTER TABLE "business" DROP COLUMN "views";