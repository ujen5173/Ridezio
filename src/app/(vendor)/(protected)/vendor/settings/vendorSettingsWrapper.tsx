"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AffiliateProgram from "~/app/(normal-user)/(others)/settings/_components/affiliate-program";
import EmailNotificaiton from "~/app/(normal-user)/(others)/settings/_components/email";
import GeneralSettings from "~/app/(normal-user)/(others)/settings/_components/general";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import type { GetCurrentBusinessType } from "~/server/api/routers/business";
import type { GetCurrentType } from "~/server/api/routers/users";
import type { userRoleEnum } from "~/server/server.types";
import BusinessProfile from "./BusinessProfile";
import BusinessAccountSettings from "./components/BusinessAccountSettings";

enum VendorTab {
  Business = "business",
  General = "general",
  EmailNotification = "email-notification",
  Affiliate = "affiliate-program",
  Account = "account",
}

interface VendorSettingsWrapperProps {
  user: GetCurrentType;
  business: NonNullable<GetCurrentBusinessType>;
}

const VendorSettingsWrapper = ({
  user,
  business,
}: VendorSettingsWrapperProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  function getValidTab(): VendorTab {
    return Object.values(VendorTab).includes(tab as VendorTab)
      ? (tab as VendorTab)
      : VendorTab.Business;
  }

  const selectedTab = getValidTab();

  const handleTabChange = (newTab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    router.replace(url.toString(), { scroll: false });
  };

  return (
    <div className="min-h-[calc(100dvh-5.3rem)] w-full bg-slate-100 px-4 py-12">
      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="mx-auto flex max-w-[1440px] flex-col gap-5 lg:flex-row"
      >
        <div className="h-min w-full space-y-2 lg:w-64">
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <h2 className="text-lg text-foreground sm:text-xl">Settings</h2>
          </div>
          <TabsList className="flex h-auto flex-1 flex-col rounded-lg border border-slate-200 bg-white px-0 py-2 shadow-sm">
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
              )}
              value={VendorTab.Business}
            >
              Business Profile
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
              )}
              value={VendorTab.General}
            >
              General
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
              )}
              value={VendorTab.EmailNotification}
            >
              Email Notification
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
              )}
              value={VendorTab.Account}
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
              )}
              value={VendorTab.Affiliate}
            >
              Affiliate Program
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Business Profile */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value={VendorTab.Business}
        >
          <BusinessProfile business={business} />
        </TabsContent>

        {/* General */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value={VendorTab.General}
        >
          <GeneralSettings
            user={{
              name: user.name!,
              email: user.email,
              image: user.image!,
              role: user.role as userRoleEnum,
              phoneNumber: user.phoneNumber,
            }}
          />
        </TabsContent>

        {/* Email Notification */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value={VendorTab.EmailNotification}
        >
          <EmailNotificaiton />
        </TabsContent>

        {/* Account */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value={VendorTab.Account}
        >
          <BusinessAccountSettings />
        </TabsContent>

        {/* Affiliate Program */}
        <TabsContent
          className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          value={VendorTab.Affiliate}
        >
          <AffiliateProgram />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettingsWrapper;
