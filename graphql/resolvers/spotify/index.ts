import querystring from "querystring";

import {
  QuerySpotifyPlaylistArgs,
  SpotifyPlaylist,
  SpotifyStatus,
} from "../../types/types.generated";
import { proxiedImageUrl } from "../../../lib/imageProxy";

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;
const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

type SpotifyTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type SpotifyPlaylistResponse = {
  name?: string;
  images?: Array<{ url?: string }>;
  items?: { total?: number };
  tracks?: { total?: number };
  followers?: { total?: number };
  external_urls?: { spotify?: string };
};

async function getSpotifyError(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;

  return body?.error?.message;
}

const getAccessToken = async () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Spotify credentials are not configured");
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const token = (await response.json()) as SpotifyTokenResponse;

  if (!response.ok || !token.access_token) {
    const message = token.error_description ?? token.error ?? "Unknown error";
    throw new Error(
      `Spotify token request failed (${response.status}): ${message}`,
    );
  }

  return token.access_token;
};

const getNowPlaying = async (access_token: string) => {
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getRecentlyPlayed = async (access_token: string) => {
  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getPlaylist = async (access_token: string, playlistId: string) => {
  return fetch(PLAYLIST_ENDPOINT + `/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

function formatPlaylist(playlist: SpotifyPlaylistResponse): SpotifyPlaylist {
  const trackCount = playlist.items?.total ?? playlist.tracks?.total;
  const spotifyUrl = playlist.external_urls?.spotify;

  if (!playlist.name || trackCount === undefined || !spotifyUrl) {
    throw new Error("Spotify returned incomplete playlist metadata");
  }

  return {
    name: playlist.name,
    coverUrl: proxiedImageUrl(playlist.images?.[0]?.url),
    trackCount,
    followerCount: playlist.followers?.total ?? 0,
    spotifyUrl,
  };
}

export async function getSpotifyStatus(): Promise<SpotifyStatus> {
  const access_token = await getAccessToken();
  const nowPlayingResponse = await getNowPlaying(access_token);

  if (!nowPlayingResponse.ok) {
    const message =
      (await getSpotifyError(nowPlayingResponse)) ?? "Unknown upstream error";
    throw new Error(
      `Spotify now-playing request failed (${nowPlayingResponse.status}): ${message}`,
    );
  }

  if (nowPlayingResponse.status === 204) {
    const recentlyPlayedResponse = await getRecentlyPlayed(access_token);

    if (!recentlyPlayedResponse.ok) {
      const message =
        (await getSpotifyError(recentlyPlayedResponse)) ??
        "Unknown upstream error";
      throw new Error(
        `Spotify recently-played request failed (${recentlyPlayedResponse.status}): ${message}`,
      );
    }

    const songs = await recentlyPlayedResponse.json();
    const song = songs.items[0];

    if (!song?.track) {
      return { isPlaying: false };
    }

    const timestamp = song.played_at?.toString();
    const title = song.track.name;
    const artist = song.track.artists
      .map((_artist: any) => _artist.name)
      .join(", ");
    const album = song.track.album.name;
    const albumImageUrl = proxiedImageUrl(song.track.album.images[0].url);
    const spotifyUrl = song.track.external_urls.spotify;

    return {
      timestamp,
      isPlaying: false,
      song: {
        title,
        artist,
        album,
        albumImageUrl,
        spotifyUrl,
      },
    };
  }

  const song = await nowPlayingResponse.json();

  if (!song?.item) {
    return { isPlaying: false };
  }

  const isPlaying = song.is_playing || Number.isInteger(song.timestamp);
  const title = song.item.name;
  const artist = song.item.artists
    .map((_artist: any) => _artist.name)
    .join(", ");
  const album = song.item.album.name;
  const albumImageUrl = proxiedImageUrl(song.item.album.images[0].url);
  const spotifyUrl = song.item.external_urls.spotify;
  const contextType = song.context?.type ?? null;

  let playlist = null;
  if (contextType === "playlist" && song.context?.uri) {
    const playlistId = song.context.uri.split(":").pop();
    if (playlistId) {
      try {
        const res = await getPlaylist(access_token, playlistId);
        if (res.ok) {
          const p = (await res.json()) as SpotifyPlaylistResponse;
          playlist = formatPlaylist(p);
        }
      } catch (error) {
        console.error("Failed to load the current Spotify playlist", error);
      }
    }
  }

  return {
    isPlaying,
    song: {
      title,
      artist,
      album,
      albumImageUrl,
      spotifyUrl,
    },
    playlist,
  };
}

export async function getSpotifyPlaylist(
  _: unknown,
  args: QuerySpotifyPlaylistArgs,
): Promise<SpotifyPlaylist> {
  const access_token = await getAccessToken();
  const playlistResponse = await getPlaylist(access_token, args.id);

  if (!playlistResponse.ok) {
    const message =
      (await getSpotifyError(playlistResponse)) ?? "Unknown upstream error";
    throw new Error(
      `Spotify playlist request failed (${playlistResponse.status}): ${message}`,
    );
  }

  const playlist =
    (await playlistResponse.json()) as SpotifyPlaylistResponse;
  return formatPlaylist(playlist);
}
