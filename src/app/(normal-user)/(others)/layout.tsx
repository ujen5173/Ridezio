import React from "react";
import Header from "~/app/_components/_/Header";
import { bricolage } from "~/app/utils/font";

const OthersPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={bricolage.className}>
      <Header pth={"/..."} />
      {children}
    </main>
  );
};

export default OthersPageLayout;
