import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";

const ProtectedVendorLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerAuthSession();

  if (!session?.user.vendor_setup_complete) redirect("/vendor/profile");

  return <>{children}</>;
};

export default ProtectedVendorLayout;
