import { formatDistanceToNowStrict } from "date-fns";
import { SpotifyStatus } from "../../graphql/types/types.generated";
import Badge from "../Badge";
import MediaCard from "../MediaCard";
import { useEffect, useState } from "react";

interface NowPlayingProps {
  spotifyStatus: SpotifyStatus;
  loading?: boolean;
}

export default function NowPlayingWidget(props: NowPlayingProps) {
  if (props.loading) {
    return (
      <dl className="list-container">
        <dt className="list-title">
          <h3 className="text-neutral-500 dark:text-silver-dark">
            <div className="flex items-center gap-2">Listening</div>
          </h3>
        </dt>
        <dd className="list-content animate-pulse">
          <MediaCard loading={true} />
        </dd>
      </dl>
    );
  }

  if (!props.spotifyStatus?.song) {
    return null;
  }

  const { song, isPlaying, timestamp } = props.spotifyStatus;
  const { album, albumImageUrl, title, artist, spotifyUrl } = song;

  return (
    <dl className="list-container">
      <dt className="list-title">
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
      </dt>

      <dd className="list-content">
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
      </dd>
    </dl>
  );
}
