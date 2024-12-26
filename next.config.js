import createMDX from "@next/mdx";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "embed.widencdn.net",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    config.resolve.alias = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...config.resolve.alias,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
