import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    spotifyNowPlaying: NowPlaying!
    playlists: [Playlist]!
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
`;
