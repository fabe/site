import { FC } from "react";
import { initializeApollo } from "../../graphql/client";
import { QUERY_POSTS_FEED } from "../../graphql/queries";
import generateFeeds from "../../lib/generateFeeds";

const RSS: FC = () => null;

export async function getServerSideProps({ req, res }) {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_POSTS_FEED,
  });

  const { posts, siteSettings } = apolloClient.readQuery({
    query: QUERY_POSTS_FEED,
  });

  const { rss } = generateFeeds(posts, siteSettings);

  if (res) {
    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );
    res.write(rss);
    res.end();
  }

  return {
    props: {},
  };
}

export default RSS;
