"use client";

import {
  Bike,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  ShoppingCart,
} from "lucide-react";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";
import { Button } from "./button";
import { Separator } from "./separator";

export function AppSidebar({ slug }: { slug: string }) {
  const items = useMemo(() => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        disabled: false,
      },
      {
        title: "Vehicles",
        url: "/vendor/vehicles",
        icon: Bike,
        disabled: false,
      },
      {
        title: "Accessories",
        url: "/vendor/accessories",
        icon: ShoppingCart,
        disabled: false,
      },
      {
        title: "Accounts",
        url: "/vendor/profile",
        icon: Settings,
        disabled: false,
      },
    ];

    if (env.NEXT_PUBLIC_ENROLL_EVENTS === "true") {
      baseItems.push({
        title: "Events",
        url: "/vendor/events",
        icon: CalendarDays,
        disabled: false,
      });
    }

    return baseItems;
  }, []);

  const { toggleSidebar, setOpenMobile } = useSidebar();
  const path = usePathname();

  const sideBarExtraItems = [
    {
      title: "Visit your page",
      url: `/vendor/${slug}`,
      icon: ExternalLink,
    },
  ];

  return (
    <Sidebar className="bg-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between border-b border-border py-[1.1rem]">
            <div className="scale-x-90">
              <Logo link={"/dashboard"} tw="h-6 fill-secondary" />
            </div>
            <Button
              variant={"outline"}
              size="icon"
              onClick={() => {
                toggleSidebar();
              }}
            >
              <PanelLeft size={18} className="text-slate-600" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link
                    href={item.url}
                    onClick={() => {
                      setOpenMobile(false);
                    }}
                    className={cn(
                      "flex gap-2 rounded-md px-2 py-2",
                      path === item.url
                        ? "text-primary-500 border border-border bg-white shadow-sm hover:bg-slate-50"
                        : "text-slate-600 hover:bg-gray-200",
                      item.disabled
                        ? "pointer-events-none cursor-not-allowed opacity-50"
                        : "cursor-pointer",
                    )}
                  >
                    <item.icon size={17} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-4" />
            <SidebarMenu>
              {sideBarExtraItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link target="_blank" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              onClick={() => {
                void signOut().then(() => {
                  window.location.href = "/";
                });
              }}
              className="w-full gap-2"
              variant={"outline"}
            >
              <LogOut size={15} className="text-slate-600" />
              <span>Logout</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
