"use client";

import { useContext } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import {
  BusinessFormContext,
  type CurrentBusinessType,
  type formSchema,
} from "../BusinessProfile";

type BusinessType = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  business: CurrentBusinessType;
};

const useBusinessFormContext = () => {
  const context = useContext(BusinessFormContext) as BusinessType;

  if (!context) {
    throw new Error(
      "useBusinessFormContext must be used within a BusinessFormContext.Provider",
    );
  }

  return context;
};

export default useBusinessFormContext;
