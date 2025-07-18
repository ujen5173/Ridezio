import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import AccessoriesOrdersTable from "./AccessoriesOrdersTable";
import Stats from "./Stats";
import VehicleBookingsTable from "./VehicleBookingsTable";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Dashboard`,
    url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
}

const Dashboard = async () => {
  try {
    const data = await api.business.getDashboardInfo();

    return (
      <main className={cn("w-full bg-white")}>
        <div className="px-4 py-6">
          <Stats data={data} />
          <VehicleBookingsTable />
          <AccessoriesOrdersTable />
        </div>
      </main>
    );
  } catch (err) {
    redirect("/vendor/settings");
  }
};

export default Dashboard;
