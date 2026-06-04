import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@apollo/client";
import Intro from "@/components/Home/Intro";
import Resume from "@/components/Home/Resume";
import Posts from "@/components/Home/Posts";
import Projects from "@/components/Home/Projects";
import GitHubRepos from "@/components/Home/GitHubRepos";
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

const githubReposUrl =
  "https://api.github.com/users/fabe/repos?sort=pushed&per_page=3";

type GithubApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  primaryLanguage: string | null;
  starCount: number;
  pushedAt: string;
};

function isGithubApiRepo(repo: unknown): repo is GithubApiRepo {
  if (!repo || typeof repo !== "object") {
    return false;
  }

  const candidate = repo as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    (typeof candidate.description === "string" ||
      candidate.description === null) &&
    typeof candidate.html_url === "string" &&
    (typeof candidate.language === "string" || candidate.language === null) &&
    typeof candidate.stargazers_count === "number" &&
    typeof candidate.pushed_at === "string" &&
    typeof candidate.fork === "boolean"
  );
}

async function fetchGithubRepos(): Promise<GithubRepo[]> {
  try {
    const response = await fetch(githubReposUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const repos: unknown = await response.json();

    if (!Array.isArray(repos)) {
      return [];
    }

    return repos
      .filter(isGithubApiRepo)
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        primaryLanguage: repo.language,
        starCount: repo.stargazers_count,
        pushedAt: repo.pushed_at,
      }));
  } catch {
    return [];
  }
}

const fetchHomeData = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { compile, run } = await import("@mdx-js/mdx");
  const jsxRuntime = await import("react/jsx-runtime");

  const apolloClient = await initializeApollo();
  const [githubRepos, { data }] = await Promise.all([
    fetchGithubRepos(),
    apolloClient.query<PageHomeQueryQuery>({
      query: QUERY_PAGE_HOME,
    }),
  ]);

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
    githubRepos,
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
      {
        name: "twitter:title",
        content:
          loaderData?.initialData?.siteSettings?.siteTitle || "Fabian Schultz",
      },
      {
        name: "twitter:description",
        content:
          loaderData?.initialData?.siteSettings?.metaDescription ||
          "Product Designer",
      },
    ],
    links: [{ rel: "canonical", href: baseUrl }],
  }),
  component: HomeComponent,
});

function HomeComponent() {
  const { githubRepos, introHtml, initialData } = Route.useLoaderData();

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

  const posts = initialData.posts.filter(
    (post): post is NonNullable<PageHomeQueryQuery["posts"][number]> =>
      Boolean(post),
  );
  const books = initialData.books.filter(
    (book): book is NonNullable<PageHomeQueryQuery["books"][number]> =>
      Boolean(book),
  );

  return (
    <Main>
      <Intro introHtml={introHtml} />
      <Resume />
      <Posts posts={posts} />
      <GitHubRepos repos={githubRepos} />
      <Projects />
      <NowPlaying
        spotifyStatus={liveData?.musicStatus}
        loading={!mounted || loading}
      />
      <NowReading books={books} />
    </Main>
  );
}
