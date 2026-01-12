import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  compress: true,
  poweredByHeader: false,
  images: {
    // R2 images are pre-optimized, skip Next.js processing
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256],
  },
};

export default nextConfig;
