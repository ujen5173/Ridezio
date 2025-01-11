import { type Metadata } from "next";
import { env } from "~/env";

const links = {
  github: "https://github.com/ujen5173/velocit",
  twitter: "https://twitter.com/ujen_basi",
  linkedin: "https://www.linkedin.com/in/ujen-basi-167a4522a/",
  facebook: "https://www.facebook.com/velocit",
  instagram: "https://www.instagram.com/velocit",
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
  name: "Velocit",
  namelower: "velocit",
  title: "Rent Cycles, Bikes, Scooters & Cars | Velocit Vehicle Rentals",
  description:
    "Affordable and flexible rentals for cycles, bikes, scooters, and cars. Find rides near you and book instantly with Velocit",
  tagline: "Flexible, affordable vehicle rentals for every journey",
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
    "@type": "Organization",
    name: "Velocit",
    url: getBaseUrl(),
    logo: `${getBaseUrl()}/logo.png`,
    sameAs: [
      links.facebook,
      links.twitter,
      links.instagram,
    ],
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
  },
  localBusiness: {
    "@type": "VehicleRental",
    name: "Velocit",
    description: "Nepal's premier vehicle rental marketplace",
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
    priceRange: "₨₨-₨₨₨₨",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Nepal",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "27.7172",
      longitude: "85.324"
    }
  },
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
  ],
  url = getBaseUrl(),
}: {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
  url?: string;
} = {}): Metadata {
  return {
    title,
    description,
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
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@velocit",
      creator: "@ujen_basi",
      ...(image && { images: [image] }),
    },
    icons,
    metadataBase: new URL(getBaseUrl()),
    verification: {
      google: "ZXUhxd8j6vspU4L4i5Xk0crzK1dLrwwIYch8mOKVAc0",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    keywords: siteConfig.keywords.join(", "),
  };
}
