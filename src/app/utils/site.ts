import { type Metadata } from "next";
import { env } from "~/env";
import { type GetVendorType } from "~/server/api/routers/business";

const links = {
  github: "https://github.com/ujen5173/Ridezio",
  twitter: "https://twitter.com/ujen_basi",
  linkedin: "https://www.linkedin.com/in/ujen-basi-167a4522a/",
  facebook: "https://www.facebook.com/ridezio",
  instagram: "https://www.instagram.com/ridezio",
  authorsWebsite: "https://ujenbasi.vercel.app",
  authorsGitHub: "https://github.com/ujen5173",
  openGraphImage: new URL("/api/og", env.NEXT_PUBLIC_APP_URL).toString(),
};

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  return `http://localhost:3000`;
}

export const siteConfig = {
  name: "Ridezio",
  namelower: "ridezio",
  title:
    "Rent Cycles, Bikes, Scooters & Cars Near You | Ridezio Vehicle Rentals",
  description:
    "Book affordable cycles, bikes, scooters, and cars for rent near you. Ridezio offers instant booking, flexible rental options, and the best prices for local vehicle rentals. Find your perfect ride today.",
  tagline:
    "Book cycles, bikes, scooters, and cars for rent near you with Ridezio.",
  links,
  url: getBaseUrl(),
  ogImage: links.openGraphImage,
  author: "ujen5173",
  keywords: [
    "Vehicle rental platform",
    "Rent vehicles online",
    "Bike rentals near me",
    "Car rental app",
    "Cycle rental platform",
    "Electric scooter rentals",
    "Motorbike rentals online",
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ridezio",
    url: getBaseUrl(),
    logo: {
      "@type": "ImageObject",
      url: `${getBaseUrl()}/logo.png`,
      width: "180",
      height: "60",
    },
    sameAs: [links.facebook, links.twitter, links.instagram],
    applicationCategory: "Vehicle Rental Platform",
    operatingSystem: "Any",
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "NPR",
      seller: {
        "@type": "Organization",
        name: "Ridezio",
      },
    },
  },
};

export function generateVendorStructuredData(
  vendor: NonNullable<GetVendorType>,
) {
  return {
    "@type": "VehicleRental",
    name: vendor.name,
    description: `${vendor.name} - ${vendor.location.address}`,
    url: `${getBaseUrl()}/vendor/${vendor.slug}`,
    areaServed: {
      "@type": "City",
      name: vendor.location.city,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "Nepal",
      addressRegion: vendor.location.address,
      addressLocality: vendor.location.city,
      streetAddress: vendor.location.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: vendor.location.lat,
      longitude: vendor.location.lng,
    },
  };
}

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      url: "/site.webmanifest",
    },
  ],
  url = getBaseUrl(),
  noIndex = false,
  structuredData,
  alternates = {},
}: {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
  url?: string;
  structuredData?: Record<string, unknown>;
  alternates?: Metadata["alternates"];
} = {}): Metadata {
  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author, url: links.authorsWebsite }],
    generator: "Next.js",
    keywords: siteConfig.keywords,
    referrer: "origin-when-cross-origin",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      minimumScale: 1,
    },
    alternates: {
      canonical: url,
      ...alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${siteConfig.name} - ${siteConfig.tagline}`,
            type: "image/jpeg",
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@ridezio",
      creator: "@ujen_basi",
      ...(image && { images: [image] }),
    },
    icons,
    verification: {
      google: "ZXUhxd8j6vspU4L4i5Xk0crzK1dLrwwIYch8mOKVAc0",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
        noimageindex: false,
      },
    },
    other: {
      "format-detection": "telephone=no",
      ...(structuredData && {
        "script:ld+json": JSON.stringify(structuredData),
      }),
    },
  };
}
