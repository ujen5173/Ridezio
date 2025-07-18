"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import type { GetCurrentType } from "~/server/api/routers/users";
import AccountSettings from "./_components/account";
import AffiliateProgram from "./_components/affiliate-program";
import EmailNotificaiton from "./_components/email";
import GeneralSettings from "./_components/general";

enum Mode {
  General = "general",
  EmailNotification = "email-notification",
  Affiliate = "affiliate-program",
  Account = "account",
}

const SettingsWrapper = ({ userDetails }: { userDetails: GetCurrentType }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  function getValidMode(): Mode {
    return Object.values(Mode).includes(tab as Mode)
      ? (tab as Mode)
      : Mode.General;
  }

  const selectedTab = getValidMode();

  const handleTabChange = (newTab: string) => {
    // Update the URL param without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    router.replace(url.toString(), { scroll: false });
  };

  return (
    <>
      <HeaderHeight />

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
                value={Mode.General}
              >
                General
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
                )}
                value={Mode.EmailNotification}
              >
                Email Notification
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
                )}
                value={Mode.Account}
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
                )}
                value={Mode.Affiliate}
              >
                Affiliate Program
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General */}
          <TabsContent
            className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            value={Mode.General}
          >
            <GeneralSettings
              user={{
                name: userDetails.name!,
                email: userDetails.email,
                image: userDetails.image!,
                role: userDetails.role,
                phoneNumber: userDetails.phoneNumber,
              }}
            />
          </TabsContent>

          {/* Email Notification */}
          <TabsContent
            className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            value={Mode.EmailNotification}
          >
            <EmailNotificaiton />
          </TabsContent>

          {/* Account */}
          <TabsContent
            className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            value={Mode.Account}
          >
            <AccountSettings />
          </TabsContent>
          <TabsContent
            className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            value={Mode.Affiliate}
          >
            <Suspense fallback="hi">
              <AffiliateProgram />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SettingsWrapper;
