import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `jsonwebtoken` and `ably` ship native/optional deps that should not be
  // bundled by the server compiler — keep them external on the server.
  serverExternalPackages: ['jsonwebtoken', 'ably'],
};

export default nextConfig;
