import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    spotifyNowPlaying: NowPlaying!
    playlists: [Playlist]!
    nowReading: [Book]!
    recentlyRead(latest: Int): [Book]!
    favouriteBooks(limit: Int): [Book]!
  }

  type NowPlaying {
    album: String
    albumImageUrl: String
    artist: String
    isPlaying: Boolean!
    songUrl: String
    title: String
  }

  type Playlist {
    title: String!
    coverUrl: String!
    spotifyUrl: String!
  }

  type Book {
    title: String!
    author: String!
    readingDate: String
    okuUrl: String!
    coverUrl: String
  }
`;
