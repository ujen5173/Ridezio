import { type MetadataRoute } from "next";
import { env } from "~/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.NEXT_PUBLIC_APP_URL,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/search`,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/auth/signin`,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/terms-of-service`,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/cookie-policy`,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/vendor-aggreement`,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/disclaimer`,
    },
  ];
}
