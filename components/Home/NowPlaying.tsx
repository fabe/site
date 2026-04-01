import { formatDistanceToNowStrict } from "date-fns";
import { SpotifyStatus } from "../../graphql/types/types.generated";
import Badge from "../Badge";
import { LinkExternal } from "../Links";
import MediaCard from "../MediaCard";
import { useEffect, useState } from "react";
import HomeSection from "./Section";

interface NowPlayingProps {
  spotifyStatus: SpotifyStatus;
  loading?: boolean;
}

export default function NowPlayingWidget(props: NowPlayingProps) {
  if (props.loading) {
    return (
      <HomeSection
        title={
          <h3 className="text-neutral-500 dark:text-silver-dark">
            <div className="flex items-center gap-2">Listening</div>
          </h3>
        }
        ddClassName="animate-pulse"
      >
        <MediaCard loading={true} />
      </HomeSection>
    );
  }

  if (!props.spotifyStatus?.song) {
    return null;
  }

  const { song, isPlaying, timestamp, playlist } = props.spotifyStatus;
  const { album, albumImageUrl, title, artist, spotifyUrl } = song;

  return (
    <HomeSection
      title={
        <h3 className="text-neutral-500 dark:text-silver-dark">
          <div className="flex items-center gap-2">
            Listening
            {isPlaying ? (
              <Badge isLive>Live</Badge>
            ) : (
              <Badge>
                {formatDistanceToNowStrict(new Date(timestamp), {
                  addSuffix: true,
                })}
              </Badge>
            )}
          </div>
        </h3>
      }
    >
      {playlist && (
        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-lg bg-gray-100 pl-1 pr-2 py-1 dark:bg-neutral-800">
          <img
            src={playlist.coverUrl}
            alt={`${playlist.name} playlist cover`}
            title={playlist.name}
            width={20}
            height={20}
            className="flex-shrink-0 rounded-[5px]"
          />
          <LinkExternal
            href={playlist.spotifyUrl}
            iconSize={14}
            className="min-w-0 text-sm text-neutral-500 dark:text-silver-dark [font-variation-settings:'opsz'_14]"
            contentClassName="block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {playlist.name}
          </LinkExternal>
        </div>
      )}
      <MediaCard
        title={title}
        subtitle={`${artist}${album ? ` · ${album}` : null}`}
        image={{
          alt: album ? album : "Album cover",
          title: album ? album : null,
          src: albumImageUrl ? albumImageUrl : "",
          width: 56,
          height: 56,
        }}
        href={spotifyUrl}
        hrefLabel="View on Spotify"
      />
    </HomeSection>
  );
}
