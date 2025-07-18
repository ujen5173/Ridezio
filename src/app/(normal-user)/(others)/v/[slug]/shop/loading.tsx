import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Skeleton } from "~/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <HeaderHeight />
      <section className="px-4">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 py-6 md:flex-row md:py-10 lg:gap-10">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full pt-20">
              <Skeleton className="mx-auto mb-4 h-8 w-40" />
              <Skeleton className="mx-auto mb-4 h-8 w-5/12 min-w-96" />
            </div>

            <div className="mb-40 flex w-full items-center justify-center gap-2">
              <Skeleton className="h-8 w-5/12" />
              <Skeleton className="h-8 w-28" />
            </div>

            <div className="w-full space-y-4">
              <Skeleton className="h-8 w-40" />

              <div
                className={"grid gap-x-2 gap-y-4 pb-32"}
                style={{
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,280px))",
                }}
              >
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
