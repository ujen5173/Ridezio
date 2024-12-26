import { type Metadata } from "next";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { api } from "~/trpc/server";
import AccessoriesTable from "./components/AccessoriesTable";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Accessories | Velocit`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/accessories`,
  });
}

const Accessories = async () => {
  const business = await api.business.current();

  return (
    <section className="w-full px-4 py-4 md:px-6">
      {business?.vehiclesCount === 0 ? (
        <div className="mb-4 rounded-md border border-orange-600 bg-orange-50 p-4 text-orange-600">
          <p className="text-base font-semibold">
            Looks Like You Don&apos;t Have Any Vehicles in your Inventory
          </p>
          <p className="text-sm">
            Before activating your profile, Add Vehicles in you Inventory.
          </p>
        </div>
      ) : null}

      <AccessoriesTable />
    </section>
  );
};

export default Accessories;
