import type { GetStaticProps } from "next";
import React from "react";
import { Main } from "../components/Layouts";
import MediaCard from "../components/MediaCard";
import { SEO } from "../components/SEO";
import { PLAYLIST_IDS } from "../constants";
import { initializeApollo } from "../graphql/client";
import { QUERY_PLAYLIST } from "../graphql/queries";
import { SpotifyPlaylist } from "../graphql/types/types.generated";

export default function Playlists({ playlists }) {
  return (
    <>
      <SEO
        seo={{
          title: "Playlists",
          path: "/playlists",
        }}
      />
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
                alt: playlist.name,
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
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();
  let playlists = [];

  const playlistData = PLAYLIST_IDS.map(async (id) => {
    await apolloClient.query({
      query: QUERY_PLAYLIST,
      variables: {
        id,
      },
    });

    return apolloClient.readQuery({
      query: QUERY_PLAYLIST,
      variables: {
        id,
      },
    }).spotifyPlaylist;
  });

  playlists = await Promise.all(playlistData);

  return {
    props: {
      playlists,
    },
  };
};
