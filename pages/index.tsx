import Intro from "../components/Home/Intro";
import Resume from "../components/Home/Resume";
import Writing from "../components/Home/Writing";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import { initializeApollo } from "../graphql/client";
import type { GetStaticProps } from "next";
import { QUERY_PAGE_HOME, QUERY_MUSIC_STATUS } from "../graphql/queries";
import {
  PageHomeQueryQuery,
  MusicStatusQueryQuery,
} from "../graphql/types/types.generated";
import { useQuery } from "@apollo/client";
import NowReading from "../components/Home/NowReading";
import { useEffect } from "react";
import NowPlaying from "../components/Home/NowPlaying";
import { serialize } from "next-mdx-remote/serialize";
import Posts from "../components/Home/Posts";
import Projects from "../components/Home/Projects";

export default function Home({ intro }) {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME);

  const {
    data: liveData,
    startPolling,
    stopPolling,
    refetch,
    loading,
  } = useQuery<MusicStatusQueryQuery>(QUERY_MUSIC_STATUS, {
    ssr: false,
    fetchPolicy: "network-only",
  });

  // Refetch every 15 seconds for live data to be fresh.
  useEffect(() => {
    refetch();
    startPolling(15 * 1000);

    return () => stopPolling();
  }, []);

  return (
    <>
      <SEO
        seo={{
          title: data.siteSettings.siteTitle,
          description: data.siteSettings.metaDescription,
          path: "/",
        }}
      />
      <Main>
        <Intro content={intro} />
        <Resume />
        <Posts posts={data.posts} />
        <Projects />
        <Writing />
        <NowPlaying spotifyStatus={liveData?.musicStatus} loading={loading} />
        <NowReading books={data.books} />
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

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
