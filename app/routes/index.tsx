import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@apollo/client";
import Intro from "@/components/Home/Intro";
import Resume from "@/components/Home/Resume";
import Posts from "@/components/Home/Posts";
import Projects from "@/components/Home/Projects";
import Photos from "@/components/Home/Photos";
import { PhotoLightbox } from "@/components/Photos/PhotoLightbox";
import NowPlaying from "@/components/Home/NowPlaying";
import NowReading from "@/components/Home/NowReading";
import { Main } from "@/components/Layouts";
import { QUERY_PAGE_HOME, QUERY_MUSIC_STATUS } from "@/graphql/queries";
import type {
  PageHomeQueryQuery,
  MusicStatusQueryQuery,
} from "@/graphql/types/types.generated";
import { useCallback, useEffect, useState } from "react";
import { baseUrl } from "./__root";

type HomePhoto = NonNullable<
  NonNullable<NonNullable<PageHomeQueryQuery["photoSet"]>["photos"]>[number]
>;

function parsePhotoDate(photo: HomePhoto) {
  const exif = photo.exif as { DateTimeOriginal?: string } | null | undefined;
  const value = exif?.DateTimeOriginal || photo.publishedAt;
  if (!value) return 0;

  return new Date(
    value.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3"),
  ).getTime();
}

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
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
  loader: async () => {
    return await fetchHomeData();
  },
  shouldReload: false,
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
  const { introHtml, initialData } = Route.useLoaderData();
  const { id: selectedPhotoId } = Route.useSearch();

  const [mounted, setMounted] = useState(false);
  const [thumbnailSrcById, setThumbnailSrcById] = useState<
    Record<string, string>
  >({});
  const handleThumbnailLoad = useCallback((photoId: string, src: string) => {
    setThumbnailSrcById((current) =>
      current[photoId] === src ? current : { ...current, [photoId]: src },
    );
  }, []);

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
  const photos = (initialData.photoSet?.photos ?? [])
    .filter((photo): photo is HomePhoto => Boolean(photo))
    .sort((a, b) => parsePhotoDate(b) - parsePhotoDate(a));

  return (
    <>
      <Main>
        <Intro introHtml={introHtml} />
        <Resume />
        <Posts posts={posts} />
        <Projects />
        <Photos photos={photos} onThumbnailLoad={handleThumbnailLoad} />
        <NowPlaying
          spotifyStatus={liveData?.musicStatus}
          loading={!mounted || loading}
        />
        <NowReading books={books} />
      </Main>
      <PhotoLightbox
        photos={photos}
        selectedPhotoId={selectedPhotoId}
        thumbnailSrcById={thumbnailSrcById}
        mode="home"
      />
    </>
  );
}
