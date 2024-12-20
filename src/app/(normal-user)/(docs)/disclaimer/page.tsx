import { type Metadata } from "next";
import Disclaimer from "~/app/mdx/disclaimer.mdx";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Disclaimer | Velocit`,
    description: `Learn about Velocit's disclaimer. Read about our policies, rules, and guidelines for using our platform.`,
    url: `${env.NEXT_PUBLIC_APP_URL}/cookie-policy`,
  });
}

export default function Page() {
  return (
    <>
      <Disclaimer />
    </>
  );
}
