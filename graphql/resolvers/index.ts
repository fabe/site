import { getBooks } from "./books";
import {
  getPhotos,
  getPlaylists,
  getPost,
  getPosts,
  getSiteSettings,
} from "./content";
import { getSpotifyStatus } from "./spotify";

export const resolvers = {
  Query: {
    books: getBooks,
    photos: getPhotos,
    playlists: getPlaylists,
    post: getPost,
    posts: getPosts,
    siteSettings: getSiteSettings,
    spotifyStatus: getSpotifyStatus,
  },
};
