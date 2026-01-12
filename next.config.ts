const nextConfig = {
  // No image optimization needed - using pre-optimized AVIF/WebP from R2
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
