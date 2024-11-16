/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/auth-helpers-react', '@supabase/supabase-js'],
  images: {
    domains: ['https://enzboavfqngaenlzljka.supabase.co/'],
  },
}

module.exports = nextConfig