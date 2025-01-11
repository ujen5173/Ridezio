"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { createContext, useContext, type ReactNode } from "react";
import { bricolage } from "~/app/utils/font";

export const Context = createContext<{
  country: string | null;
  city: string | null;
  geo: {
    lat: number;
    lng: number;
  };
  country_code: string | null;
}>({
  country: null,
  city: null,
  geo: {
    lat: 0,
    lng: 0,
  },
  country_code: null,
});

const RootContext = ({
  session,
  children,
  country,
  city,
  geo,
  country_code,
}: {
  children: ReactNode;
  session: Session | null;
  country: string | null;
  city: string | null;
  geo: {
    lat: number;
    lng: number;
  };
  country_code: string | null;
}) => {
  return (
    <Context.Provider
      value={{
        country,
        city,
        geo,
        country_code,
      }}
    >
      <SessionProvider session={session}>
        <ProgressBar
          height="4px"
          color="#db2777"
          options={{ showSpinner: true }}
          shallowRouting
        />
        <main className={bricolage.className}>{children}</main>
      </SessionProvider>
    </Context.Provider>
  );
};

export default RootContext;

export const useRootContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useRootContext must be used within a RootContext");
  }
  return context;
};
