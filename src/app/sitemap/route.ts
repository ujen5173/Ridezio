import { desc, eq } from "drizzle-orm";
import { env } from "~/env";
import { db } from "~/server/db";
import { businesses } from "~/server/db/schema";

export async function GET() {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  // Fetch all active vendors and accessories
  const vendors = await db.query.businesses.findMany({
    where: eq(businesses.status, "active"),
    orderBy: desc(businesses.updatedAt),
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <!-- Core Routes -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Vendor Routes -->
      ${vendors
        .map(
          (vendor) => `
        <url>
          <loc>${baseUrl}/vendor/${vendor.slug}</loc>
          <lastmod>${new Date(vendor.updatedAt ?? new Date()).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600",
    },
  });
}
