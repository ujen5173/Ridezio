import { type Metadata } from "next";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { api } from "~/trpc/server";
import VendorSettingsWrapper from "./vendorSettingsWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Vendor Profile`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/settings`,
  });
}

const VendorSettingsPage = async () => {
  const userDetails = api.user.current();
  const businessDetails = api.business.current();
  const [user, business] = await Promise.all([userDetails, businessDetails]);

  return <VendorSettingsWrapper user={user} business={business!} />;
};

export default VendorSettingsPage;
