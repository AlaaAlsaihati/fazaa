import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "barllina.com" },
      { protocol: "https", hostname: "savanasa.com" },
      { protocol: "https", hostname: "jolinafashion.com" },
      { protocol: "https", hostname: "asom-dresses.com" },
      { protocol: "https", hostname: "sunfllower.com" },
      { protocol: "https", hostname: "dlona.sa" },
      { protocol: "https", hostname: "afradreses.com" },
      { protocol: "https", hostname: "vanusfashion.com" },
      { protocol: "https", hostname: "asom-dresses.com" },
    ],
  },
};

export default nextConfig;