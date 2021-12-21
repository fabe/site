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

export const resolvers = {
  Query: {
    favouriteBooks: getFavouriteBooks,
    nowReading: getNowReading,
    photos: getPhotos,
    playlists: getPlaylists,
    post: getPost,
    posts: getPosts,
    recentlyRead: getRecentlyRead,
    siteSettings: getSiteSettings,
    spotifyNowPlaying: getSpotifyNowPlaying,
  },
};
