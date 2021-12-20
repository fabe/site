import { getSpotifyNowPlaying } from './spotify';
import { getFavouriteBooks, getPlaylists } from './content';
import { getNowReading, getRecentlyRead } from './books';

export default {
  Query: {
    spotifyNowPlaying: getSpotifyNowPlaying,
    playlists: getPlaylists,
    nowReading: getNowReading,
    recentlyRead: getRecentlyRead,
    favouriteBooks: getFavouriteBooks,
  },
};
