import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    getSpotifyNowPlaying: NowPlaying
  }

  type NowPlaying {
    album: String
    albumImageUrl: String
    artist: String
    isPlaying: Boolean!
    songUrl: String
    title: String
  }
`;
