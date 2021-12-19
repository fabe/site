import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Playlist } from '../../types';
import { gql } from 'apollo-server-micro';

const { CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY } = process.env;
const BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: BASE_URL,
    credentials: 'same-origin',
    headers: {
      Authorization: `Bearer ${CONTENTFUL_DELIVERY}`,
    },
  }),
  cache: new InMemoryCache(),
});

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await client.query({
    query: gql`
      query getAllplaylists {
        playlistCollection(limit: 10) {
          items {
            title
            cover {
              url
            }
            spotifyUrl
          }
        }
      }
    `,
  });

  if (!response.data) {
    return [];
  }

  return response.data.playlistCollection.items.map(
    (playlist: {
      title: string;
      cover: { url: string };
      spotifyUrl: string;
    }) => ({
      title: playlist.title,
      coverUrl: playlist.cover.url,
      spotifyUrl: playlist.spotifyUrl,
    })
  );
}
