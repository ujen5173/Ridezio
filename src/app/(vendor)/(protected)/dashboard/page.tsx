import { TrendingDown, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { lato } from "~/app/utils/font";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import { Chart } from "./Chart";
import OrdersTable from "./OrdersTable";

const Dashboard = async () => {
  try {
    const data = await api.business.getDashboardInfo();

    return (
      <main className={cn("w-full bg-white")}>
        <div className="px-4 py-6">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-end">
              <div className="flex-1">
                <h1 className={cn("text-2xl font-semibold md:text-3xl")}>
                  {data.store.name}
                </h1>
              </div>
            </div>
            <div
              className={cn("grid gap-4")}
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(225px,1fr))",
              }}
            >
              <div className="relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
                <div>
                  <p className="mb-2 text-base font-medium text-slate-500">
                    Orders Today
                  </p>
                  <h1
                    className={cn(
                      "mb-2 text-3xl font-semibold text-slate-800",
                      lato.className,
                    )}
                  >
                    {data.metrics.orders_today} -
                  </h1>
                </div>
              </div>
              <div className="hover: relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
                <p className="mb-2 text-base font-medium text-slate-500">
                  Store Views
                </p>
                <h1
                  className={cn(
                    "mb-2 text-3xl font-semibold text-slate-800",
                    lato.className,
                  )}
                >
                  50k -
                </h1>
                <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <TrendingDown size={16} className="text-red-600" />
                  <span>12% from last month</span>
                </div>
                <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
                  <div className="chart-blur-bottom absolute bottom-0 z-20 h-6 w-full"></div>
                  <div className="chart-blur-right absolute right-2 z-20 h-12 w-6"></div>
                  <Chart
                    chartColor="hsl(var(--color-2))"
                    chartData={[
                      { date: "2024-01-01", value: 100 },
                      { date: "2024-01-14", value: 220 },
                      { date: "2024-01-28", value: 210 },
                      { date: "2024-02-10", value: 190 },
                      { date: "2024-02-24", value: 230 },
                      { date: "2024-03-09", value: 240 },
                      { date: "2024-03-23", value: 250 },
                      { date: "2024-04-06", value: 215 },
                      { date: "2024-04-20", value: 205 },
                      { date: "2024-05-04", value: 180 },
                      { date: "2024-05-18", value: 220 },
                      { date: "2024-06-01", value: 210 },
                      { date: "2024-06-15", value: 225 },
                      { date: "2024-06-29", value: 240 },
                    ]}
                  />
                </div>
              </div>
              <div className="chart-wrapper relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
                <p className="mb-2 text-base font-medium text-slate-500">
                  Total Revenue
                </p>
                <h1
                  className={cn(
                    "mb-2 text-3xl font-semibold text-slate-800",
                    lato.className,
                  )}
                >
                  {new Intl.NumberFormat("en-IN", {
                    maximumSignificantDigits: 3,
                    style: "currency",
                    currency: "NPR",
                    notation: "standard",
                  }).format(data.metrics.total_revenue)}
                  -
                </h1>
                <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <TrendingUp size={16} className="text-green-600" />
                  <span>{data.growth.revenue_growth}% from last month</span>
                </div>
                <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
                  <div className="chart-blur-bottom absolute bottom-0 z-20 h-6 w-full"></div>
                  <div className="chart-blur-right absolute right-2 z-20 h-12 w-6"></div>
                  <Chart
                    chartColor="hsl(var(--color-3))"
                    chartData={data.store_revenue_chart_data}
                  />
                </div>
              </div>
              <div className="chart-wrapper relative rounded-xl border border-slate-200 p-4 hover:shadow-md">
                <p className="mb-2 text-base font-medium text-slate-500">
                  Total Orders
                </p>
                <h1
                  className={cn(
                    "mb-2 text-3xl font-semibold text-slate-800",
                    lato.className,
                  )}
                >
                  {new Intl.NumberFormat("en-IN", {}).format(
                    data.metrics.orders_total,
                  )}
                  -
                </h1>
                <div className="relative z-30 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <TrendingUp size={16} className="text-green-600" />
                  <span>{data.growth.orders_growth}% from last month</span>
                </div>
                <div className="chart-container absolute bottom-4 right-0 w-1/2 min-w-36">
                  <div className="chart-blur-bottom absolute bottom-0 z-20 h-6 w-full"></div>
                  <div className="chart-blur-right absolute right-2 z-20 h-12 w-6"></div>
                  <Chart
                    chartColor="hsl(var(--color-4))"
                    chartData={data.store_orders_chart_data}
                  />
                </div>
              </div>
            </div>
          </div>
          <OrdersTable />
        </div>
      </main>
    );
  } catch (err) {
    redirect("/vendor/profile");
  }
};

export default Dashboard;
