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
    "Velocit",
    "Velocit vehicle rentals",
    "velocit",
    "velocity",
    "Velocit rentals",
    "Bike rental in nepal",
    "Bike rental in kathmandu",
    "Bike rental in lalitpur",
    "Bike rental in pokhara",
    "Velocit rental",
    "affordable vehicle rentals",
    "cycle rental",
    "bike rental",
    "scooter rental",
    "car rental",
    "rental near me",
    "Best vehicle rentals near me",
    "Affordable car rentals near me",
    "Rent a bike near me",
    "Cycle rentals for the day",
    "Scooter rental services nearby",
    "Cheap car rentals in my city",
    "Vehicle rental in Nepal",
    "Rent a bike in Kathmandu",
    "Car hire in Pokhara",
    "Cycle rental in Chitwan",
    "Affordable scooter rental Nepal",
    "Short-term vehicle rentals",
    "Weekend car rental deals",
    "Flexible bike rental options",
    "Daily car rental services",
    "Monthly bike rentals Nepal",
    "Tourist car rentals in Nepal",
    "Easy vehicle booking online",
    "Budget-friendly transportation Nepal",
    "Explore cities with rental vehicles",
    "Instant vehicle hire services",
    "Cars for weekend trips near me",
    "Rent bikes for hikes in Nepal",
    "Urban transport rental solutions",
    "Reliable transportation options Nepal",
    "bike rental near me",
    "short-term vehicle hire",
    "vehicle rental nepal",
    "bike rental kathmandu",
    "car rental pokhara",
    "cycle rental chitwan",
    "scooter rental nepal",
    "affordable vehicle rental nepal",
    "bike rent near me nepal",
    "daily car rental nepal",
    "monthly bike rental nepal",
    "tourist vehicle rental nepal",
  ],
  localBusiness: {
    "@type": "VehicleRental",
    name: "Velocit",
    description: "Nepal's premier vehicle rental marketplace",
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
    priceRange: "₨₨-₨₨₨₨",
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
