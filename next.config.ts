import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wefit-react-web-test.s3.amazonaws.com",
      },
    ],
    imageSizes: [64, 91, 147],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};

export default nextConfig;
