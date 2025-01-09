import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata } from "~/app/utils/site";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  const location = searchParams.location ?? "Nepal";
  const vehicleType = searchParams.vehicleType ?? "vehicles";

  return constructMetadata({
    title: `Rent ${vehicleType} in ${location} | Velocit Vehicle Rentals`,
    description: `Find and rent ${vehicleType} in ${location}. Best prices, instant booking, and flexible rental options. Local vehicle rentals near you.`,
  });
}

const SearchLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SearchLayout;
