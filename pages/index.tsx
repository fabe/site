import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import { useQuery } from '@apollo/client';

import Head from '../components/Head';
import Markdown from '../components/Markdown';
import { initializeApollo } from '../graphql/client';
import { QUERY_PAGE_HOME } from '../graphql/queries';
import { PageHomeQueryQuery } from '../graphql/types/types.generated';

const WidgetSong = dynamic(() => import('../components/Widgets/WidgetSong'));

const Home: NextPage<{ introMdx: string }> = (props) => {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME, {
    pollInterval: 0.5 * 1000 * 60,
  });

  return (
    <>
      <Head siteSettings={data?.siteSettings!} />
      <div className="col-start-1 col-end-13">
        <div className="grid grid-flow-col grid-cols-12 gap-10 pb-8">
          <div className="col-start-1 col-end-13 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
            <Markdown source={data?.siteSettings.intro || ''} />
          </div>
        </div>
      </div>

      <div className="col-start-1 col-end-13 pt-4 pb-4 text-sm font-medium text-gray-700 border-t border-gray-200 xl:col-start-1 xl:col-end-4 lg:col-end-3 dark:text-gray-100 dark:border-gray-700">
        Right now
      </div>
      <div className="col-start-1 col-end-13 xl:col-span-6 xl:col-end-10 lg:col-span-8 lg:col-start-3">
        {data?.spotifyNowPlaying && (
          <WidgetSong nowPlaying={data.spotifyNowPlaying} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const apolloClient = initializeApollo();

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=5'
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

export default Home;
