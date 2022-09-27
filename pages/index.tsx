import Intro from "../components/Home/Intro";
import Resume from "../components/Home/Resume";
import Writing from "../components/Home/Writing";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import { initializeApollo } from "../graphql/client";
import type { GetServerSideProps } from "next";
import { QUERY_PAGE_HOME, QUERY_SPOTIFY_STATUS } from "../graphql/queries";
import {
  PageHomeQueryQuery,
  SpotifyStatusQueryQuery,
} from "../graphql/types/types.generated";
import { useQuery } from "@apollo/client";
import NowReading from "../components/Home/NowReading";
import { useEffect } from "react";
import NowPlaying from "../components/Home/NowPlaying";
import { serialize } from "next-mdx-remote/serialize";

const isDev = process.env.NODE_ENV === "development";

export default function Home({ intro }) {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME);

  const {
    data: liveData,
    startPolling,
    stopPolling,
    refetch,
  } = useQuery<SpotifyStatusQueryQuery>(QUERY_SPOTIFY_STATUS, {
    ssr: false,
    fetchPolicy: "cache-and-network",
    skip: isDev,
  });

  // Refetch every minute for live data to be fresh.
  useEffect(() => {
    if (!isDev) {
      refetch();
    }

    startPolling(2 * 60 * 1000);

    return () => stopPolling();
  }, []);

  return (
    <>
      <SEO
        seo={{
          title: data.siteSettings.siteTitle,
          description: data.siteSettings.metaDescription,
        }}
      />
      <Main>
        <Intro content={intro} />
        <Resume />
        <Writing />
        <NowPlaying
          spotifyStatus={liveData?.spotifyStatus || data.spotifyStatus}
          loading={false}
        />
        <NowReading book={data.books[0]} />
      </Main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const apolloClient = initializeApollo();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );

  await apolloClient.query({
    query: QUERY_PAGE_HOME,
  });

  const cache = apolloClient.cache.extract();

  const data = apolloClient.readQuery({ query: QUERY_PAGE_HOME });
  const intro = await serialize(data.siteSettings.intro);

  return {
    props: {
      initialApolloState: { ...cache },
      intro,
    },
  };
};
