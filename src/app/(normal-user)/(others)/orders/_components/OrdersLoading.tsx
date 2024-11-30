import { Skeleton } from "~/components/ui/skeleton";

const OrdersLoading = () => {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-10/12" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="mb-4 h-6 w-7/12" />
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="mb-4 h-6 w-5/12" />
      <Skeleton className="mb-4 size-20" />
    </div>
  );
};

export default OrdersLoading;
