import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import Footer from "../_components/_/Footer";

const NormalUserLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerAuthSession();

  if (session?.user.role === "VENDOR" && !session?.user.vendor_setup_complete)
    redirect("/vendor/profile");

  return (
    <main>
      {children}
      <Footer />
    </main>
  );
};

export default NormalUserLayout;
