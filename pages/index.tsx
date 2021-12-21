import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { initializeApollo } from '../graphql/client';
import { QUERY_PAGE_HOME } from '../graphql/queries';

const Home: NextPage = () => {
  const { data } = useQuery(QUERY_PAGE_HOME);

  return <div>Hello World</div>;
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_PAGE_HOME,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Home;
