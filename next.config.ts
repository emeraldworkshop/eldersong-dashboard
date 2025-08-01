import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // next.config.js
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to succeed even with type errors
    ignoreBuildErrors: true,
  },

   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qwtymamptxpagybitgzs.supabase.co',
      },
    ],
  },
};

export default nextConfig;
