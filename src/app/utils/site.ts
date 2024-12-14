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
  openGraphImage: env.NEXT_PUBLIC_APP_URL + "/api/og",
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
  title:
    "Rent Cycles, Bikes, Scooters & Cars | Affordable Vehicle Rentals Near You - Velocit",
  description:
    "Discover flexible and affordable vehicle rentals with Velocit. Rent cycles, bikes, scooters, and cars for your commute, road trips, or weekend getaways. Find the perfect ride near you and book instantly with ease. Simplify your travel with Velocit today.",
  tagline: "Flexible, affordable vehicle rentals for every journey",
  links,
  url: getBaseUrl(),
  ogImage: links.openGraphImage,
  author: "ujen5173",
  keywords: [
    "Velocit rentals",
    "affordable vehicle rentals",
    "cycle rental",
    "bike rental",
    "scooter rental",
    "car rental",
    "rental near me",
    "bike rental near me",
    "urban mobility",
    "eco-friendly transportation",
    "short-term vehicle hire",
    "city exploration",
    "weekend getaway vehicles",
    "convenient transportation options",
    "flexible rental durations",
    "instant booking",
    "transportation solutions",
  ],
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = `${getBaseUrl()}/favicon.ico`,
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
  publishedTime,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
  url?: string;
  publishedTime?: string;
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
      publishedTime,
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
      google: "73j5rUHvDmusjX0zQ5nDZI5JuVsW2aC7Njmwi4-t2rE",
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
