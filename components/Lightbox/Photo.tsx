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
    <div className="w-full max-h-full h-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row w-full h-full bg-white dark:bg-neutral-900">
        <div className="relative w-full h-full lg:w-auto lg:flex-1 flex justify-center">
          {loading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <SpinnerIcon size={24} />
            </div>
          )}

          <div
            className="relative w-full h-full bg-gray-200 dark:bg-neutral-900"
            style={{
              maxHeight: "100vh",
            }}
          >
            <Image
              src={photo.url}
              alt={photo.description}
              priority
              sizes="100vw"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
              className={`object-contain h-full w-full relative transition-opacity duration-300 ease-in-out ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              fill
              onLoad={() => setLoading(false)}
              quality={90}
              loader={(props) =>
                contentfulLoader({
                  ...props,
                })
              }
            />
          </div>
        </div>

        <div className="lg:basis-[400px] bg-white dark:bg-neutral-800 shrink-0 p-6 lg:flex lg:justify-between lg:flex-col tabular-nums">
          <h1 className="[font-variation-settings:'wght'_550] text-neutral-800 dark:text-white text-2xl">
            {photo.description || "A photo"}
          </h1>
          <ul className="text-neutral-500 dark:text-silver-dark flex flex-col gap-1 border-solid border-neutral-500/10 pt-6 dark:border-neutral-700 lg:border-t">
            {exif.Make && (
              <li className="flex gap-2">
                <div className="flex-none flex pt-0.5">
                  <CameraIcon size={16} />
                </div>
                <span className="break-words">
                  {exif.Make} {exif.Model}
                </span>
              </li>
            )}
            {exif.LensModel && (
              <li className="flex gap-2">
                <div className="flex-none flex pt-0.5">
                  <ApertureIcon size={16} />
                </div>
                <span className="break-words">{exif.LensModel}</span>
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
                <span className="break-words">{photo.tags.join(", ")}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
