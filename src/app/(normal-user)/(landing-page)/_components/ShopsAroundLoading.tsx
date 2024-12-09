import VendorCardLoading from "~/app/_components/_/VendorCardLoading";
import { Skeleton } from "~/components/ui/skeleton";

const ShopsAroundLoading = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16">
        <Skeleton className="mb-5 h-10 w-40 rounded-sm" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="basis-full space-y-4 xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <VendorCardLoading />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsAroundLoading;
