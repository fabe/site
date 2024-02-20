import Image from "next/image";
import { Photo } from "../../graphql/types/types.generated";
import contentfulLoader from "../../lib/contentfulLoader";
import { useState } from "react";
import {
  ApertureIcon,
  CalendarIcon,
  CameraIcon,
  SpinnerIcon,
  SunIcon,
  TagIcon,
} from "../Icons";
import { ExifSummaryExposure } from "../ExifSummary";
import formatDate from "../../lib/formatDate";

interface LightboxPhotoProps {
  photo: Photo;
}

export default function LightboxPhoto({ photo }: LightboxPhotoProps) {
  const [loading, setLoading] = useState(true);
  const exif = photo.exif as EXIF;

  return (
    <div className="flex flex-col sm:flex-row overflow-hidden h-full w-full">
      <div className="relative flex grow-0 flex-auto">
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <SpinnerIcon size={24} />
          </div>
        )}

        <Image
          src={photo.url}
          alt={photo.description}
          sizes="1024px"
          className="bg-gray-200 dark:bg-neutral-900 object-contain"
          width={photo.width}
          height={photo.height}
          onLoad={() => setLoading(false)}
          quality={90}
          loader={(props) =>
            contentfulLoader({
              ...props,
            })
          }
        />
      </div>

      <div className="basis-[340px] bg-white dark:bg-neutral-950 shrink-0 flex-auto p-6 flex flex-col justify-between">
        <h1 className="[font-variation-settings:'wght'_550] text-neutral-800 dark:text-white text-2xl">
          {photo.description || "A photo"}
        </h1>
        <ul className="text-neutral-500 dark:text-silver-dark flex flex-col gap-1 border-solid border-neutral-500/10 pt-6 dark:border-neutral-900 sm:border-t">
          {exif.Make && (
            <li className="flex gap-2">
              <div className="flex-none flex pt-0.5">
                <CameraIcon size={16} />
              </div>
              {exif.Make} {exif.Model}
            </li>
          )}
          {exif.Make && (
            <li className="flex gap-2">
              <div className="flex-none flex pt-0.5">
                <ApertureIcon size={16} />
              </div>
              {exif.LensModel}
            </li>
          )}
          {exif.ISO && (
            <li className="flex gap-2">
              <div className="flex-none flex pt-0.5">
                <SunIcon size={16} />
              </div>
              <ExifSummaryExposure exif={exif} />
            </li>
          )}
          {exif.DateTimeOriginal && (
            <li className="flex gap-2">
              <div className="flex-none flex pt-0.5">
                <CalendarIcon size={16} />
              </div>
              {formatDate(exif.DateTimeOriginal)}
            </li>
          )}
          {photo.tags && (
            <li className="flex gap-2">
              <div className="flex-none flex pt-0.5">
                <TagIcon size={16} />
              </div>
              {photo.tags.join(", ")}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
