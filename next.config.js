/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['react-chartjs-2', 'chart.js'],
  experimental: {
    optimizeCss: true
  },
  images: {
    domains: [],
  }
}

module.exports = nextConfig 