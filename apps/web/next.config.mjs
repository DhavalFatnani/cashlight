/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cashlight/db"],
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon.svg",
        permanent: false,
      },
      {
        source: "/opengraph-image",
        destination: "/api/og",
        permanent: false,
      },
      {
        source: "/opengraph-image.png",
        destination: "/api/og",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
