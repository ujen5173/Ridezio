import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { env } from "~/env";
import { generateEsewaSignature } from "~/server/utils/generate-payment-token";
import { type PaymentMethod } from "~/types/payment";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        productName: z.string(),
        transactionUuid: z.string(),
        method: z.union([z.literal("esewa"), z.literal("khalti")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const path = ctx.headers.get("referer")?.split("?")[0] ?? "/";

      try {
        const { amount, productName, transactionUuid, method } = input;

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

          case "khalti": {
            const khaltiConfig = {
              return_url: path,
              website_url: env.NEXT_PUBLIC_APP_URL,
              amount: Math.round(parseFloat(`${amount}`) * 100),
              purchase_order_id: transactionUuid,
              purchase_order_name: productName,
              customer_info: {
                name: ctx.session.user.name,
                email: ctx.session.user.email,
                phone: ctx.session.user.phoneNumber,
              },
            };

            const { data, status } = await axios.post<{
              pidx: string;
              payment_url: string;
              expires_at: string;
              expires_in: number;
            }>(
              "https://dev.khalti.com/api/v2/epayment/initiate/",
              khaltiConfig,
              {
                headers: {
                  Authorization: `Key live_secret_key_68791341fdd94846a146f0457ff7b455`,
                  "Content-Type": "application/json",
                },
              },
            );

            if (status !== 200) {
              throw new TRPCError({
                message: `Khalti payment initiation failed`,
                code: "INTERNAL_SERVER_ERROR",
              });
            }

            return {
              khaltiPaymentUrl: data.payment_url,
            };
          }

          default:
            throw new TRPCError({
              message: "Invalid Payment Method",
              code: "BAD_REQUEST",
            });
        }
      } catch (err) {
        throw new TRPCError({
          message: "Error creating payment session",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
