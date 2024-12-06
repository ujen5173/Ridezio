import { notFound, redirect } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { api } from "~/trpc/server";
import VendorWrapper from "./_components/VendorWrapper";

const VendorPage = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await params;

  if (!slug) redirect("/");

  const data = await api.business.getVendor({
    slug: slug,
  });

  if (data) {
    await api.business.getBookingsDetails.prefetch({
      businessId: data.id,
    });
  } else {
    notFound();
  }

  return (
    <>
      <HeaderHeight />
      <VendorWrapper data={data} />
    </>
  );
};

export default VendorPage;
