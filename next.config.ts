import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // 静态导出时需要禁用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 允许所有外部图片
      },
    ],
  },
};

export default nextConfig;
