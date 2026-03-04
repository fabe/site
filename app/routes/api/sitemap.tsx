import { createFileRoute } from "@tanstack/react-router";
import { baseUrl } from "../__root";
import { QUERY_POST_SLUGS, QUERY_PHOTO_SET_IDS } from "@/graphql/queries";

const staticPaths = [
  "/",
  "/posts",
  "/photos",
  "/patents",
  "/playlists",
  "/colophon",
  "/globe",
];

export const Route = createFileRoute("/api/sitemap" as any)({
  server: {
    handlers: {
      GET: async () => {
        const { initializeApollo } = await import("@/graphql/client");
        const apolloClient = await initializeApollo();

        const [postsResult, photosResult] = await Promise.all([
          apolloClient.query({ query: QUERY_POST_SLUGS }),
          apolloClient.query({ query: QUERY_PHOTO_SET_IDS }),
        ]);

        const postPaths = (postsResult.data.posts ?? []).map(
          (post: { slug: string }) => `/posts/${post.slug}`,
        );

        const photoPaths = (photosResult.data.photoSets ?? []).flatMap(
          (set: { slug: string; photos?: { id: string }[] | null }) => [
            `/photos/${set.slug}`,
            ...(set.photos ?? []).map(
              (photo) => `/photos/${set.slug}/${photo.id}`,
            ),
          ],
        );

        const allPaths = [...staticPaths, ...postPaths, ...photoPaths];

        const urls = allPaths
          .map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`)
          .join("\n");

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
