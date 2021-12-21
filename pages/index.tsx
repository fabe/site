import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';

import { initializeApollo } from '../graphql/client';
import { QUERY_PAGE_HOME } from '../graphql/queries';
import Head from '../components/Head';
import { PageHomeQueryQuery } from '../graphql/types/types.generated';
import Image from 'next/image';

const Home: NextPage = () => {
  const { data } = useQuery<PageHomeQueryQuery>(QUERY_PAGE_HOME);

  return (
    <>
      <Head siteSettings={data?.siteSettings!} />
      <div className="col-span-6 col-start-4">
        <div className="flex gap-4 flex-row">
          <Image
            alt={
              data?.spotifyNowPlaying.album
                ? data.spotifyNowPlaying.album
                : 'Album cover'
            }
            title={
              data?.spotifyNowPlaying.album
                ? data.spotifyNowPlaying.album
                : undefined
            }
            className="flex-0"
            src={
              data?.spotifyNowPlaying.albumImageUrl
                ? data.spotifyNowPlaying.albumImageUrl
                : ''
            }
            width={48}
            height={48}
          />
          <div>
            <h3 className="font-medium">
              {data?.spotifyNowPlaying.isPlaying
                ? `I'm currently listening to:`
                : `I last listened to:`}
            </h3>
            <h2>
              {data?.spotifyNowPlaying.title} by{' '}
              {data?.spotifyNowPlaying.artist}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
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
