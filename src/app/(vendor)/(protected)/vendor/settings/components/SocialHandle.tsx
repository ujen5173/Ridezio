import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type formSchema } from "../BusinessProfile";

const SocialHandle = () => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  return (
    <FormField
      control={form.control}
      name="instagramHandle"
      render={({ field }) => (
        <div className="py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Socials Handles</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={field.name}>Instagram</Label>
              <Input
                {...field}
                id={field.name}
                placeholder="elonmusk"
                autoComplete="off"
                value={field.value ?? ""}
              />
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    />
  );
};

export default SocialHandle;
