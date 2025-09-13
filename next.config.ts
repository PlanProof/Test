import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build optimizations for development speed
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // External packages
  serverExternalPackages: ["openai", "pg"],

  // Basic production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: false, // Disable for development performance

  // Cross-origin configuration
  allowedDevOrigins: [
    "def8124455924293b3fb4ebe7fb42e85-0a43f67fda14467c8c81986aa.fly.dev",
    "*.fly.dev",
    "*.vercel.app",
    "localhost",
    "127.0.0.1",
  ],

  // Webpack optimizations - minimal for performance
  webpack: (config, { isServer }) => {
    // Only essential fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        pg: false,
        "pg-native": false,
      };
    }

    // Disable cache in development for now
    if (process.env.NODE_ENV === "development") {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
