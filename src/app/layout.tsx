import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import axios from "axios";
import { type Metadata } from "next";
import { headers } from "next/headers";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { Toaster } from "~/components/ui/toaster";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import TailwindIndicator from "./_components/_/TailwindIndicator";
import { AvailablyOnlyForNepal } from "./_components/AvailablyOnlyForNepal";
import RootContext from "./_components/contexts/root";
import { CSPostHogProvider } from "./providers";
import { bricolage } from "./utils/font";
import { constructMetadata, getBaseUrl } from "./utils/site";
export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const canonicalUrl = `${getBaseUrl()}${pathname}`;

  // Get client IP from request headers
  const forwarded = headersList.get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip");

  if (ip === "::1") {
    ip = "27.34.20.194"; // Default IP for localhost to Kathmandu, Nepal
  }

  // Use a geolocation service that accepts IP address
  const { data: location } = await axios.get<{
    country_name: string;
    city: string;
    latitude: number;
    longitude: number;
    country_code: string;
  }>(`https://api.ipapi.com/api/${ip}?access_key=${env.NEXT_PUBLIC_IPAPI_KEY}`);

  const country = location.country_name;
  const city = location.city;
  const geo = {
    lat: location.latitude,
    lng: location.longitude,
  };

  const country_code = location.country_code.toLowerCase();

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body className={bricolage.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <TRPCReactProvider>
          <HydrateClient>
            <CSPostHogProvider>
              {country !== "Nepal" && (
                <AvailablyOnlyForNepal country={country} />
              )}
              <RootContext
                country_code={country_code}
                city={city}
                geo={geo}
                country={country}
                session={session}
              >
                {children}
              </RootContext>
              <Toaster />
            </CSPostHogProvider>
          </HydrateClient>
        </TRPCReactProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
