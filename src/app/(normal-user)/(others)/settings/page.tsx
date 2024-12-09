import { redirect } from "next/navigation";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import AccountSettings from "./_components/account";
import EmailNotificaiton from "./_components/email";
import GeneralSettings from "./_components/general";

const Settings = async () => {
  const userDetails = await api.user.current();

  if (userDetails.role === "VENDOR") {
    redirect("/vendor/profile");
  }

  return (
    <>
      <HeaderHeight />

      <div className="w-full bg-slate-100 px-4 py-12">
        <Tabs defaultValue="general" className="container flex gap-5">
          <div className="h-min w-72 space-y-4">
            <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
              <h2 className="text-lg text-foreground sm:text-xl">Settings</h2>
            </div>
            <TabsList className="flex h-auto flex-1 flex-col rounded-lg border border-slate-200 bg-white px-0 py-2 shadow-sm">
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
                )}
                value="general"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
                )}
                value="email"
              >
                Email Notification
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-slate-100 data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  "w-full justify-start rounded-none px-6 py-3 text-left shadow-none hover:bg-slate-100",
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
            value="general"
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
            value="email"
          >
            <EmailNotificaiton />
          </TabsContent>

          {/* Account */}
          <TabsContent
            className="m-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            value="account"
          >
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
