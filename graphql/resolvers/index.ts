import { getBooks } from "./books";
import {
  getPhoto,
  getPhotos,
  getPhotoSet,
  getPhotoSets,
  getPlaces,
  getPlaylists,
  getPost,
  getPosts,
  getSiteSettings,
} from "./content";
import { getSpotifyPlaylist, getSpotifyStatus } from "./spotify";

export const resolvers = {
  Query: {
    books: getBooks,
    photo: getPhoto,
    photos: getPhotos,
    photoSet: getPhotoSet,
    photoSets: getPhotoSets,
    playlists: getPlaylists,
    post: getPost,
    posts: getPosts,
    places: getPlaces,
    siteSettings: getSiteSettings,
    spotifyStatus: getSpotifyStatus,
    spotifyPlaylist: getSpotifyPlaylist,
  },
};
