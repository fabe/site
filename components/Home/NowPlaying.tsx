import { NowPlaying } from "../../graphql/types/types.generated";
import Badge from "../Badge";
import MediaCard from "../MediaCard";

interface NowPlayingProps {
  nowPlaying: NowPlaying;
}

export default function NowPlayingWidget(props: NowPlayingProps) {
  const { album, albumImageUrl, title, artist, isPlaying, songUrl, timestamp } =
    props.nowPlaying;

  console.log(timestamp);

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-silver-dark">
          <div className="flex items-center gap-2">
            Listening
            {isPlaying ? <Badge isLive>Live</Badge> : null}
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
          href={songUrl}
          hrefLabel="View on Spotify"
        />
      </dd>
    </dl>
  );
}
