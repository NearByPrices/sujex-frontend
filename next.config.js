/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows CI/sandbox builds to use an isolated output folder without changing
  // the normal `.next` behavior for local development and production.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lbxkaglhusuhiflnupvv.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
