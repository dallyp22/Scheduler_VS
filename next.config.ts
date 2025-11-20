import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "@ant-design/pro-components",
    "@ant-design/icons",
    "rc-util",
    "rc-pagination",
    "rc-picker",
  ],
  turbopack: {}, // Enable Turbopack with empty config to silence webpack warning
};

export default nextConfig;
