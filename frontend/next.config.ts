import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for self-hosted / Docker deployment
  // Vercel handles this automatically — keep for Docker compatibility
  output: "standalone",

  // Allow images from any external domain
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Expose backend URL to client components
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

export default nextConfig;
