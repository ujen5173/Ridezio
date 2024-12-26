import { Skeleton } from "~/components/ui/skeleton";

const VendorCardLoading = () => {
  return (
    <div className="flex-1">
      <Skeleton className="mb-4 aspect-[4/3]" />
      <Skeleton className="mb-2 h-5 w-11/12 rounded-sm" />
      <Skeleton className="mb-4 h-5 w-9/12 rounded-sm" />
      <div className="flex gap-2">
        <Skeleton className="mb-2 h-5 w-10 rounded-sm" />
        <Skeleton className="mb-2 h-5 w-10 rounded-sm" />
      </div>
    </div>
  );
};

export default VendorCardLoading;
