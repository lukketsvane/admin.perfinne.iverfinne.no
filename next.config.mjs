/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: {
      serverActions: true,
    },
    // Disable static optimization for routes that use cookies
    unstable_runtimeJS: true,
    // Enable dynamic rendering for all pages
    unstable_allowDynamic: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
    ],
  };
  
  export default nextConfig;