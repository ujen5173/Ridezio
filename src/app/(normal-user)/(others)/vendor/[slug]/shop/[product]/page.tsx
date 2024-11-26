import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const Product = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <h1
        className={cn(
          "mb-2 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl",
        )}
      >
        This page is under construction
      </h1>
      <p className={cn("mb-4 text-lg")}>Please check back later for updates</p>

      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant={"secondary"}>Back to Homepage</Button>
        </Link>
      </div>
    </main>
  );
};

export default Product;
