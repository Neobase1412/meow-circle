/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Required for Docker standalone build
  output: 'standalone',
}

module.exports = nextConfig
