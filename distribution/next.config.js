/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true
  },
  images: {
    domains: [],
  }
}

module.exports = nextConfig 