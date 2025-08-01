/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dfpyhzwlnstwtgwsypgb.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig 