/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://fabianschultz.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/login"],
      },
    ],
  },
};
