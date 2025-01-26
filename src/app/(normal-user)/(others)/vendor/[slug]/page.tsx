import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import "react-datepicker/dist/react-datepicker.css";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
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

  if (!vendor) return notFound();

  return constructMetadata({
    title: `${vendor.name} - Vehicle Rentals in ${vendor.location.city}`,
    description: `Rent vehicles from ${vendor.name} in ${vendor.location.city}. ${vendor.availableVehicleTypes.join(
      ", ",
    )} available. Best rates, instant booking.`,
    image: vendor.images?.[0]?.url ?? null,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_APP_URL}/vendor/${params.slug}`,
    },
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

  const data = await getVendorDetails(slug);

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
