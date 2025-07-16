import { CheckCircle2 } from "lucide-react"; // You can use any icon library
import Image from "next/image";
import Link from "next/link";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const benefits = [
  {
    title: "Easy Booking Management",
    description:
      "Handle all your bookings in one place with our intuitive dashboard.",
  },
  {
    title: "Built-in Analytics",
    description:
      "Track your business performance and make data-driven decisions.",
  },
  {
    title: "Reach More Customers",
    description: "Expand your reach and get discovered by more renters.",
  },
  {
    title: "Secure Payments",
    description: "Enjoy fast, secure, and reliable payment processing.",
  },
];

const BecomePartner = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col-reverse items-center gap-10 px-4 py-16 lg:flex-row">
        <div className="w-full flex-[3]">
          <p className="mb-2 w-full text-lg text-slate-600 md:w-9/12">
            Ridezio for <strong>Vendors</strong>
          </p>
          <h1
            className={cn(
              "mb-4 text-3xl font-bold text-slate-700 md:text-4xl",
              chakra_petch.className,
            )}
          >
            Grow your <span className="text-secondary underline">Business</span>{" "}
            with Ease
          </h1>
          <p className="mb-6 w-full text-lg text-slate-600">
            We offer simple and flexible tools for vehicle rental vendors. From{" "}
            <strong className="text-destructive underline">managing</strong> to{" "}
            <strong className="text-destructive underline">
              analyzing bookings
            </strong>
            , our platform helps you reach more customers and run your business
            smoothly. With{" "}
            <strong className="text-destructive underline">
              built-in analytics
            </strong>
            , you can track performance and focus on what you do best.
          </p>
          <ul className="mb-8 grid gap-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-secondary" size={22} />
                <div>
                  <span className="font-semibold text-slate-700">
                    {benefit.title}
                  </span>
                  <div className="text-sm text-slate-600">
                    {benefit.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/auth/signin">
            <Button variant="secondary" size="lg">
              Become a Partner
            </Button>
          </Link>
        </div>
        <div className="flex w-full flex-[2] items-center justify-center">
          <Image
            src="/images/become-a-partner.svg"
            alt="Become a Partner"
            width={500}
            height={500}
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default BecomePartner;
