import { getSpotifyNowPlaying } from './spotify';
import { getPlaylists } from './content';

export default {
  Query: {
    spotifyNowPlaying: getSpotifyNowPlaying,
    playlists: getPlaylists,
  },
};
