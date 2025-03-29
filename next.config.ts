import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  builds: {
    config: {
      installCommand: "npm install --legacy-peer-deps",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
