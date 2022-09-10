import Intro from "../components/Home/Intro";
import Resume from "../components/Home/Resume";
import Writing from "../components/Home/Writing";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import { initializeApollo } from "../graphql/client";
import type { GetServerSideProps, NextPage } from "next";
import { QUERY_PAGE_HOME } from "../graphql/queries";
import { PageHomeQueryQuery } from "../graphql/types/types.generated";
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import NowReading from "../components/Home/NowReading";
import Footer from "../components/Footer";
import { useEffect } from "react";

const NowPlaying = dynamic(() => import("../components/Home/NowPlaying"));

export default function Home() {
  const { data, startPolling, stopPolling } =
    useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME);

  // Refetch every minute for live data to be fresh.
  useEffect(() => {
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
        <Intro />
        <Resume />
        <Writing />
        {data?.spotifyStatus && (
          <NowPlaying spotifyStatus={data.spotifyStatus} />
        )}
        {data?.books && <NowReading book={data.books[0]} />}
        <Footer />
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

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
