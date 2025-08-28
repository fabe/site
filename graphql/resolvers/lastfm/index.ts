import { SpotifyStatus } from "../../types/types.generated";

const { LASTFM_API_KEY: apiKey, LASTFM_USERNAME: username } = process.env;

const LASTFM_RECENT_ENDPOINT = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=1`;

function normalizeImage(
  images: any[],
  size: string = "large",
): string | undefined {
  if (!Array.isArray(images)) return undefined;
  const found = images.find((img) => img && img.size === size);
  return found?.["#text"] || images[images.length - 1]?.["#text"] || undefined;
}

export async function getLastfmStatus(): Promise<SpotifyStatus> {
  if (!apiKey || !username) {
    return { isPlaying: false } as SpotifyStatus;
  }

  const requestUrl = `${LASTFM_RECENT_ENDPOINT}&api_key=${encodeURIComponent(
    apiKey,
  )}&user=${encodeURIComponent(username)}`;
  const res = await fetch(requestUrl, {
    headers: { "cache-control": "no-cache" } as any,
  });
  if (res.status > 200) return { isPlaying: false } as SpotifyStatus;
  const json = await res.json();

  const track = json?.recenttracks?.track?.[0];
  if (!track) return { isPlaying: false } as SpotifyStatus;

  const isNowPlaying = track?.["@attr"]?.nowplaying === "true";
  const timestamp = !isNowPlaying
    ? track?.date?.uts
      ? new Date(Number(track.date.uts) * 1000).toISOString()
      : undefined
    : undefined;
  const title = track?.name;
  const artist = track?.artist?.["#text"];
  const album = track?.album?.["#text"];
  const albumImageUrl = normalizeImage(track?.image);
  const trackUrl = track?.url; // Last.fm track url (will not show on UI)

  // Attempt to infer a platform link from the track URL:
  // If the URL contains "apple.com" or "spotify.com" we can pass it through.
  // Otherwise leave spotifyUrl empty; the UI won't mention Last.fm.
  const inferredLink = /apple\.com|spotify\.com/.test(trackUrl || "")
    ? trackUrl
    : undefined;

  return {
    isPlaying: !!isNowPlaying,
    timestamp,
    song: {
      title,
      artist,
      album,
      albumImageUrl,
      spotifyUrl: inferredLink, // UI uses this as generic href
    },
  } as SpotifyStatus;
}
