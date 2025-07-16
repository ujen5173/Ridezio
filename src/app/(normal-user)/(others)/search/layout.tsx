import { type Metadata } from "next";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { constructMetadata } from "~/app/utils/site";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-url");
  const location =
    new URL(pathname ?? "").searchParams.get("location") ?? "from anywhere";
  const vehicleType =
    new URL(pathname ?? "").searchParams.get("vehicleType") ?? "vehicles";

  return constructMetadata({
    title: `Rent ${vehicleType} in ${location} | Ridezio Vehicle Rentals`,
    description: `Find and rent ${vehicleType} in ${location}. Best prices, instant booking, and flexible rental options. Local vehicle rentals near you.`,
  });
}

const SearchLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SearchLayout;
