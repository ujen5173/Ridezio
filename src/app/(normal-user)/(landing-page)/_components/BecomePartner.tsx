import Link from "next/link";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const BecomePartner = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 py-16">
        <p className="lg:7/12 w-full text-lg text-slate-600 md:w-9/12">
          Velocit for Vendors
        </p>
        <h1
          className={cn(
            "mb-4 text-3xl font-bold md:text-4xl",
            chakra_petch.className,
          )}
        >
          Easy solutions to grow your Business
        </h1>
        <p className="lg:7/12 mb-6 w-full text-lg text-slate-600 md:w-9/12">
          Velocit offers simple and flexible tools for vehicle rental vendors.
          From analyzing bookings to managing profile, our platform helps you
          reach more customers and run your business smoothly. With built-in
          analytics, you can track performance. Focus on what you do best, and
          let us handle the rest.
        </p>

        <Link href="/auth/signin">
          <Button variant={"secondary"}>Become a Partner</Button>
        </Link>
      </div>
    </section>
  );
};

export default BecomePartner;
