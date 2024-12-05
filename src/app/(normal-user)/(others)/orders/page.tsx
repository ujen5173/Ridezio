"use client";

import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Rating from "~/components/ui/ratting";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState<string | null>(null);

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

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const { mutateAsync, status } = api.business.addReview.useMutation();

  const submitReview = async () => {
    try {
      if (!selectedVendor) return;
      if (rating === 0) {
        toast({
          title: "Rating is required",
          description: "Please select a rating",
        });
        return;
      }

      if (review.trim() === "") {
        toast({
          title: "Review is required",
          description: "Please write a review",
        });
        return;
      }

      await mutateAsync({
        businessId: selectedVendor,
        rating,
        review,
      });

      toast({
        title: "Review added successfully",
        description: "Thank you for your review 🎉",
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      return;
    } finally {
      setRating(0);
      setReview("");
      setIsOpen(false);
    }
  };

  return (
    <>
      <HeaderHeight />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="line-clamp-1 text-xl">
              Review for <span className="text-secondary">{vendorName}</span>
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-4 space-y-2">
              <Label>
                <span className="text-slate-600">Rating</span>
              </Label>
              <Rating onChange={setRating} defaultValue={0} />
            </div>
            <div className="mb-4 space-y-2">
              <Label>
                <span className="text-slate-600">Review</span>
              </Label>
              <Textarea
                onChange={(e) => setReview(e.target.value)}
                placeholder={`How was your experience on ${vendorName}?`}
                className="h-60 w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                disabled={status === "pending"}
                type="button"
                variant={"outline"}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={submitReview}
              disabled={status === "pending"}
              type="button"
              variant={"secondary"}
            >
              {status === "pending" && (
                <Loader size={16} className="mr-2 animate-spin" />
              )}
              {status === "pending" ? "Publishing..." : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <OrderCard
                    setIsOpen={setIsOpen}
                    setSelectedVendor={setSelectedVendor}
                    setVendorName={setVendorName}
                    key={order.id}
                    orderDetails={order}
                  />
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
