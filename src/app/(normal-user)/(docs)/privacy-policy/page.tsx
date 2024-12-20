import { type Metadata } from "next";
import PrivacyPolicy from "~/app/mdx/privacy-policy.mdx";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Privacy Policy | Velocit`,
    description: `Learn about Velocit's privacy policy. Read about how we collect, use, and protect your personal information.`,
    url: `${env.NEXT_PUBLIC_APP_URL}/cookie-policy`,
  });
}

export default function Page() {
  return (
    <>
      <PrivacyPolicy />
    </>
  );
}
