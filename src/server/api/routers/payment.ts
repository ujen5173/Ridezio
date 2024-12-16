import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import { payments } from "~/server/db/schema";
import { generateEsewaSignature } from "~/server/utils/generate-payment-token";
import { type PaymentMethod } from "~/types/payment";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const ESEWA_VERIFICATION_URL =
  env.ESEWA_VERIFICATION_URL ?? "https://uat.esewa.com.np/epay/transrec";

export const paymentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        businessId: z.string(),
        amount: z.number(),
        productName: z.string(),
        transactionId: z.string(),
        transactionUuid: z.string(),
        method: z.union([z.literal("esewa"), z.literal("khalti")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const path = ctx.headers.get("referer")?.split("?")[0] ?? "/";

      try {
        const {
          amount,
          productName,
          transactionId,
          transactionUuid,
          method,
          businessId,
        } = input;

        switch (method as PaymentMethod) {
          case "esewa": {
            const esewaConfig = {
              amount: amount,
              tax_amount: "0",
              total_amount: amount,
              transaction_uuid: transactionUuid,
              product_code: env.ESEWA_MERCHANT_CODE,
              product_service_charge: "0",
              product_delivery_charge: "0",
              success_url: path,
              failure_url: path,
              signed_field_names: "total_amount,transaction_uuid,product_code",
            };

            const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
            const signature = generateEsewaSignature(
              env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
              signatureString,
            );

            return {
              amount: amount,
              esewaConfig: {
                ...esewaConfig,
                signature,
                product_service_charge: Number(
                  esewaConfig.product_service_charge,
                ),
                product_delivery_charge: Number(
                  esewaConfig.product_delivery_charge,
                ),
                tax_amount: Number(esewaConfig.tax_amount),
                total_amount: Number(esewaConfig.total_amount),
              },
            };
          }

          // case "khalti": {
          //   console.log("Initiating Khalti payment");
          //   const khaltiConfig = {
          //     return_url: path,
          //     website_url: env.NEXT_PUBLIC_APP_URL,
          //     amount: Math.round(parseFloat(`${amount}`) * 100),
          //     purchase_order_id: transactionUuid,
          //     purchase_order_name: productName,
          //     customer_info: {
          //       name: ctx.session.user.name,
          //       email: ctx.session.user.email,
          //       phone: ctx.session.user.phoneNumber,
          //     },
          //   };

          //   const response = await fetch(
          //     "https://a.khalti.com/api/v2/epayment/initiate/",
          //     {
          //       method: "POST",
          //       headers: {
          //         Authorization: `Key ${env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
          //         "Content-Type": "application/json",
          //       },
          //       body: JSON.stringify(khaltiConfig),
          //     },
          //   );

          //   if (!response.ok) {
          //     const errorData = await response.json();
          //     console.error("Khalti API Error:", errorData);
          //     throw new TRPCError({
          //       message: `Khalti payment initiation failed: ${JSON.stringify(errorData)}`,
          //       code: "INTERNAL_SERVER_ERROR",
          //     });
          //   }

          //   const khaltiResponse = await response.json();
          //   console.log("Khalti payment initiated:", khaltiResponse);
          //   return NextResponse.json({
          //     khaltiPaymentUrl: khaltiResponse.payment_url,
          //   });
          // }

          default:
            console.error("Invalid payment method:", method);
            throw new TRPCError({
              message: "Invalid Payment Method",
              code: "BAD_REQUEST",
            });
        }
      } catch (err) {
        console.error("Payment API Error:", err);
        throw new TRPCError({
          message: "Error creating payment session",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  verify: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        pid: z.string(),
        refId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify transaction with eSewa
      const verificationURL = `${ESEWA_VERIFICATION_URL}?amt=${input.amount}&scd=${env.ESEWA_MERCHANT_CODE}&pid=${input.pid}&rid=${input.refId}`;
      const verificationResponse = await fetch(verificationURL);
      const responseText = await verificationResponse.text();

      if (responseText.includes("SUCCESS")) {
        // Update payment status to SUCCESS
        await ctx.db
          .update(payments)
          .set({ status: "complete" })
          .where(eq(payments.id, input.pid));
        return { success: true };
      } else {
        // Update payment status to FAILED
        await ctx.db
          .update(payments)
          .set({ status: "canceled" })
          .where(eq(payments.id, input.pid));
        return { success: false };
      }
    }),
});
