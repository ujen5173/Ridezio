"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type GetUserOrdersType } from "~/server/api/routers/users";
import { rentalStatusEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";
import OrderCard from "./_components/OrderCard";
import OrdersLoading from "./_components/OrdersLoading";

type TFiltered = (typeof rentalStatusEnum.enumValues)[number] | "all";

const Orders = () => {
  const { data: user } = useSession();

  if (user?.user.role === "VENDOR") {
    redirect("/dashboard");
  }

  const { data, isLoading } = api.user.getUserOrders.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [orders, setOrders] = useState<GetUserOrdersType>([]);
  const [filteredType, setFilteredType] = useState<TFiltered>("all");

  useEffect(() => {
    if (!isLoading && data) {
      const filteredOrders = data.filter((order) => {
        if (filteredType === "all") return true;
        return order.status === filteredType;
      });
      setOrders(filteredOrders);
    }
  }, [filteredType, data, isLoading]);

  const filterByVendorName = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputRef.current) return;

    const value = inputRef.current.value;

    if (!data) {
      return [];
    }

    if (value === "") return setOrders(data);

    const filteredOrders = data.filter((order) =>
      order.vendorName!.toLowerCase().includes(value.toLowerCase()),
    );

    setOrders(filteredOrders);
  };

  return (
    <>
      <HeaderHeight />

      <section className={cn("w-full bg-slate-50 px-4")}>
        <div className="border-b border-border">
          <div className="mx-auto max-w-[1400px]">
            <div className="px-4 pb-10 pt-20">
              <h1 className="text-4xl font-bold">Your Orders</h1>
            </div>
            <ul className="flex">
              {["all", ...rentalStatusEnum.enumValues].map((status) => (
                <li
                  key={status}
                  onClick={() => setFilteredType(status as TFiltered)}
                  className={cn(
                    "cursor-pointer border-b-4 px-4 py-2 font-semibold capitalize",
                    filteredType === status
                      ? "border-secondary text-secondary"
                      : "border-transparent text-slate-600",
                  )}
                >
                  {status}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8">
            <form onSubmit={filterByVendorName}>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by rental store name"
                  ref={inputRef}
                  className="w-80"
                  onChange={(e) => {
                    if (e.target.value === "" && data) {
                      setOrders(data);
                    }
                  }}
                />
                <Button variant={"secondary"}>Search</Button>
              </div>
            </form>
            <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
              {isLoading ? (
                <>
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                </>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} orderDetails={order} />
                ))
              )}
            </div>
            {!isLoading && orders.length === 0 && (
              <div className="flex h-96 items-center justify-center py-8">
                <p className="text-lg font-semibold text-slate-600">
                  No orders yet!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Orders;
