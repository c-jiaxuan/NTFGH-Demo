/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/test.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
