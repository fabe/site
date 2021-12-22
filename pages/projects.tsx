import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { useQuery } from '@apollo/client';

import Head from '../components/Head';
import { initializeApollo } from '../graphql/client';
import { QUERY_PAGE_PROJECTS } from '../graphql/queries';
import { PageHomeQueryQuery } from '../graphql/types/types.generated';

const Projects: NextPage = (props) => {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_PROJECTS, {});

  return (
    <>
      <Head siteSettings={data?.siteSettings!} subpages={['Projects']} />
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
    query: QUERY_PAGE_PROJECTS,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default Projects;
