import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import { Main } from "@/components/Layouts";
import MediaCard from "@/components/MediaCard";
import { PLAYLIST_IDS } from "@/constants";
import { QUERY_PLAYLIST } from "@/graphql/queries";
import type { SpotifyPlaylist } from "@/graphql/types/types.generated";
import { baseUrl } from "./__root";

const fetchPlaylists = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const apolloClient = await initializeApollo();

  const playlistData = PLAYLIST_IDS.map(async (id) => {
    const { data } = await apolloClient.query({
      query: QUERY_PLAYLIST,
      variables: { id },
    });
    return data.spotifyPlaylist;
  });

  const playlists = await Promise.all(playlistData);
  return { playlists };
});

export const Route = createFileRoute("/playlists")({
  loader: async () => {
    return await fetchPlaylists();
  },
  head: () => ({
    meta: [
      { title: "Playlists — Fabian Schultz" },
      { name: "description", content: "Annual playlists." },
      { property: "og:title", content: "Playlists — Fabian Schultz" },
      { property: "og:description", content: "Annual playlists." },
      { property: "og:url", content: `${baseUrl}/playlists` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/playlists` }],
  }),
  component: PlaylistsComponent,
});

function PlaylistsComponent() {
  const { playlists } = Route.useLoaderData();

  return (
    <Main>
      <h1 className="pb-6 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:pb-12 sm:text-3xl">
        Playlists
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {playlists.map((playlist: SpotifyPlaylist) => (
          <MediaCard
            key={playlist.name}
            title={playlist.name}
            subtitle={`${playlist.trackCount} songs${
              playlist.followerCount
                ? ` · ${playlist.followerCount} save${
                    playlist.followerCount > 1 ? "s" : ""
                  }`
                : ""
            }`}
            image={{
              alt: `Playlist cover for ${playlist.name}`,
              title: playlist.name,
              src: playlist.coverUrl ? playlist.coverUrl : "",
              width: 124,
              height: 124,
            }}
            href={playlist.spotifyUrl}
            hrefLabel="View on Spotify"
            borderTop
          />
        ))}
      </div>
    </Main>
  );
}
