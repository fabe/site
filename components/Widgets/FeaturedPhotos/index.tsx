import Maybe from 'graphql/tsutils/Maybe';
import Image from 'next/image';
import React, { FC } from 'react';
import WidgetWrapper from '..';
import { Photo } from '../../../graphql/types/types.generated';
import contentfulLoader from '../../../lib/contentfulLoader';

interface FeaturedPhotosProps {
  photos: Array<Maybe<Photo>>;
}

const PHOTO_HEIGHT = 184;
const UNSPLASH_PROFILE_URL = 'https://unsplash.com/@fabians';

const FeaturedPhotos: FC<FeaturedPhotosProps> = ({ photos }) => {
  return (
    <WidgetWrapper
      renderTitle={() => (
        <div className="flex justify-between">
          <span>Featured photos</span>
          <a
            href={UNSPLASH_PROFILE_URL}
            target="_blank"
            title="View Unsplash profile"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                className="dark:fill-zinc-300 fill-gray-500"
                d="M5 4.5V0h6v4.5H5zM11 7h5v9H0V7h5v4.5h6V7z"
              ></path>
            </svg>
          </a>
        </div>
      )}
    >
      <div className="flex gap-4">
        {photos.map((photo) => {
          if (!photo) return null;

          const ratio = photo.width / photo.height;
          const width = PHOTO_HEIGHT * ratio;

          return (
            <a
              key={photo.unsplashUrl}
              href={photo.unsplashUrl || '#'}
              target="_blank"
              title="View on Unsplash"
              rel="noopener noreferrer"
              className="drop-shadow-md"
            >
              <Image
                alt={photo.description || ''}
                className="bg-gray-200 rounded dark:bg-zinc-600"
                src={photo.photoUrl}
                width={width}
                height={PHOTO_HEIGHT}
                loader={contentfulLoader}
              />
            </a>
          );
        })}
      </div>
    </WidgetWrapper>
  );
};

export default FeaturedPhotos;
