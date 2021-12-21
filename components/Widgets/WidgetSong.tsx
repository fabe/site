import { FC } from 'react';
import { NowPlaying } from '../../graphql/types/types.generated';
import Image from 'next/image';

interface WidgetSongProps {
  nowPlaying: NowPlaying;
}

const SongWidget: FC<WidgetSongProps> = ({ nowPlaying }) => {
  const { album, albumImageUrl, title, artist, isPlaying } = nowPlaying;

  return (
    <figure className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
      <h2 className="pb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
        {isPlaying ? `Listening to` : `Last listened to`}
      </h2>

      <div className="relative pb-2">
        <div className="relative z-10 w-12 h-12 drop-shadow-md">
          <Image
            alt={album ? album : 'Album cover'}
            title={album ? album : undefined}
            className="rounded"
            src={albumImageUrl ? albumImageUrl : ''}
            width={48}
            height={48}
          />
        </div>

        <div className="absolute top-0 left-0 z-0 w-12 h-12 opacity-50 blur-lg">
          <Image
            alt=""
            src={albumImageUrl ? albumImageUrl : ''}
            width={48}
            height={48}
          />
        </div>
      </div>

      <span className="block text-2xl font-medium text-gray-700 dark:text-gray-100">
        {title}
      </span>
      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
        {artist}
      </span>
    </figure>
  );
};

export default SongWidget;
