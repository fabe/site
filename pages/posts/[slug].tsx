import type { GetStaticProps, GetStaticPaths } from "next";
import { Main } from "../../components/Layouts";
import { baseUrl, SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_POST } from "../../graphql/queries";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/future/image";
import Badge from "../../components/Badge";
import { format } from "date-fns";
import { LinkShare } from "../../components/Links";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { mdxComponents } from "../../components/Prose";

export default function Post(props) {
  const router = useRouter();
  const slug = router.query.slug;

  const { title, metaDescription, publishedDate } = props.post || {};
  const url = `${baseUrl}/posts/${slug}`;

  if (!props.post.title) {
    return (
      <>
        <SEO
          seo={{
            title: "Not found",
          }}
        />
        <Main>
          <h1>Not found</h1>
        </Main>
      </>
    );
  }

  return (
    <>
      <SEO
        seo={{
          title,
          description: metaDescription,
        }}
      />
      <Main>
        <header className="mb-6 rounded-lg sm:mb-12">
          <h1 className="pb-4 text-2xl tracking-tight text-neutral-900 [font-variation-settings:'wght'_450] dark:text-white sm:text-3xl">
            <Link href={url}>
              <a>{title}</a>
            </Link>
          </h1>
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-row items-center gap-3">
              <Link href="/">
                <a className="hidden flex-row items-center gap-2 [font-variation-settings:'wght'_450] sm:flex">
                  <div>
                    <Image
                      alt={props.siteSettings.siteTitle}
                      title={props.siteSettings.siteTitle}
                      className="rounded-full bg-gray-200 dark:bg-neutral-600"
                      src={props.siteSettings.avatar.url || ""}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="[font-variation-settings:'wght'_450]">
                    {props.siteSettings.siteTitle}
                  </span>
                </a>
              </Link>
              <time dateTime={publishedDate}>
                <Badge>
                  {format(new Date(publishedDate), "MMMM do, yyyy")}
                </Badge>
              </time>
            </div>
            <LinkShare title={title} url={url}>
              Share
            </LinkShare>
          </div>
        </header>

        <div className="-mb-2 rounded-lg p-0 sm:-mb-8 sm:bg-gray-100 sm:p-16 sm:dark:bg-neutral-950/[.2]">
          <div className="prose-custom">
            <MDXRemote {...props.post.body} components={mdxComponents} />
          </div>
        </div>
      </Main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: "avoiding-font-piracy-github-netlify" } },
      { params: { slug: "test-entry" } },
    ],
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_POST,
    variables: {
      slug: params.slug,
    },
  });

  const data = apolloClient.readQuery({
    query: QUERY_POST,
    variables: {
      slug: params.slug,
    },
  });

  const body = await serialize(data.post.body);

  return {
    props: {
      siteSettings: data.siteSettings,
      post: { ...data.post, body },
    },
  };
};
