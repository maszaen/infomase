import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/i/:slug',
        destination: '/invite/:slug',
        permanent: true,
      },
      {
        source: '/u/:slug',
        destination: '/invite/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
