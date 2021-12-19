import { getSpotifyNowPlaying } from './spotify';
import { getPlaylists } from './content';
import { getNowReading } from './books';

export default {
  Query: {
    spotifyNowPlaying: getSpotifyNowPlaying,
    playlists: getPlaylists,
    nowReading: getNowReading,
  },
};
