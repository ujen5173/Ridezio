ALTER TABLE "view" DROP CONSTRAINT "view_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "view" ADD CONSTRAINT "view_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;