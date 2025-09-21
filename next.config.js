/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vercel.com'],
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
  },
}

module.exports = nextConfig
