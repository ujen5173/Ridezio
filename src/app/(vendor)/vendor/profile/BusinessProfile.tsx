// TODO: There is lag in input form. Need to fix it.
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type inferRouterOutputs } from "@trpc/server";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "~/app/_components/contexts/root";
import { WEEK_DAYS } from "~/app/utils/helpers";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { toast } from "~/hooks/use-toast";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { type AppRouter } from "~/server/api/root";
import { vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";
import BusinessHours from "./components/BusinessHours";
import CreateFAQs from "./components/CreateFAQs";
import GeneralInfo from "./components/GeneralInfo";
import LocationDetails from "./components/LocationDetails";
import ShopImages from "./components/ShopImages";

type RouterOutput = inferRouterOutputs<AppRouter>;

const defaultHours = {
  open: "6:00 AM",
  close: "7:00 PM",
};

export type CurrentBusinessType = NonNullable<
  RouterOutput["business"]["current"]
>;

export const formSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  location: z.object({
    map: z.string().url(),
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(2).max(50),
    city: z.string().min(2).max(50),
  }),
  sellGears: z.boolean(),
  phoneNumbers: z.array(z.string().min(10).max(15)),
  businessHours: z.record(
    z.string().min(2).max(50),
    z
      .object({
        open: z.string().min(2).max(50),
        close: z.string().min(2).max(50),
      })
      .nullable(),
  ),
  availableVehicleTypes: z.array(z.enum(vehicleTypeEnum.enumValues)),
  logo: z.string().url().nullable(),
  faqs: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
      order: z.number(),
    }),
  ),
  images: z.array(z.string().url()),
});

export const BusinessFormContext = createContext({});

const BusinessProfile = ({ business }: { business: CurrentBusinessType }) => {
  const { update, data } = useSession(); // to update the user in the session
  const { width, height } = useWindowDimensions();
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser(); // session user
  const router = useRouter();

  const { mutateAsync, status } = api.business.update.useMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...business,
      businessHours: WEEK_DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day]: business.businessHours?.[day] ?? defaultHours,
        }),
        {},
      ),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = {
      ...values,
      images: form.getValues("images"),
      logo: form.getValues("logo"),
    };
    setLoading(true);
    try {
      await mutateAsync(result);

      const newUser = {
        ...data,
        user: {
          ...data!.user,
          vendor_setup_complete: true,
        },
      } as Session | null;

      if (data?.user.vendor_setup_complete === false) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2500);
      }

      toast({
        title: "Profile Updated. Redirecting to Vehicles Page...",
        description: "Your profile has been updated successfully",
      });

      await update(newUser);
      setUser(newUser);

      router.push("/vendor/vehicles");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BusinessFormContext.Provider
        value={{
          form,
          business,
        }}
      >
        <div>
          <h2 className="mb-2 text-2xl font-semibold">General</h2>
          <p className="mb-6 text-lg text-slate-600">
            Settings and options for your account.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <GeneralInfo />
              <ShopImages />
              <BusinessHours />
              <CreateFAQs />
              <LocationDetails />

              <div className="mt-10 flex justify-start gap-2">
                <Button
                  disabled={status === "pending"}
                  onClick={() => onSubmit(form.getValues())}
                  variant={"primary"}
                >
                  {loading ? "Saving Details..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </BusinessFormContext.Provider>
    </>
  );
};

export default BusinessProfile;
