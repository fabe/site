import type { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { Main } from "../../components/Layouts";
import { SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_POSTS } from "../../graphql/queries";
import formatDate from "../../lib/formatDate";

export default function Posts({ posts }) {
  return (
    <>
      <SEO
        seo={{
          title: "Posts",
        }}
      />
      <Main>
        <dl className="list-container items-center">
          {posts.map(({ slug, title, publishedDate }) => (
            <React.Fragment key={slug}>
              <dt className="list-title">
                <time className="time time-lg" dateTime={publishedDate}>
                  {formatDate(publishedDate, true)}
                </time>
              </dt>
              <dd className="list-content pb-4 sm:pb-0">
                <div>
                  <Link href={`/posts/${slug}`} className="link">
                    {title}
                  </Link>
                </div>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_POSTS,
  });

  const data = apolloClient.readQuery({
    query: QUERY_POSTS,
  });

  return {
    props: {
      posts: data.posts,
    },
  };
};
