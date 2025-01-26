import { TriangleAlert } from "lucide-react";
import { type Metadata } from "next";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { api } from "~/trpc/server";
import VehiclesTable from "./_components/VehiclesTable";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `All Vehicles`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/vehicles`,
  });
}

const Vehicles = async () => {
  const business = await api.business.current();

  return (
    <section className="w-full px-6 py-4">
      {business?.vehiclesCount === 0 ? (
        <div className="mb-4 flex items-center gap-4 rounded-md border border-orange-600 bg-orange-50 p-4 text-orange-600">
          <div>
            <TriangleAlert size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="text-base font-semibold">
              Looks Like You Don&apos;t Have Any Vehicles in your Inventory
            </p>
            <p className="text-sm">
              Before activating your profile, Add Vehicles in you Inventory.
            </p>
          </div>
        </div>
      ) : null}

      <VehiclesTable />
    </section>
  );
};

export default Vehicles;
