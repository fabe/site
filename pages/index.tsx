import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import { useQuery } from '@apollo/client';

import Head from '../components/Head';
import Markdown from '../components/Markdown';
import { initializeApollo } from '../graphql/client';
import { QUERY_PAGE_HOME } from '../graphql/queries';
import { PageHomeQueryQuery } from '../graphql/types/types.generated';
import NowReading from '../components/Widgets/NowReading';
import FeaturedPhotos from '../components/Widgets/FeaturedPhotos';
import WidgetWrapper from '../components/Widgets';

const NowPlaying = dynamic(() => import('../components/Widgets/NowPlaying'));

const Home: NextPage = (props) => {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME, {
    // pollInterval: 0.5 * 1000 * 60,
  });

  return (
    <>
      <Head siteSettings={data?.siteSettings!} />
      <div className="col-start-1 col-end-13">
        <div className="grid grid-flow-col grid-cols-12 pb-4 lg:pb-10 lg:gap-10">
          <div className="col-start-1 col-end-13 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
            <Markdown source={data?.siteSettings.intro || ''} />
          </div>
        </div>
      </div>

      <h2 className="col-start-1 col-end-13 pt-4 pb-4 text-sm font-medium border-t border-gray-200 text-zinc-700 xl:col-start-1 xl:col-end-4 lg:col-end-3 dark:text-zinc-50 dark:border-zinc-700">
        Right now
      </h2>

      <div className="flex col-start-1 col-end-13 xl:col-span-6 xl:col-end-10 lg:col-span-6 lg:col-start-3">
        <NowReading />
      </div>

      <div className="flex col-start-1 col-end-13 xl:col-span-3 xl:col-end-13 lg:col-span-2 lg:col-start-10">
        {data?.spotifyNowPlaying && (
          <NowPlaying nowPlaying={data.spotifyNowPlaying} />
        )}
      </div>

      <div className="flex col-start-1 col-end-13 mt-0 lg:mt-10 xl:col-span-3 xl:col-start-4 lg:col-span-3 lg:col-start-4">
        <WidgetWrapper title="Something else"></WidgetWrapper>
      </div>

      <div className="flex col-start-1 col-end-13 mt-0 lg:mt-10 lg:col-span-8 lg:col-end-13 xl:col-span-6 xl:col-end-13">
        {data?.photos && <FeaturedPhotos photos={data.photos} />}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const apolloClient = initializeApollo();

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=43200, stale-while-revalidate=60'
  );

  await apolloClient.query({
    query: QUERY_PAGE_HOME,
    variables: {
      photosLimit: 5,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default Home;
