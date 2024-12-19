import { type ReactNode } from "react";
import Header from "~/app/_components/_/Header";
import HeaderHeight from "~/app/_components/_/HeaderHeight";

export default function DocumentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header pth="/docs" />
      <HeaderHeight />
      <main className="w-full">
        <div className="mx-auto max-w-[1440px] px-4 py-8">{children}</div>
      </main>
    </>
  );
}
