import ShopsAround from "~/app/(normal-user)/(landing-page)/_components/ShopsAround";
import { api } from "~/trpc/server";

const ShopsAroundWrapper = async () => {
  const shopsAroundData = await api.business.getVendorAroundLocation();

  return (
    <>
      <ShopsAround shopsAroundData={shopsAroundData} />
    </>
  );
};

export default ShopsAroundWrapper;
