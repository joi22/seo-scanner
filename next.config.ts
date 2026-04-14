import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow fetching from all external origins in server components/API routes
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Skip type/lint checks during `next build` so CI is faster during dev
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
