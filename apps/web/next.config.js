/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@masik/shared-types', '@masik/business-rules'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
