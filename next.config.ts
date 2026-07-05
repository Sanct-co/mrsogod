import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  transpilePackages: ["firebase-admin", "jwks-rsa"],
};

export default nextConfig;
