import { getNowReading, getRecentlyRead } from "./books";
import {
  getFavouriteBooks,
  getPhotos,
  getPlaylists,
  getPost,
  getPosts,
  getSiteSettings,
} from "./content";
import { getSpotifyNowPlaying } from "./spotify";

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
