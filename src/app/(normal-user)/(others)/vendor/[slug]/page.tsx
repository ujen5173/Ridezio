import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import "react-datepicker/dist/react-datepicker.css";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { constructMetadata } from "~/app/utils/site";
import { api } from "~/trpc/server";
import VendorWrapper from "./_components/VendorWrapper";

const getVendorDetails = cache(async (slug: string) => {
  return await api.business.getVendor({
    slug: slug,
  });
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const vendor = await getVendorDetails(params.slug);

  if (!vendor) return constructMetadata();

  return constructMetadata({
    title: `${vendor.name} - Velocit`,
    description: vendor.name + " - " + vendor.location.address,
    image: vendor.images?.[0]?.url,
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
    paymentMethod?: string;
  }>;
}) => {
  const { slug } = await params;
  const { data: paramsData, paymentMethod } = await searchParams;

  if (!slug) redirect("/");

  const data = await getVendorDetails(slug);

  return (
    <>
      <HeaderHeight />
      <VendorWrapper
        bookingProcessData={paramsData}
        paymentMethod={paymentMethod === "online" ? "online" : "cash"}
        slug={slug}
        data={data}
      />
    </>
  );
};

export default VendorPage;
