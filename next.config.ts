import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The old projects page is now the full Portfolio page.
    return [{ source: "/projects", destination: "/portfolio", permanent: true }];
  },
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
