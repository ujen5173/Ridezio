import { type MetadataRoute } from "next";
import { env } from "~/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/dashboard/",
        "/vendor/vehicles/",
        "/settings",
        "/vendor/accessories",
        "/vendor/accessories/add",
        "/vendor/vehicles/add",
        "/vendor/profile",
      ],
      allow: "/",
    },
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
