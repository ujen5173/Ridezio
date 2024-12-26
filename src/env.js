import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),

    USER: z.string().min(1),
    PASS: z.string().min(1),

    IPINFO_API_KEY: z.string(),

    ESEWA_URL: z.string().default("https://uat.esewa.com.np/epay/main"),
    ESEWA_VERIFICATION_URL: z
      .string()
      .default("https://uat.esewa.com.np/epay/transrec"),
    ESEWA_MERCHANT_CODE: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_LOCATIONIQ_API_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
    NEXT_PUBLIC_ESEWA_SECRET_KEY: z.string(),
    NEXT_PUBLIC_SUCCESS_URL: z
      .string()
      .default("http://localhost:3000/success"),
    NEXT_PUBLIC_FAILURE_URL: z
      .string()
      .default("http://localhost:3000/failure"),
    NEXT_PUBLIC_ENROLL_EVENTS: z.enum(["true", "false"]).default("false"),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ESEWA_SECRET_KEY: process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_LOCATIONIQ_API_KEY: process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    USER: process.env.USER,
    PASS: process.env.PASS,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    IPINFO_API_KEY: process.env.IPINFO_API_KEY,

    ESEWA_URL: process.env.ESEWA_URL,
    ESEWA_VERIFICATION_URL: process.env.ESEWA_VERIFICATION_URL,
    ESEWA_MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE,
    NEXT_PUBLIC_SUCCESS_URL: process.env.NEXT_PUBLIC_SUCCESS_URL,
    NEXT_PUBLIC_FAILURE_URL: process.env.NEXT_PUBLIC_FAILURE_URL,

    NEXT_PUBLIC_ENROLL_EVENTS: process.env.NEXT_PUBLIC_ENROLL_EVENTS,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
