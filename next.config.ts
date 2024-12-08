import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    // hides nextjs-toast that shows static/dynamic route message
    appIsrStatus: false
  }
};

export default nextConfig;
