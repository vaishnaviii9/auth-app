/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This tells Next.js to skip ESLint during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
