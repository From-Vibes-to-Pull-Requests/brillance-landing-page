/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    "@modelcontextprotocol/sdk",
    "eventsource-parser",
  ],
}

export default nextConfig
