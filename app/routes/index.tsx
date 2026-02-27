import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@apollo/client";
import Intro from "@/components/Home/Intro";
import Resume from "@/components/Home/Resume";
import Posts from "@/components/Home/Posts";
import Projects from "@/components/Home/Projects";
import NowPlaying from "@/components/Home/NowPlaying";
import NowReading from "@/components/Home/NowReading";
import { Main } from "@/components/Layouts";
import { QUERY_PAGE_HOME, QUERY_MUSIC_STATUS } from "@/graphql/queries";
import type {
  PageHomeQueryQuery,
  MusicStatusQueryQuery,
} from "@/graphql/types/types.generated";
import { useEffect, useState } from "react";
import { baseUrl } from "./__root";

const fetchHomeData = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { compile, run } = await import("@mdx-js/mdx");
  const jsxRuntime = await import("react/jsx-runtime");

  const apolloClient = await initializeApollo();
  const { data } = await apolloClient.query<PageHomeQueryQuery>({
    query: QUERY_PAGE_HOME,
  });

  // Compile MDX intro to HTML
  const code = await compile(data.siteSettings.intro, {
    outputFormat: "function-body",
  });
  const { default: MDXContent } = await run(String(code), {
    ...(jsxRuntime as any),
    baseUrl: import.meta.url,
  });
  let introHtml = renderToStaticMarkup(createElement(MDXContent));
  introHtml = introHtml.replace(
    /<a href="/g,
    '<a class="link" target="_blank" rel="noopener noreferrer" href="',
  );

  return {
    introHtml,
    initialData: data,
  };
});

export const Route = createFileRoute("/")({
  loader: async () => {
    return await fetchHomeData();
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title:
          loaderData?.initialData?.siteSettings?.siteTitle || "Fabian Schultz",
      },
      {
        name: "description",
        content:
          loaderData?.initialData?.siteSettings?.metaDescription ||
          "Product Designer",
      },
      {
        property: "og:title",
        content:
          loaderData?.initialData?.siteSettings?.siteTitle || "Fabian Schultz",
      },
      {
        property: "og:description",
        content:
          loaderData?.initialData?.siteSettings?.metaDescription ||
          "Product Designer",
      },
      { property: "og:url", content: baseUrl },
    ],
    links: [{ rel: "canonical", href: baseUrl }],
  }),
  component: HomeComponent,
});

function HomeComponent() {
  const { introHtml, initialData } = Route.useLoaderData();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: liveData, loading } = useQuery<MusicStatusQueryQuery>(
    QUERY_MUSIC_STATUS,
    {
      skip: !mounted,
      fetchPolicy: "network-only",
      pollInterval: 15_000,
    },
  );

  return (
    <Main>
      <Intro introHtml={introHtml} />
      <Resume />
      <Posts posts={initialData.posts} />
      <Projects />
      <NowPlaying
        spotifyStatus={liveData?.musicStatus as any}
        loading={!mounted || loading}
      />
      <NowReading books={(initialData.books ?? []).filter(Boolean) as any} />
    </Main>
  );
}
