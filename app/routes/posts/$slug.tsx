import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import { Main } from "@/components/Layouts";
import { QUERY_POST } from "@/graphql/queries";
import formatDate from "@/lib/formatDate";
import contentfulLoader from "@/lib/contentfulLoader";
import { unwrapProxiedUrl } from "@/lib/imageProxy";
import { ChevronLeft } from "@/components/Icons";
import { LinkButton, LinkShare } from "@/components/Links";
import type { PostQueryQuery } from "@/graphql/types/types.generated";
import { baseUrl } from "../__root";

const fetchPost = createServerFn()
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }) => {
    const { initializeApollo } = await import("@/graphql/client");
    const { createElement } = await import("react");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { compile, run } = await import("@mdx-js/mdx");
    const jsxRuntime = await import("react/jsx-runtime");
    const remarkTypograf = (await import("@mavrin/remark-typograf")).default;
    const { mdxComponents } = await import("@/components/Prose");

    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query<PostQueryQuery>({
      query: QUERY_POST,
      variables: { slug },
    });

    if (!data.post) {
      throw new Error("Post not found");
    }

    // Compile MDX body to HTML
    const code = await compile(data.post.body, {
      outputFormat: "function-body",
      remarkPlugins: [[remarkTypograf, { locale: ["en-US"] }]],
    });
    const { default: MDXContent } = await run(String(code), {
      ...(jsxRuntime as any),
      baseUrl: import.meta.url,
    });
    const bodyHtml = renderToStaticMarkup(
      createElement(MDXContent, { components: mdxComponents }),
    );

    return {
      post: { ...data.post, bodyHtml },
      siteSettings: data.siteSettings,
    };
  });

function AuthorLink({
  siteSettings,
}: {
  siteSettings: PostQueryQuery["siteSettings"];
}) {
  return (
    <Link to="/posts" className="relative inline-flex items-center group h-5">
      <span className="flex flex-row gap-2 items-center transition-all duration-300 ease-out opacity-100 translate-y-0 blur-none group-hover:opacity-0 group-hover:-translate-y-3 group-hover:blur-[2px] group-hover:scale-90 scale-100">
        <img
          src={siteSettings.avatar?.url || ""}
          alt={siteSettings.siteTitle}
          className="w-5 h-5 rounded-full"
          width={20}
          height={20}
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
}

export const Route = createFileRoute("/posts/$slug")({
  loader: async ({ params }) => {
    return await fetchPost({ data: { slug: params.slug } });
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return {};
    const { title, metaDescription, coverUrl } = loaderData.post;
    const slug = loaderData.post.title
      ? `/posts/${encodeURIComponent(loaderData.post.title)}`
      : "/posts";
    const relativeUrl = `/posts/${encodeURIComponent(title)}`;

    const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}${
      coverUrl
        ? `&bg=${encodeURI(
            new URL(unwrapProxiedUrl(coverUrl)).pathname.split("/").slice(2).join("/"),
          )}`
        : ""
    }`;

    return {
      meta: [
        { title: `${title} — Fabian Schultz` },
        ...(metaDescription
          ? [{ name: "description", content: metaDescription }]
          : []),
        { property: "og:title", content: title },
        ...(metaDescription
          ? [{ property: "og:description", content: metaDescription }]
          : []),
        { property: "og:image", content: ogImage },
        { property: "og:image:alt", content: title },
      ],
    };
  },
  component: PostComponent,
  notFoundComponent: () => (
    <Main slim>
      <h1>Not found</h1>
    </Main>
  ),
});

function PostComponent() {
  const { post, siteSettings } = Route.useLoaderData();

  const {
    title,
    metaDescription,
    publishedDate,
    coverUrl,
    coverAlt,
    bodyHtml,
  } = post;
  const relativeUrl = `/posts/${Route.useParams().slug}`;
  const url = `${baseUrl}${relativeUrl}`;

  return (
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
          <AuthorLink siteSettings={siteSettings} />
        </div>
      </header>

      <div className="rounded-lg p-0">
        {coverUrl ? (
          <img
            height={400}
            width={700}
            alt={coverAlt || `Cover image for post: ${title}`}
            src={contentfulLoader({
              src: coverUrl,
              width: 700,
              custom: ["fit=crop", "f=center"],
            })}
            className="bg-gray-200 dark:bg-zinc-900 dark:opacity-100 rounded-lg sm:rounded-t-lg sm:rounded-b-none object-cover mb-4 sm:mb-14 h-40 sm:h-80 sm:-ml-20 sm:-mt-20 w-full sm:w-[calc(100%+5rem*2)] max-w-none"
            loading="lazy"
          />
        ) : null}
        <div
          className="prose-custom prose-quotefix"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

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
  );
}
