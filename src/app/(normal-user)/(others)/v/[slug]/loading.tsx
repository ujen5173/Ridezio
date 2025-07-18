import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Skeleton } from "~/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <HeaderHeight />
      <section className="px-4">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 py-6 md:flex-row md:py-10 lg:gap-10">
          <div className="mx-auto flex h-fit w-full flex-col-reverse gap-0 sm:w-10/12 md:w-7/12 lg:flex-row lg:gap-2">
            <div className="mt-2 flex h-full space-x-2 lg:mt-0 lg:block lg:space-x-0 lg:space-y-2">
              <Skeleton className="size-16" />
              <Skeleton className="size-16" />
              <Skeleton className="size-16" />
            </div>
            <div className="relative aspect-[16/12] w-full">
              <Skeleton className="h-full w-full lg:min-h-0" />
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <Skeleton className="mb-4 h-8 w-36" />
            <Skeleton className="mb-4 h-8 w-11/12" />

            <Skeleton className="h-8 w-36" />
            <div className="my-6 flex items-center gap-2">
              <Skeleton className="size-20" />
              <Skeleton className="size-20" />
            </div>

            <div className="mb-6 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-11/12" />
              <Skeleton className="h-8 w-8/12" />
            </div>

            <Skeleton className="mb-2 h-12 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="mb-4 h-12 flex-1" />
              <Skeleton className="mb-4 h-12 flex-1" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
