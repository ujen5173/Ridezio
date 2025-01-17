"use server";

import { api } from "~/trpc/server";

export const getVendor = async ({ slug }: { slug: string }) => {
  await api.business.getVendor.prefetch({
    slug,
  });
};
