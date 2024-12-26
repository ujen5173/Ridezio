import { Skeleton } from "~/components/ui/skeleton";

const EventCardLoading = () => {
  return (
    <div className="flex-1">
      <Skeleton className="mb-4 aspect-[3/2]" />
      <Skeleton className="mb-2 h-5 w-11/12 rounded-sm" />
      <Skeleton className="mb-4 h-5 w-9/12 rounded-sm" />
    </div>
  );
};

export default EventCardLoading;
