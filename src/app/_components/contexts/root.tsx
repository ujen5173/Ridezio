"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type ReactNode } from "react";
import { bricolage } from "~/app/utils/font";

const RootContext = ({
  session,
  children,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  return (
    <SessionProvider session={session}>
      <ProgressBar
        height="4px"
        color="#db2777"
        options={{ showSpinner: true }}
        shallowRouting
      />
      <main className={bricolage.className}>{children}</main>
    </SessionProvider>
  );
};

export default RootContext;
