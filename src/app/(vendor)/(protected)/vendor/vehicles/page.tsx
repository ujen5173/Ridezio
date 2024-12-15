import { api } from "~/trpc/server";
import VehiclesTable from "./_components/VehiclesTable";

const Vehicles = async () => {
  const business = await api.business.current();

  return (
    <section className="w-full px-6 py-4">
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
      <VehiclesTable />
    </section>
  );
};

export default Vehicles;
