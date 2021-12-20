import { getSpotifyNowPlaying } from './spotify';
import {
  getFavouriteBooks,
  getPhotos,
  getPlaylists,
  getPost,
  getPosts,
  getSiteSettings,
} from './content';
import { getNowReading, getRecentlyRead } from './books';

export default {
  Query: {
    spotifyNowPlaying: getSpotifyNowPlaying,
    playlists: getPlaylists,
    nowReading: getNowReading,
    recentlyRead: getRecentlyRead,
    favouriteBooks: getFavouriteBooks,
    posts: getPosts,
    post: getPost,
    photos: getPhotos,
    siteSettings: getSiteSettings,
  },
};
