import querystring from 'querystring';
import { NowPlaying } from '../../types/types.generated';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
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

export async function getSpotifyNowPlaying(): Promise<NowPlaying> {
  const { access_token } = await getAccessToken();
  const nowPlayingResponse = await getNowPlaying(access_token);

  if (nowPlayingResponse.status > 400) {
    return { isPlaying: false };
  }

  if (nowPlayingResponse.status === 204) {
    const recentlyPlayedResponse = await getRecentlyPlayed(access_token);
    const songs = await recentlyPlayedResponse.json();
    const song = songs.items[0];

    const title = song.track.name;
    const artist = song.track.artists
      .map((_artist: any) => _artist.name)
      .join(', ');
    const album = song.track.album.name;
    const albumImageUrl = song.track.album.images[0].url;
    const songUrl = song.track.external_urls.spotify;

    return {
      isPlaying: false,
      album,
      albumImageUrl,
      artist,
      songUrl,
      title,
    };
  }

  const song = await nowPlayingResponse.json();
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists
    .map((_artist: any) => _artist.name)
    .join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return {
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  };
}
