import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
}