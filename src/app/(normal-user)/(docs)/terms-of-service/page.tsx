import { type Metadata } from "next";
import TermsOfService from "~/app/mdx/terms-of-service.mdx";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Terms of Service | Velocit`,
    description: `Learn about Velocit's terms of service. Read about our policies, rules, and guidelines for using our platform.`,
    url: `${env.NEXT_PUBLIC_APP_URL}/cookie-policy`,
  });
}

export default function Page() {
  return (
    <>
      <TermsOfService />
    </>
  );
}
