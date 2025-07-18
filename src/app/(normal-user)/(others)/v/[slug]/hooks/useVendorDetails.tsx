"use client";

import { useContext } from "react";

import { type GetVendorType } from "~/server/api/routers/business";
import { VendorContext } from "../_components/VendorWrapper";

type BusinessType = {
  vendor: GetVendorType;
};

const useVendorDetailsContext = () => {
  const context = useContext(VendorContext) as BusinessType;

  if (!context) {
    throw new Error(
      "useVendorDetailsContext must be used within a BusinessFormContext.Provider",
    );
  }

  return context;
};

export default useVendorDetailsContext;
