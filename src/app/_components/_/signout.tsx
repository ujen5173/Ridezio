"use client";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

const SignOut = () => {
  return (
    <DropdownMenuItem
      onClick={() => {
        void signOut();
        setTimeout(() => {
          window.location.href = "/";
        }, 50);
      }}
      className={cn("hover:bg-destructive hover:text-destructive-foreground")}
    >
      Log out
    </DropdownMenuItem>
  );
};

export default SignOut;
