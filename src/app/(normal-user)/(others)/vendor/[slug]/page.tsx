import { redirect } from "next/navigation";
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

  let bookingDetails = null;

  if (data) {
    bookingDetails = await api.business.getBookingsDetails({
      businessId: data.id,
    });
  }

  return (
    <>
      <HeaderHeight />
      <VendorWrapper data={data} bookingsDetails={bookingDetails} />
    </>
  );
};

export default VendorPage;
