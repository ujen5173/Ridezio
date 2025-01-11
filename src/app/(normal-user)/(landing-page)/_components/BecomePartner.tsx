import Image from "next/image";
import Link from "next/link";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const BecomePartner = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-4 py-16">
        <div className="flex-[3]">
          <p className="lg:7/12 w-full text-lg text-slate-600 md:w-9/12">
            Velocit for <strong>Vendors</strong>
          </p>
          <h1
            className={cn(
              "mb-4 text-3xl font-bold text-slate-700 md:text-4xl",
              chakra_petch.className,
            )}
          >
            Easy solutions to grow your{" "}
            <span className="text-secondary underline">Business</span>
          </h1>
          <p className="mb-6 hidden w-full text-lg text-slate-600 lg:block">
            We offers simple and flexible tools for vehicle rental vendors. From{" "}
            <strong className="text-destructive underline">managing</strong> to{" "}
            <strong className="text-destructive underline">
              analyzing bookings
            </strong>
            , our platform helps you reach more customers and run your business
            smoothly. With{" "}
            <strong className="text-destructive underline">
              built-in analytics
            </strong>
            , you can track performance. Focus on what you do best, and let us
            handle the rest.
          </p>
          <p className="mb-4 block w-full text-base text-slate-600 lg:hidden">
            We provide flexible tools for vehicle rental vendors. Our platform
            helps{" "}
            <strong className="text-destructive underline">
              manage bookings
            </strong>
            ,{" "}
            <strong className="text-destructive underline">
              analyze performance
            </strong>
            , and grow your business. With{" "}
            <strong className="text-destructive underline">
              built-in analytics
            </strong>
            , you can focus on what matters while we handle the details.
          </p>
          <Link href="/auth/signin">
            <Button variant={"secondary"}>Become a Partner</Button>
          </Link>
        </div>
        <div className="hidden flex-[2] lg:flex">
          <Image
            src="/images/become-a-partner.svg"
            alt="Become a Partner"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
};

export default BecomePartner;
