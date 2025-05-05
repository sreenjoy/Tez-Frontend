/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  transpilePackages: ['react-chartjs-2', 'chart.js'],
  experimental: {
    optimizeCss: true
  },
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig 