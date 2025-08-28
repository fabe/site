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
import { getLastfmStatus } from "./lastfm";

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
    lastfmStatus: getLastfmStatus,
    musicStatus: async () => {
      // Prefer Spotify live; if not live, compare timestamps with Last.fm
      const [spotify, lastfm] = await Promise.all([
        getSpotifyStatus(),
        getLastfmStatus(),
      ]);

      if (spotify?.isPlaying) return spotify;
      if (lastfm?.isPlaying) return lastfm;

      const sTime = spotify?.timestamp
        ? new Date(spotify.timestamp).getTime()
        : -1;
      const lTime = lastfm?.timestamp
        ? new Date(lastfm.timestamp).getTime()
        : -1;

      return lTime > sTime ? lastfm : spotify;
    },
    spotifyPlaylist: getSpotifyPlaylist,
  },
};
