import { formatDistanceToNowStrict } from "date-fns";
import type { MusicStatusQueryQuery } from "../../graphql/types/types.generated";
import Badge from "../Badge";
import { LinkExternal } from "../Links";
import MediaCard from "../MediaCard";
import { useEffect, useState } from "react";
import { SectionTitle } from "../Typography";
import HomeSection from "./Section";

type MusicStatus = MusicStatusQueryQuery["musicStatus"];

interface NowPlayingProps {
  spotifyStatus?: MusicStatus | null;
  loading?: boolean;
}

export default function NowPlayingWidget(props: NowPlayingProps) {
  if (props.loading) {
    return (
      <HomeSection
        title={
          <SectionTitle>
            <div className="flex items-center gap-2">Listening</div>
          </SectionTitle>
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
        <SectionTitle>
          <div className="flex items-center gap-2">
            Listening
            {isPlaying ? (
              <Badge isLive>Live</Badge>
            ) : timestamp ? (
              <Badge>
                {formatDistanceToNowStrict(new Date(timestamp), {
                  addSuffix: true,
                })}
              </Badge>
            ) : null}
          </div>
        </SectionTitle>
      }
    >
      {playlist && (
        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-lg bg-surface-muted py-1 pl-1 pr-2 dark:bg-surface">
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
            className="min-w-0 text-meta"
            contentClassName="block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {playlist.name}
          </LinkExternal>
        </div>
      )}
      <MediaCard
        title={title ?? undefined}
        subtitle={
          artist ? (album ? `${artist} · ${album}` : artist) : undefined
        }
        image={{
          alt: album ? album : "Album cover",
          title: album ?? undefined,
          src: albumImageUrl ?? "",
          width: 56,
          height: 56,
        }}
        href={spotifyUrl ?? undefined}
        hrefLabel="View on Spotify"
      />
    </HomeSection>
  );
}
