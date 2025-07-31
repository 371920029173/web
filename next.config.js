/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'your-supabase-project.supabase.co'],
  },
}

module.exports = nextConfig 