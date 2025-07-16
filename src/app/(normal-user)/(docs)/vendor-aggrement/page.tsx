import { type Metadata } from "next";
import VendorAggrement from "~/app/mdx/vendor-aggrement.mdx";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Vendor Aggrement`,
    description: `Learn about the terms and conditions for becoming a vendor on Ridezio. Join our platform and start renting out your bikes today!`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor-aggrement`,
  });
}

export default function Page() {
  return (
    <>
      <VendorAggrement />
    </>
  );
}
