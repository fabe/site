import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import { Main } from "@/components/Layouts";
import { QUERY_POSTS } from "@/graphql/queries";
import formatDate from "@/lib/formatDate";
import type { PostsQueryQuery } from "@/graphql/types/types.generated";
import { baseUrl } from "../__root";

const fetchPosts = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const apolloClient = await initializeApollo();
  const { data } = await apolloClient.query<PostsQueryQuery>({
    query: QUERY_POSTS,
  });
  return { posts: data.posts };
});

export const Route = createFileRoute("/posts/")({
  loader: async () => {
    return await fetchPosts();
  },
  head: () => ({
    meta: [
      { title: "Posts — Fabian Schultz" },
      { name: "description", content: "Writing about design and technology." },
      { property: "og:title", content: "Posts — Fabian Schultz" },
      {
        property: "og:description",
        content: "Writing about design and technology.",
      },
      { property: "og:url", content: `${baseUrl}/posts` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/posts` }],
  }),
  component: PostsComponent,
});

function PostsComponent() {
  const { posts } = Route.useLoaderData();

  return (
    <Main>
      <dl className="list-container items-center gap-2">
        {posts.map((post) => {
          if (!post) return null;
          const { slug, title, publishedDate } = post;
          return (
            <React.Fragment key={slug}>
              <dt className="list-title border-none pt-0">
                <time className="time time-lg" dateTime={publishedDate}>
                  {formatDate(publishedDate, true)}
                </time>
              </dt>
              <dd className="list-content border-none pb-4 pt-0 sm:pb-0">
                <div>
                  <Link to={`/posts/${slug}`} className="link">
                    {title}
                  </Link>
                </div>
              </dd>
            </React.Fragment>
          );
        })}
      </dl>
    </Main>
  );
}
