import { redirect } from "next/navigation";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import AccessoriesOrdersTable from "./AccessoriesOrdersTable";
import Stats from "./Stats";
import VehicleBookingsTable from "./VehicleBookingsTable";

const Dashboard = async () => {
  try {
    const data = await api.business.getDashboardInfo();

    return (
      <main className={cn("w-full bg-white")}>
        <div className="px-4 py-6">
          <Stats data={data} />
          <VehicleBookingsTable />
          <AccessoriesOrdersTable data={data} />
        </div>
      </main>
    );
  } catch (err) {
    console.log({ err });
    redirect("/vendor/profile");
  }
};

export default Dashboard;
