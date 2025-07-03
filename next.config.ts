/** @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const { withContentlayer } = require('next-contentlayer2')

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, swcMinify: true
};

export default withContentlayer(nextConfig);
