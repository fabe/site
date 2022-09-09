/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "images.ctfassets.net",
      "i.scdn.co",
      "oku.ams3.cdn.digitaloceanspaces.com",
    ],
  },
  webpack: (config, { webpack }) => {
    /* Hide error "Critical dependency: the request of a dependency is an expression" from remark-textr */
    config.plugins.push(new webpack.ContextReplacementPlugin(/remark-textr/));

    return config;
  },
};

module.exports = nextConfig;
