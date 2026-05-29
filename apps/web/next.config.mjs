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
    ];
  },
};

export default nextConfig;
