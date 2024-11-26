"use client";

import {
  Bike,
  CalendarDays,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  PanelLeft,
  Settings,
  ShoppingCart,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { cn } from "~/lib/utils";
import Logo from "~/svg/logo";
import { Button } from "./button";
import { Separator } from "./separator";

const items = [
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
    url: "/accessories",
    icon: ShoppingCart,
    disabled: false,
  },
  {
    title: "Events",
    url: "/vendor/events",
    icon: CalendarDays,
    disabled: true,
  },
  {
    title: "Messages",
    url: "/chats",
    icon: MessageCircleMore,
    disabled: true,
  },
  {
    title: "Accounts",
    url: "/vendor/profile",
    icon: Settings,
    disabled: false,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const path = usePathname();

  const sideBarExtraItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Visit your page",
      url: "/vendor/profile",
      icon: ExternalLink,
    },
  ];

  return (
    <Sidebar className="bg-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between border-b border-border py-5">
            <div className="scale-x-90">
              <Logo tw="h-6 fill-secondary" />
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
              {sideBarExtraItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-4" />
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      path === item.url
                        ? "text-primary-500 flex border border-border bg-white shadow-sm hover:bg-slate-50"
                        : "text-slate-600",
                    )}
                    onClick={() => {
                      void router.push(item.url);
                    }}
                    disabled={item.disabled}
                  >
                    <item.icon />
                    <span>{item.title}</span>
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
            <Button className="w-full gap-2" variant={"outline"}>
              <LogOut size={15} className="text-slate-600" />
              <span>Logout</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
