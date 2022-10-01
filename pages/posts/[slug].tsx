import { useQuery } from "@apollo/client";
import type { GetServerSideProps } from "next";
import { Main } from "../../components/Layouts";
import { baseUrl, SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_POST } from "../../graphql/queries";
import { PostQueryQuery } from "../../graphql/types/types.generated";
import { useRouter } from "next/router";
import Markdoc from "@markdoc/markdoc";
import React, { Children, useMemo } from "react";
import Image from "next/future/image";
import Badge from "../../components/Badge";
import { format } from "date-fns";
import { LinkShare } from "../../components/Links";
import Link from "next/link";
import { Tag, nodes } from "@markdoc/markdoc";

import { getSchema } from "@markdoc/next.js/runtime";

const CustomDocumentComponent = ({ children }) => (
  <div className="prose-a:link prose prose-neutral col-span-10 col-start-2 max-w-xl prose-headings:font-normal prose-headings:[font-variation-settings:'wght'_550] prose-strong:font-normal prose-strong:[font-variation-settings:'wght'_550] prose-em:not-italic prose-em:underline prose-em:decoration-neutral-800 prose-em:decoration-wavy prose-code:rounded-md prose-code:bg-neutral-950 prose-code:p-1 prose-code:font-normal prose-pre:-ml-4 prose-pre:-mr-4 prose-pre:bg-neutral-950 prose-pre:text-sm prose-img:rounded-lg prose-hr:border-neutral-900 dark:prose-invert">
    {children}
  </div>
);

const customDocument = {
  ...nodes.document,
  render: CustomDocumentComponent,
  transform(node, config) {
    return new Tag(
      "CustomDocument",
      { source: config.source },
      node.transformChildren(config)
    );
  },
};

const markdocSchema = {
  nodes: {
    document: customDocument,
  },
};

export default function Post(props) {
  const router = useRouter();
  const slug = router.query.slug;

  const { data, error } = useQuery<PostQueryQuery>(QUERY_POST, {
    variables: {
      slug,
    },
  });

  const { title, metaDescription, publishedDate } = data.post || {};
  const url = `${baseUrl}/posts/${slug}`;

  const content = useMemo(() => {
    if (!data.post?.body) return null;

    const schema = getSchema(markdocSchema);

    const ast = Markdoc.parse(data.post.body);
    return Markdoc.transform(ast, {
      ...schema,
    });
  }, [data]);

  if (!data.post?.body) {
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

  console.log();

  return (
    <>
      <SEO
        seo={{
          title,
          description: metaDescription,
        }}
      />
      <Main>
        <header>
          <h1 className="text-3xl tracking-tight text-neutral-900 [font-variation-settings:'wght'_450] dark:text-white">
            {title}
          </h1>
          <div className="border:neutral-200 mt-10 mb-14 flex w-full flex-row justify-between border-b border-solid pb-4 dark:border-neutral-900 sm:mt-4">
            <div className="flex flex-row items-center gap-3">
              <Link href="/">
                <a className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]">
                  <div className="drop-shadow-md">
                    <Image
                      alt={data.siteSettings.siteTitle}
                      title={data.siteSettings.siteTitle}
                      className="rounded-full bg-gray-200 dark:bg-zinc-600"
                      src={data.siteSettings.avatar.url || ""}
                      width={32}
                      height={32}
                    />
                  </div>
                  {data.siteSettings.siteTitle}
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

        <div className="-mb-6 flex justify-center">
          {Markdoc.renderers.react(content, React, {
            components: {
              CustomDocument: CustomDocumentComponent,
            },
          })}
        </div>
      </Main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const apolloClient = initializeApollo();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );

  await apolloClient.query({
    query: QUERY_POST,
    variables: {
      slug: params.slug,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
