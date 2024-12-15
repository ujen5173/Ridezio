import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const BusinessAccountSettings = async () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-6 text-xl font-semibold text-destructive">
          Dangar Zone
        </h2>
        <h2 className="mb-2 text-xl font-semibold">Business Account</h2>
        <p className="mb-6 text-base text-slate-600">
          Take a break or Delete you bussiness account or deactivate it.
        </p>
        <div className="mb-4 flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="What you want to do?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="blueberry">Take a Holiday</SelectItem>
                <SelectItem value="apple">Deactivate</SelectItem>
                <SelectItem value="banana">Delete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button variant={"destructive"} size="sm">
          Confirm
        </Button>
      </div>

      <Separator />

      <div>
        <h2 className="mb-2 text-xl font-semibold">Personal Account</h2>
        <p className="mb-6 text-base text-slate-600">
          Delete you account or deactivate it.
        </p>
        <div className="mb-4 flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="What you want to do?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Deactivate</SelectItem>
                <SelectItem value="banana">Delete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button variant={"destructive"} size="sm">
          Confirm
        </Button>
      </div>
    </section>
  );
};

export default BusinessAccountSettings;
