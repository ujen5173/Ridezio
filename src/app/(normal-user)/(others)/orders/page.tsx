import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import OrderCard from "./_components/OrderCard";

const Orders = () => {
  return (
    <>
      <HeaderHeight />
      <section className={cn("w-full bg-slate-50")}>
        <div className="border-b border-border">
          <div className="mx-auto max-w-[1400px]">
            <div className="px-4 pb-10 pt-20">
              <h1 className="text-4xl font-bold">Your Orders</h1>
            </div>
            <ul className="flex">
              <li className="border-b-4 border-secondary px-4 py-2 font-semibold text-secondary">
                All
              </li>
              <li className="border-b-4 border-transparent px-4 py-2 font-medium text-slate-500">
                In Progress
              </li>
              <li className="border-b-4 border-transparent px-4 py-2 font-medium text-slate-500">
                Completed
              </li>
              <li className="border-b-4 border-transparent px-4 py-2 font-medium text-slate-500">
                Rejected
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8">
            <div className="flex items-center gap-2">
              <Input placeholder="Search by store name" className="w-80" />
              <Button variant={"primary"}>Search</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
              <OrderCard
                orderDetails={{
                  id: 92131,
                  inventory: 1,
                  name: "City Explorer Rental",
                  slug: "city-explorer-rental",
                  status: "completed",
                  location: "New York City, NY",
                  date: {
                    start: "2024-11-05T10:00:00Z",
                    end: "2024-11-07T18:00:00Z",
                  },
                  price: 75.0,
                  vehicle: "e-bicycle",
                  bookedOn: "2024-11-01T14:30:00Z",
                }}
              />
              <OrderCard
                orderDetails={{
                  id: 23614,
                  inventory: 5,
                  name: "Mountain Adventure",
                  slug: "mountain-adventure",
                  status: "in-progress",
                  location: "Denver, CO",
                  date: {
                    start: "2024-11-08T09:00:00Z",
                    end: "2024-11-12T17:00:00Z",
                  },
                  price: 120.0,
                  vehicle: "bike",
                  bookedOn: "2024-11-05T08:20:00Z",
                }}
              />
              <OrderCard
                orderDetails={{
                  id: 26768,
                  inventory: 1,
                  name: "City Commuter Special",
                  slug: "city-commuter-special",
                  status: "active",
                  location: "Los Angeles, CA",
                  date: {
                    start: "2024-11-10T08:00:00Z",
                    end: "2024-11-10T20:00:00Z",
                  },
                  price: 45.0,
                  vehicle: "scooter",
                  bookedOn: "2024-11-08T11:15:00Z",
                }}
              />
              <OrderCard
                orderDetails={{
                  id: 78564,
                  inventory: 2,
                  name: "Eco-Friendly Weekend",
                  slug: "eco-friendly-weekend",
                  status: "completed",
                  location: "Portland, OR",
                  date: {
                    start: "2024-11-02T12:00:00Z",
                    end: "2024-11-04T15:00:00Z",
                  },
                  price: 90.0,
                  vehicle: "bicycle",
                  bookedOn: "2024-10-30T13:45:00Z",
                }}
              />
              <OrderCard
                orderDetails={{
                  id: 13645,
                  inventory: 2,
                  name: "Luxury Road Trip",
                  slug: "luxury-road-trip",
                  status: "cancelled",
                  location: "Miami, FL",
                  date: {
                    start: "2024-11-15T08:00:00Z",
                    end: "2024-11-18T20:00:00Z",
                  },
                  price: 300.0,
                  vehicle: "car",
                  bookedOn: "2024-11-10T16:00:00Z",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Orders;
