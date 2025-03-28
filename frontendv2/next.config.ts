import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip linting errors in production
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors in production
  },
};

export default nextConfig;
