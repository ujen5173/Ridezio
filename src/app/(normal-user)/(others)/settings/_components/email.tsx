import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

const EmailNotificaiton = () => {
  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Email Notification</h2>
      <p className="mb-6 text-base text-slate-600">
        Control what email notifications you want to receive.
      </p>
      <div className="mb-10 space-y-4">
        <div className="items-top flex space-x-2">
          <Checkbox id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Latest Updates on Our Website
            </label>
            <p className="text-sm text-muted-foreground">
              Stay informed about the newest features, updates, and improvements
              on our platform for an enhanced user experience.
            </p>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms2" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Explore Newly Added Shops Nearby
            </label>
            <p className="text-sm text-muted-foreground">
              Discover the latest shops added in your area, offering fresh
              options and exciting products to explore.
            </p>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms3" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Upcoming Local Events Around You
            </label>
            <p className="text-sm text-muted-foreground">
              Find out about exciting events happening near you, from community
              gatherings to exclusive local experiences.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" variant={"outline"}>
          Discard
        </Button>
        <Button size="sm" variant={"primary"}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EmailNotificaiton;
