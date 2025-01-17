import { desc, eq } from "drizzle-orm";
import { type MetadataRoute } from "next";
import { env } from "~/env";
import { db } from "~/server/db";
import { businesses } from "~/server/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  // Fetch active vendors and accessories
  const [vendors, accessoriesData] = await Promise.all([
    db.query.businesses.findMany({
      where: eq(businesses.status, "active"),
      orderBy: desc(businesses.updatedAt),
    }),
    db.query.accessories.findMany(),
  ]);

  const staticRoutes = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/search`, priority: 0.9 },
    { url: `${baseUrl}/terms-of-service`, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, priority: 0.7 },
    { url: `${baseUrl}/vendor-agreement`, priority: 0.7 },
  ].map((route) => ({
    url: route.url,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route.priority,
  }));

  const vendorRoutes = vendors.map((vendor) => ({
    url: `${baseUrl}/vendor/${vendor.slug}`,
    lastModified: vendor.updatedAt ?? new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const accessoryRoutes = accessoriesData.map((accessory) => ({
    url: `${baseUrl}/vendor/${accessory.businessId}/shop/${accessory.slug}`,
    lastModified: accessory.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...vendorRoutes, ...accessoryRoutes];
}
