"use client";

import VendorCard from "~/app/_components/_/VendorCard";
import { type GetPopularShops } from "~/server/api/routers/business";
import { api } from "~/trpc/react";

const VendorCardWithPrefetch = ({
  shop,
}: {
  shop: GetPopularShops[number];
}) => {
  api.business.getVendor.usePrefetchQuery({
    slug: shop.slug!,
  });

  return <VendorCard shop={shop} />;
};

export default VendorCardWithPrefetch;
