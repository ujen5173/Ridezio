"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "~/env";

if (typeof window !== "undefined" && env.NEXT_PUBLIC_STATE !== "development") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
