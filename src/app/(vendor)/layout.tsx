import React from "react";
import { AppSidebar } from "~/components/ui/app-sidebar";
import CustomSidebarTriggerHeader from "~/components/ui/custom-sidebar-trigger-header";
import { SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

const OthersPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const business = await api.business.current();

  return (
    <main
      className={cn(
        "relative flex h-screen w-full overflow-hidden bg-background",
      )}
    >
      <SidebarProvider>
        <div className="flex h-full w-full">
          {/* Sidebar wrapper */}
          <div className="h-full shrink-0">
            <AppSidebar
              slug={
                business?.status === "active"
                  ? (business.slug ?? "/vendor/settings")
                  : "/vendor/settings"
              }
            />
          </div>

          {/* Main content wrapper */}
          <div className="flex-1 overflow-auto">
            <main className="min-h-full w-full">
              <CustomSidebarTriggerHeader />
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default OthersPageLayout;
