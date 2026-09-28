/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@masik/shared-types', '@masik/business-rules'],
};

module.exports = nextConfig;
