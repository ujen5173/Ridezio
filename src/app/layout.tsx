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

  const { data: res } = await axios.get<{ lat: number; lng: number }>(
    env.NEXT_PUBLIC_APP_URL + "/api/ip",
  );

  const getCountry = async () => {
    const { lat, lng } = res;
    const { data } = await axios.get<{
      address: { city: string; country: string; country_code: string };
    }>(
      `https://us1.locationiq.com/v1/reverse.php?key=${env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`,
    );

    return {
      country: data.address.country,
      city: data.address.city,
      geo: {
        lat,
        lng,
      },
      country_code: data.address.country_code,
    };
  };

  const { country, city, geo, country_code } = await getCountry();

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
