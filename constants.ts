export const DATE_FORMAT: object = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const PLAYLIST_IDS = [
  "4BWCzBOYFTgnkD2c00w9Si", // 2025
  "0bMTUisUt7pIiGQzguAETA", // 2024
  "7a2g42UzPgZoSvDYrsYY7M", // 2023
  "6jVpWQPYp1FwkZVwfRegha", // 2022
  "5ELpvH94Dq0GuGLiqGVWEM", // 2021
  "0JTXCwse1adXIUppeiJny9", // 2020
  "7Dj8dS13NyO60tl3VRoI5V", // 2019
  "5RiBqFIoVt0VuIl3QdwbWF", // 2018
  // "53dkKdbZ5EHilxdOB30i4X", // 2017
];

export type MusicMode = "SPOTIFY_ONLY" | "PREFER_SPOTIFY";

export const MUSIC_STATUS_MODE: MusicMode =
  (process.env.NEXT_PUBLIC_MUSIC_STATUS_MODE as MusicMode) || "SPOTIFY_ONLY";

export type BookSource = "LITERAL" | "GOODREADS";

export const BOOK_SOURCE: BookSource =
  (process.env.BOOK_SOURCE as BookSource) || "LITERAL";
