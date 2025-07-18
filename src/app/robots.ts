import { type MetadataRoute } from "next";
import { env } from "~/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
      disallow: [
        "/dashboard/",
        "/vendor/vehicles/",
        "/settings",
        "/vendor/accessories",
        "/vendor/accessories/add",
        "/vendor/vehicles/add",
        "/vendor/settings",
      ],
    },
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
