import type { GetStaticProps, GetStaticPaths } from "next";
import { Main } from "../../components/Layouts";
import { baseUrl, SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_POST, QUERY_POST_SLUGS } from "../../graphql/queries";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { mdxComponents } from "../../components/Prose";
import formatDate from "../../lib/formatDate";
import {
  Post as PostType,
  SiteSettings,
} from "../../graphql/types/types.generated";
import contentfulLoader from "../../lib/contentfulLoader";
import { ArrowLeftIcon, ChevronLeft } from "../../components/Icons";
import { LinkButton, LinkShare } from "../../components/Links";

interface PostProps {
  post: PostType;
  siteSettings: SiteSettings;
}

const AuthorLink = ({ siteSettings }: { siteSettings: SiteSettings }) => {
  return (
    <Link href="/posts" className="relative inline-flex items-center group h-5">
      <span className="flex flex-row gap-2 items-center transition-all duration-300 ease-out opacity-100 translate-y-0 blur-none group-hover:opacity-0 group-hover:-translate-y-3 group-hover:blur-[2px] group-hover:scale-90 scale-100">
        <Image
          src={siteSettings.avatar.url || ""}
          alt={siteSettings.siteTitle}
          className="w-5 h-5 rounded-full"
          width={20}
          height={20}
          priority={false}
        />

        <span className="text-sm text-neutral-500 dark:text-silver-dark [font-variation-settings:'opsz'_14,'wght'_550] dark:group-hover:text-silver-dark transition-colors">
          {siteSettings.siteTitle}
        </span>
      </span>

      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="inline-flex items-center gap-1 transform-gpu text-sm text-neutral-500 dark:text-silver-dark [font-variation-settings:'opsz'_14,'wght'_550] dark:group-hover:text-silver-dark transition-all duration-300 ease-out opacity-0 translate-y-3 blur-[2px] scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:blur-none">
          <ChevronLeft size={12} />
          See all posts
        </span>
      </span>
    </Link>
  );
};

export default function Post(props: PostProps) {
  const router = useRouter();
  const slug = router.query.slug;

  const { title, metaDescription, publishedDate, coverUrl, coverAlt } =
    props.post || {};
  const relativeUrl = `/posts/${slug}`;
  const url = `${baseUrl}${relativeUrl}`;
  const { siteTitle } = props.siteSettings;

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
          path: relativeUrl,
          image: `${baseUrl}/api/og?title=${encodeURIComponent(title)}${
            coverUrl
              ? `&bg=${encodeURI(
                  new URL(coverUrl).pathname.split("/").slice(2).join("/"),
                )}`
              : ""
          }`,
        }}
      />
      <Main slim>
        <header className="relative flex flex-col gap-4 py-6 sm:pt-0 sm:pb-12 text-center text-balance">
          <div className="flex flex-row gap-2 items-center justify-center text-sm [font-variation-settings:'opsz'_14,'wght'_550] dark:text-silver-dark text-neutral-500">
            <time
              dateTime={publishedDate}
              className="text-neutral-500 dark:text-silver-dark capitalize"
            >
              {formatDate(publishedDate)}
            </time>
          </div>

          <h1 className="text-4xl/[1.1] sm:text-5xl/[1.1] text-neutral-800 [font-variation-settings:'opsz'_48,_'wght'_550] dark:text-white tracking-tight">
            {title}
          </h1>

          <div className="pt-1">
            <AuthorLink siteSettings={props.siteSettings} />
          </div>
        </header>

        <div className="rounded-lg p-0">
          {coverUrl ? (
            <Image
              height={400}
              width={700}
              alt={coverAlt || `Cover image for post: ${title}`}
              src={coverUrl}
              loader={(props) =>
                contentfulLoader({
                  ...props,
                  custom: ["fit=crop", "f=center"],
                })
              }
              className="bg-gray-200 dark:bg-zinc-900 dark:opacity-100 rounded-lg sm:rounded-t-lg sm:rounded-b-none object-cover mb-4 sm:mb-14 h-40 sm:h-80 sm:-ml-20 sm:-mt-20 w-full sm:w-[calc(100%+5rem*2)] max-w-none"
            />
          ) : null}
          <div className="prose-custom prose-quotefix">
            <MDXRemote {...props.post.body} components={mdxComponents} />
          </div>

          <div className="mt-10 flex justify-between">
            <LinkButton
              href="/posts"
              className="-ml-2 px-2 py-1.5 text-sm gap-1 items-center flex rounded-lg bg-gray-200 text-neutral-700 transition-colors [font-variation-settings:'opsz'_14,'wght'_400] hover:bg-gray-300 dark:bg-neutral-800 dark:text-silver-dark dark:hover:bg-neutral-700"
            >
              <ChevronLeft size={12} />
              Posts
            </LinkButton>
            <LinkShare url={url} className="-mr-2">
              Copy link
            </LinkShare>
          </div>
        </div>
      </Main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_POST_SLUGS,
  });

  const data = apolloClient.readQuery({
    query: QUERY_POST_SLUGS,
  });

  const posts = data.posts.map((post) => ({ params: { ...post } }));

  return {
    paths: posts,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();
  const remarkTypograf = require("@mavrin/remark-typograf");

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

  const body = await serialize(data.post.body, {
    mdxOptions: {
      remarkPlugins: [[remarkTypograf, { locale: ["en-US"] }]],
    },
  });

  return {
    props: {
      siteSettings: data.siteSettings,
      post: { ...data.post, body },
    },
  };
};
