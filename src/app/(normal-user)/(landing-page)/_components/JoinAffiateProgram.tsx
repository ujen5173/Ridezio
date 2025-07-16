import Image from "next/image";
import Link from "next/link";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const JoinAffiateProgram = () => {
  return (
    <section className="w-full bg-slate-50">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-4 py-16">
        <div className="hidden flex-[2] lg:flex">
          <Image
            src="/images/become-a-partner.svg"
            alt="Join Affiliate Program"
            width={500}
            height={500}
          />
        </div>
        <div className="flex-[3]">
          <p className="w-full text-lg text-slate-600 md:w-9/12">
            Ridezio <strong>Affiliate Program</strong>
          </p>
          <h1
            className={cn(
              "mb-4 text-3xl font-bold text-slate-700 md:text-4xl",
              chakra_petch.className,
            )}
          >
            Earn with our{" "}
            <span className="text-secondary underline">Affiliate Program</span>
          </h1>
          <p className="mb-8 w-full text-lg text-slate-600">
            Help us grow the Ridezio community and get rewarded! Choose your
            path:
          </p>
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-semibold text-slate-700">
                  Onboard New Vendors
                </h2>
                <p className="mb-4 text-slate-600">
                  Refer a vehicle rental vendor to Ridezio and they’ll get{" "}
                  <span className="font-bold text-secondary">
                    1 day of free rentals
                  </span>{" "}
                  when they join.
                </p>
              </div>
              <span className="inline-block rounded border border-secondary/10 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                Free rental for a day
              </span>
            </div>
            <div className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-semibold text-slate-700">
                  Onboard New Users
                </h2>
                <p className="mb-4 text-slate-600">
                  Invite friends to Ridezio! Both you and your friend can{" "}
                  <span className="font-bold text-secondary">claim points</span>{" "}
                  and use them for free rides.
                </p>
              </div>
              <span className="inline-block rounded border border-secondary/10 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                Redeem points, win a free 1-day rental
              </span>
            </div>
          </div>
          <Link href="/auth/signin">
            <Button variant="secondary" size="lg">
              Join Affiliate Program
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinAffiateProgram;
