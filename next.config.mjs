import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui'],
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize builds
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.next/cache'),
        store: 'pack',
        buildDependencies: {
          config: [import.meta.url],
        },
      };
    }
    return config;
  },
};

export default nextConfig;