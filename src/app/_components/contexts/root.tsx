"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React, {
  type ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { bricolage } from "~/app/utils/font";

type RootContextProps = {
  user: Session | null;
  setUser: React.Dispatch<React.SetStateAction<Session | null>>;
};

export const Context = createContext<RootContextProps>({
  user: null,

  setUser: () => {
    return null;
  },
});

export const useUser = () => {
  const ctx = useContext(Context);
  return ctx;
};

const RootContext = ({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) => {
  const [user, setUser] = useState<Session | null>(session);

  return (
    <SessionProvider>
      <ProgressBar
        height="4px"
        color="#db2777"
        options={{ showSpinner: true }}
        shallowRouting
      />
      <Context.Provider
        value={{
          user: user,
          setUser: setUser,
        }}
      >
        <main className={bricolage.className}>{children}</main>
      </Context.Provider>
    </SessionProvider>
  );
};

export default RootContext;
