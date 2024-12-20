import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return constructMetadata({
    title: `Velocit | ${params.slug && `${params.slug} - `} Rent Bicycles, Scooters, and More`,
    description: `Get Velocit for every kind of rentals → any type of vehicle rentals. Get the best prices, instant booking, and flexible rental options. Find your perfect ride on Velocit.`,
    url: `${env.NEXT_PUBLIC_APP_URL}/search`,
  });
}

const SearchLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SearchLayout;
