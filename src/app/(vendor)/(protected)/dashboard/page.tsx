import { redirect } from "next/navigation";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import OrdersTable from "./OrdersTable";
import Stats from "./Stats";

const Dashboard = async () => {
  try {
    const data = await api.business.getDashboardInfo();

    return (
      <main className={cn("w-full bg-white")}>
        <div className="px-4 py-6">
          <Stats data={data} />
          <OrdersTable />
        </div>
      </main>
    );
  } catch (err) {
    console.log({ err });
    redirect("/vendor/profile");
  }
};

export default Dashboard;
