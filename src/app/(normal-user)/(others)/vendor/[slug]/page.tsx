import "react-datepicker/dist/react-datepicker.css";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { api } from "~/trpc/server";
import VendorWrapper from "./_components/VendorWrapper";

const VendorPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const data = await api.business.getVendor({
    slug: params.slug,
  });

  return (
    <>
      <HeaderHeight />
      <VendorWrapper data={data} />
    </>
  );
};

export default VendorPage;
