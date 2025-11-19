/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'major-bets.netlify.app'],
    },
  },
};

module.exports = nextConfig;
