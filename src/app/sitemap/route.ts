import { type NextRequest } from "next/server";
import { db } from "~/server/db";
import { businesses } from "~/server/db/schema";

export async function GET(request: NextRequest) {
  // Fetch latest data
  const vendors = await db.select().from(businesses);
  const accessoriesdata = await db.query.accessories.findMany({
    with: {
      business: {
        columns: {
          slug: true,
        },
      },
    },
  });
  // Generate XML string
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Routes -->
      <url>
        <loc>${process.env.NEXT_PUBLIC_APP_URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Dynamic Vendor Routes -->
      ${vendors
        .map(
          (vendor) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/vendor/${vendor.slug}</loc>
          <lastmod>${new Date(vendor.updatedAt ?? new Date()).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `,
        )
        .join("")}

      <!-- Dynamic Accessory Routes -->
      ${accessoriesdata
        .map(
          (accessory) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/vendor/${accessory.business.slug}/shop/${accessory.slug}</loc>
          <lastmod>${new Date(accessory.updatedAt ?? new Date()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

  // Return XML response
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
