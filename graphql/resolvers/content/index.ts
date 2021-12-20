import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Playlist } from '../../types/types.generated';
import { gql } from 'apollo-server-micro';
import { Book, QueryFavouriteBooksArgs } from '../../types/types.generated';

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
      query getAllPlaylists {
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

export async function getFavouriteBooks(
  _: any,
  args: QueryFavouriteBooksArgs
): Promise<Book[]> {
  const response = await client.query({
    query: gql`
      query getAllFavouriteBooks {
        bookCollection(limit: 10) {
          items {
            title
            authors
            cover {
              url
            }
            okuUrl
          }
        }
      }
    `,
  });

  if (!response.data) {
    return [];
  }

  return response.data.bookCollection.items
    .map(
      (book: {
        title: string;
        cover?: { url: string };
        authors?: string[];
        okuUrl?: string;
        description?: string;
      }) => ({
        author: book.authors?.join(', '),
        title: book.title,
        coverUrl: book.cover?.url,
        okuUrl: book.okuUrl,
      })
    )
    .splice(0, args.limit || 50);
}
