import Image from "next/image";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useBusinessFormContext from "../hooks/useBusinessFormContext";

const PaymentDetails = () => {
  const { form } = useBusinessFormContext();

  return (
    <FormField
      control={form.control}
      name="faqs"
      render={({ field }) => (
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
                <div className="flex-1 space-y-2">
                  <Label className="block text-lg font-medium">
                    Merchant Code
                  </Label>
                  <Input
                    type="text"
                    placeholder="Business Esewa Merchant Code"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-[2.5px] bg-slate-200"></div>
                  <span className="text-sm uppercase text-slate-700">or</span>
                  <div className="h-8 w-[2.5px] bg-slate-200"></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="block text-lg font-medium">Qr Code</Label>
                <Input
                  type="file"
                  placeholder="Upload Esewa QR Code"
                  className="leading-[2.5]"
                />
              </div>
              <div className="space-y-2">
                <Label className="block text-lg font-medium">
                  Personal Esewa ID
                </Label>
                <Input type="text" placeholder="97******" />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default PaymentDetails;
