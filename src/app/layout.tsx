import "~/styles/globals.css";

// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
// import { extractRouterConfig } from "uploadthing/server";
// import { ourFileRouter } from "~/app/api/uploadthing/core";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import TailwindIndicator from "./_components/_/TailwindIndicator";
import RootContext from "./_components/contexts/root";
import { bricolage } from "./utils/font";
import { constructMetadata } from "./utils/site";

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={bricolage.className}>
        {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
        <TRPCReactProvider>
          <HydrateClient>
            <RootContext session={session}>{children}</RootContext>
            <Toaster />
          </HydrateClient>
        </TRPCReactProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
