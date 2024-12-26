import { TriangleAlert } from "lucide-react";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import EmailNotificaiton from "~/app/(normal-user)/(others)/settings/_components/email";
import GeneralSettings from "~/app/(normal-user)/(others)/settings/_components/general";
import { constructMetadata } from "~/app/utils/site";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import BusinessProfile from "./BusinessProfile";
import BusinessAccountSettings from "./components/BusinessAccountSettings";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Profile | Velocit`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/profile`,
  });
}

const VendorSetup = async () => {
  const userDetails = api.user.current();
  const businessDetails = api.business.current();
  const [user, business] = await Promise.all([userDetails, businessDetails]);

  if (!business) {
    redirect("/auth/signin");
  }

  return (
    <section className="w-full px-2 py-4 sm:px-4 sm:py-6">
      {!user.vendor_setup_complete && (
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-4 flex items-center gap-4 rounded-md border border-red-600 bg-red-50 p-4 text-red-600">
            <div>
              <TriangleAlert size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-base font-semibold">
                Setup your business information.
              </p>
              <p className="text-sm">
                Before moving forward, please complete your business profile.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="business"
        className="mx-auto flex max-w-[1440px] flex-col gap-5 lg:flex-row"
      >
        <div className="h-min w-full space-y-2 lg:w-64">
          <div className="rounded-md border border-slate-200 bg-white px-6 py-3 shadow-sm">
            <h2 className="text-lg text-foreground sm:text-xl">Settings</h2>
          </div>

          <TabsList className="flex h-auto flex-1 flex-col rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm sm:flex-row lg:flex-col lg:px-0">
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full rounded-none px-6 py-3 shadow-none hover:bg-slate-100",
                "rounded-sm lg:rounded-none",
                "text-center lg:justify-start",
              )}
              value="business"
            >
              Business Profile
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full rounded-none px-6 py-3 shadow-none hover:bg-slate-100",
                "rounded-sm lg:rounded-none",
                "text-center lg:justify-start",
              )}
              value="general"
            >
              General
            </TabsTrigger>

            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full rounded-none px-6 py-3 shadow-none hover:bg-slate-100",
                "rounded-sm lg:rounded-none",
                "text-center lg:justify-start",
              )}
              value="email"
            >
              Email Notification
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full rounded-none px-6 py-3 shadow-none hover:bg-slate-100",
                "rounded-sm lg:rounded-none",
                "text-center lg:justify-start",
              )}
              value="account"
            >
              Account
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value="business"
        >
          <BusinessProfile business={business} />
        </TabsContent>

        {/* General */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value="general"
        >
          <GeneralSettings
            user={{
              name: user.name!,
              phoneNumber: user.phoneNumber,
              image: user.image!,
              email: user.email,
              role: user.role,
            }}
          />
        </TabsContent>

        {/* Email Notification */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value="email"
        >
          <EmailNotificaiton />
        </TabsContent>

        {/* Account */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value="account"
        >
          <BusinessAccountSettings />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default VendorSetup;
