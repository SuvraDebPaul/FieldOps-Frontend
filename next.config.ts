import type { NextConfig } from "next";

// Server-only. The Next server forwards /api/v1/* here.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // Avatars uploaded through the backend's Cloudinary integration
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Avatars of users who signed in with Google
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
