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
import { WEEK_DAYS } from "~/app/utils/helpers";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { toast } from "~/hooks/use-toast";
import { type AppRouter } from "~/server/api/root";
import { vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";
import BusinessHours from "./components/BusinessHours";
import CreateFAQs from "./components/CreateFAQs";
import GeneralInfo from "./components/GeneralInfo";
import LocationDetails from "./components/LocationDetails";
import PaymentDetails from "./components/PaymentDetails";
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
  name: z
    .string()
    .min(2, {
      message: "Business name must be at least 2 characters",
    })
    .max(50),
  location: z.object({
    map: z.string().url(),
    lat: z.number().min(1, { message: "Enter your business latitude" }),
    lng: z.number().min(1, { message: "Enter your business longitude" }),
    address: z
      .string()
      .min(2, { message: "Add Address of you business" })
      .max(50),
    city: z.string().min(2, { message: "Enter City name" }).max(50),
  }),
  sellGears: z.boolean().default(false),
  phoneNumbers: z
    .array(
      z
        .string()
        .min(9, { message: "Enter a valid Number" })
        .max(15, { message: "Enter a valid Number" }),
    )
    .nonempty({
      message: "Enter at least one phone number",
    }),
  businessHours: z.record(
    z.string().min(2).max(50),
    z
      .object({
        open: z.string().min(2).max(50),
        close: z.string().min(2).max(50),
      })
      .nullable(),
  ),
  availableVehicleTypes: z.array(z.enum(vehicleTypeEnum.enumValues)).nonempty({
    message: "Enter at least one vehicle Type",
  }),
  logo: z.string().url().nullable(),
  faqs: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
      order: z.number(),
    }),
  ),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      order: z.number(),
    }),
  ),
});

export const imageSchema = z.object({
  images: z
    .object({
      id: z.string(),
      url: z.string().url(),
      order: z.number(),
    })
    .array(),
});

export const BusinessFormContext = createContext({});

const BusinessProfile = ({ business }: { business: CurrentBusinessType }) => {
  const { update, data } = useSession(); // to update the user in the session
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { mutateAsync, status } = api.business.update.useMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      ...business,
      name: business.name ?? "",
      businessHours: WEEK_DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day]: business.businessHours?.[day] ?? defaultHours,
        }),
        {},
      ),
    },
  });
  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    mode: "onBlur",
    defaultValues: {
      images: business.images ?? [],
    },
  });

  const images = imageForm.watch("images") || [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isValid = await form.trigger();

    if (!isValid) {
      return; // Stop submission if form is invalid
    }

    const result = {
      ...values,
      images: images,
      logo: form.getValues("logo"),
    };

    if (form.getValues("logo") === null) {
      toast({
        title: "Logo Required",
        description: "Please upload a logo for your shop",
        variant: "destructive",
      });

      return;
    }

    if (images.length < 1) {
      toast({
        title: "Shop Images Required",
        description: "Please upload at least one image of your shop",
        variant: "destructive",
      });

      return;
    }

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

      const url = data?.user.vendor_setup_complete
        ? "/vendor/vehicles"
        : "/dashboard";

      toast({
        title: data?.user.vendor_setup_complete
          ? "Profile Updated. Redirecting to Dashboard..."
          : "Profile Updated. Redirecting to Vehicles Page...",
        description: "Your profile has been updated successfully",
      });

      await update(newUser);

      router.push(url);
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
              <ShopImages form={imageForm} images={images} />
              <BusinessHours />
              <PaymentDetails />
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
