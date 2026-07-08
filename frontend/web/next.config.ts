import type { NextConfig } from 'next';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  transpilePackages: ['shared-types', 'shared-backend'],
  turbopack: {
    root: path.join(__dirname, '..', '..')
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
