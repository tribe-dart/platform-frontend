import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/scorm-proxy/:ticket/:packageId/:path*",
        destination: `${apiBase}/api/scorm/proxy/:ticket/:packageId/:path*`,
      },
    ];
  },
};

export default nextConfig;
