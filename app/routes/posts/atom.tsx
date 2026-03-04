import { createFileRoute } from "@tanstack/react-router";
import { initializeApollo } from "@/graphql/client";
import { QUERY_POSTS_FEED } from "@/graphql/queries";
import generateFeeds from "@/lib/generateFeeds";

export const Route = createFileRoute("/posts/atom")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const apolloClient = await initializeApollo();

          await apolloClient.query({
            query: QUERY_POSTS_FEED,
          });

          const { posts, siteSettings } = apolloClient.readQuery({
            query: QUERY_POSTS_FEED,
          })!;

          const { atom } = generateFeeds(posts, siteSettings);

          return new Response(atom, {
            headers: {
              "Content-Type": "text/xml",
              "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
            },
          });
        } catch (error) {
          console.error("Atom feed generation failed:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
