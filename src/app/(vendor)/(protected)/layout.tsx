import React from "react";

const ProtectedVendorLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ProtectedVendorLayout;
