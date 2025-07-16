import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { headers } from "next/headers";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { Toaster } from "~/components/ui/toaster";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import TailwindIndicator from "./_components/_/TailwindIndicator";
import { AvailablyOnlyForNepal } from "./_components/AvailablyOnlyForNepal";
import RootContext from "./_components/contexts/root";
import { CSPostHogProvider } from "./providers";
import { bricolage } from "./utils/font";
import { getUserGeoFromIP } from "./utils/ip";
import { constructMetadata, getBaseUrl } from "./utils/site";
export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const canonicalUrl = `${getBaseUrl()}${pathname}`;
  const { country_code, city, geo, country } = await getUserGeoFromIP();

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
              {country_code !== "NP" && <AvailablyOnlyForNepal />}
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
