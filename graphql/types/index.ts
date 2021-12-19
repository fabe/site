export type SpotifyNowPlaying = {
  album?: string;
  albumImageUrl?: string;
  artist?: string;
  isPlaying: boolean;
  songUrl?: string;
  title?: string;
};

export type Playlist = {
  title: string;
  coverUrl: string;
  spotifyUrl: string;
};

export type Book = {
  title: string;
  author: string;
  startedReadingDate: string;
  okuUrl: string;
};
