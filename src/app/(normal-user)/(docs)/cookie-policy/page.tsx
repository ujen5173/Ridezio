import { type Metadata } from "next";
import CookiePolicy from "~/app/mdx/cookie-policy.mdx";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Cookie Policy | Velocit`,
    description: `Learn about our cookie policy`,
    url: `${env.NEXT_PUBLIC_APP_URL}/cookie-policy`,
  });
}

export default function Page() {
  return (
    <>
      <CookiePolicy />
    </>
  );
}
