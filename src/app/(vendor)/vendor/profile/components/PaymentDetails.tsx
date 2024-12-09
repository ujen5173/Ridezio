import Image from "next/image";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useBusinessFormContext from "../hooks/useBusinessFormContext";

const PaymentDetails = () => {
  const { form } = useBusinessFormContext();

  return (
    <div className="py-6">
      <div className="">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Payment via Esewa</h1>
          <Image src="/esewa.svg" alt="Esewa Logo" width={20} height={20} />
        </div>

        <p className="mb-4 text-lg font-medium text-slate-600">
          Esewa Payment Details
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="merchantCode"
              render={({ field }) => (
                <div className="flex-1 space-y-2">
                  <Label htmlFor={field.name} className="block font-medium">
                    Merchant Code
                    <div className="span text-sm italic text-slate-700">
                      (Required to receive online payment)
                    </div>
                  </Label>
                  <Input
                    id={field.name}
                    {...field}
                    type="text"
                    placeholder="Business Esewa Merchant Code"
                  />
                </div>
              )}
            />
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
