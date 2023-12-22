/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["images.ctfassets.net", "i.scdn.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "assets.literal.club",
      },
      {
        protocol: "https",
        hostname: "**.spotifycdn.com",
      },
    ],
  },
  webpack: (config, { webpack }) => {
    /* Hide error "Critical dependency: the request of a dependency is an expression" from remark-textr */
    config.plugins.push(new webpack.ContextReplacementPlugin(/remark-textr/));

    return config;
  },
  async redirects() {
    return [
      {
        source: "/projects-legacy/:path*",
        destination: "https://fabe.github.io/projects/:path*",
        permanent: false,
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
