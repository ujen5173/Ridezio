import { LRUCache } from "lru-cache";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import {
  constructMetadata,
  generateVendorStructuredData,
  getBaseUrl,
} from "~/app/utils/site";
import type { GetVendorType } from "~/server/api/routers/business";
import { api } from "~/trpc/server";
import VendorWrapper from "./_components/VendorWrapper";

const vendorCache = new LRUCache<string, NonNullable<GetVendorType>>({
  max: 100, // max 100 vendors in cache
  ttl: 1000 * 60 * 10, // 10 minutes
});

async function getVendorDetailsCached(slug: string) {
  const cached = vendorCache.get(slug);
  if (cached !== undefined) return cached;

  const data = await api.business.getVendor({ slug });
  if (data) {
    vendorCache.set(slug, data);
  }
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorDetailsCached(slug);

  if (!vendor) return notFound();

  return constructMetadata({
    title: `${vendor.name} - ${vendor.location.city} Vehicle Rental | Ridezio`,
    description: `Rent bikes, cars, and scooters from ${vendor.name} in ${vendor.location.city}. Best prices, instant booking, verified reviews.`,
    url: `${getBaseUrl()}/vendor/${vendor.slug}`,
    structuredData: {
      ...generateVendorStructuredData(vendor),
      ...{
        "@context": "https://schema.org",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: getBaseUrl(),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Vendors",
              item: `${getBaseUrl()}/vendors`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: vendor.name,
              item: `${getBaseUrl()}/vendor/${vendor.slug}`,
            },
          ],
        },
      },
    },
    keywords: [
      `${vendor.name} rental`,
      `${vendor.location.city} vehicle rental`,
      "bike rental",
      "car rental",
      "scooter rental",
      "Nepal",
    ],
  });
}

const VendorPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    data?: string;
    pidx?: string;
    transaction_id?: string;
    tidx?: string;
    amount?: string;
    total_amount?: string;
    mobile?: string;
    status?: string;
    purchase_order_id?: string;
    purchase_order_name?: string;
    paymentMethod?: string;
  }>;
}) => {
  const { slug } = await params;
  const {
    data: paramsData,
    paymentMethod,
    ...khaltiParams
    // pidx: khaltiId,
  } = await searchParams;

  if (!slug) redirect("/");

  const data = await getVendorDetailsCached(slug);

  if (!data) notFound();

  return (
    <>
      <HeaderHeight />
      <VendorWrapper
        // bookingProcessData={paramsData ?? khaltiParams.pidx}
        // khaltiDetails={khaltiParams}
        // paymentMethod === "online" ? "online" : "cash"
        // paymentMethod={
        //   paramsData ? "esewa" : khaltiParams.pidx ? "khalti" : "cash"
        // }
        slug={slug}
        data={data}
      />
    </>
  );
};

export default VendorPage;

export const revalidate = 86400; // 24 hours
