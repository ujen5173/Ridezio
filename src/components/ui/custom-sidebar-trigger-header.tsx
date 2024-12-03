"use client";

import { format } from "date-fns";
import { Bell, PanelLeft } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useSidebar } from "./sidebar";

const CustomSidebarTriggerHeader = () => {
  const { data } = useSession();
  const { state, toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        {state === "collapsed" ? (
          <Button
            variant={"outline"}
            size="icon"
            title="Open Sidebar"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <PanelLeft size={18} className="text-slate-600" />
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="flex md:hidden"
            size="icon"
            title="Open Sidebar"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <PanelLeft size={18} className="text-slate-600" />
          </Button>
        )}
        <div>
          <h2 className="text-xl font-semibold">
            Good Morning, {data?.user?.name}
          </h2>
          <p className="text-base text-slate-600">
            {format(new Date(), "EEEE, MMM d yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} size="icon">
          <Bell size={20} className="text-slate-600" />
        </Button>
        {data?.user.image && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src={data.user.image}
                alt={`Avatar of ${data.user.image}`}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
              <Link href="/vendor/profile">
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  void signOut();
                  window.location.href = "/";
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default CustomSidebarTriggerHeader;
