import React, { FC } from 'react';
import { NowPlaying } from '../../../graphql/types/types.generated';
import Image from 'next/image';
import WidgetWrapper from '..';

interface NowPlayingProps {
  nowPlaying: NowPlaying;
}

const NowPlaying: FC<NowPlayingProps> = ({ nowPlaying }) => {
  const { album, albumImageUrl, title, artist, isPlaying, songUrl } =
    nowPlaying;

  return (
    <WidgetWrapper
      renderTitle={() => (
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <>
              <span className="relative flex w-2 h-2" aria-hidden>
                <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-85 dark:opacity-75 dark:bg-green-400 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-green-600 rounded-full dark:bg-green-500"></span>
              </span>
              Listening to
            </>
          ) : (
            `Last listened to`
          )}
        </div>
      )}
    >
      <div className="relative pb-2">
        <div className="relative z-10 w-12 h-12 drop-shadow-md">
          <Image
            alt={album ? album : 'Album cover'}
            title={album ? album : undefined}
            className="bg-gray-200 rounded dark:bg-zinc-600"
            src={albumImageUrl ? albumImageUrl : ''}
            width={48}
            height={48}
          />
        </div>

        <div
          className="absolute top-0 left-0 z-0 w-12 h-12 opacity-40 dark:opacity-50 blur-lg"
          aria-hidden="true"
        >
          <Image
            alt=""
            src={albumImageUrl ? albumImageUrl : ''}
            width={48}
            height={48}
          />
        </div>
      </div>

      <a
        href={songUrl || '#'}
        target="_blank"
        title="View on Spotify"
        rel="noopener noreferrer"
      >
        <span className="block w-full text-2xl font-medium text-gray-800 truncate dark:text-zinc-50">
          {title}
        </span>
      </a>
      <span className="block text-sm font-medium text-gray-500 truncate dark:text-zinc-300">
        {artist}
      </span>
    </WidgetWrapper>
  );
};

export default NowPlaying;
