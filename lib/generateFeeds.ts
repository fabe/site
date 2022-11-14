import { Post, SiteSettings } from "../graphql/types/types.generated";
import { Feed as RSSFeed } from "feed";
import { baseUrl } from "../components/SEO";

export default function (posts: Post[], siteSettings: SiteSettings) {
  const date = new Date();
  const updated = new Date(posts[0].publishedDate);
  const author = {
    name: siteSettings.siteTitle,
    email: "desk@fabianschultz.com",
    link: baseUrl,
  };

  const feed = new RSSFeed({
    title: siteSettings.siteTitle,
    description: siteSettings.metaDescription,
    id: baseUrl,
    link: baseUrl,
    language: "en",
    favicon: `${baseUrl}/public/favicon.ico`,
    copyright: `Copyright ${date.getFullYear()}, Fabian Schultz`,
    updated,
    feedLinks: {
      rss2: `${baseUrl}/posts/rss`,
      json: `${baseUrl}/posts/feed`,
      atom: `${baseUrl}/posts/atom`,
    },
    author,
  });

  posts.forEach((post) => {
    const url = `${baseUrl}/posts/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.metaDescription,
      author: [author],
      contributor: [author],
      date: new Date(post.publishedDate),
    });
  });

  const rss = feed.rss2();
  const atom = feed.atom1();
  const json = feed.json1();

  return {
    rss,
    atom,
    json,
  };
}
