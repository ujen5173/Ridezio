import ShopsAround from "~/app/(normal-user)/(landing-page)/_components/ShopsAround";
import { getUserGeoFromIP } from "~/app/utils/ip";
import { api } from "~/trpc/server";

const ShopsAroundWrapper = async () => {
  const { geo } = await getUserGeoFromIP();

  const shopsAroundData = await api.business.getVendorAroundLocation({
    geo,
  });

  return (
    <>
      <ShopsAround shopsAroundData={shopsAroundData} />
    </>
  );
};

export default ShopsAroundWrapper;
