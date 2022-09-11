import { formatDistanceToNowStrict } from "date-fns";
import { SpotifyStatus } from "../../graphql/types/types.generated";
import Badge from "../Badge";
import MediaCard from "../MediaCard";

interface NowPlayingProps {
  spotifyStatus: SpotifyStatus;
}

export default function NowPlayingWidget(props: NowPlayingProps) {
  if (!props.spotifyStatus.song) {
    return null;
  }

  const { song, isPlaying, timestamp } = props.spotifyStatus;
  const { album, albumImageUrl, title, artist, spotifyUrl } = song;

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="dark:text-silver-dark text-neutral-500">
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
          subtitle={artist}
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
