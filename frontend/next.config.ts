import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
