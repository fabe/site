import type { Photo } from "../../graphql/types/types.generated";
import photoImageLoader, { photoImageSrcSet } from "../../lib/photoImageLoader";
import { useCallback, useState } from "react";
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
  thumbnailSrc?: string;
}

export default function LightboxPhoto({
  photo,
  thumbnailSrc,
}: LightboxPhotoProps) {
  const [loading, setLoading] = useState(true);
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setLoading(false);
    }
  }, []);
  const exif = photo.exif as EXIF | null | undefined;
  const aspect = photo.width / photo.height;
  const aspectRatio = `${photo.width} / ${photo.height}`;

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full h-full bg-white dark:bg-neutral-900">
        <div className="relative w-full lg:w-auto lg:flex-1 flex justify-center min-h-0 flex-1">
          {loading && !thumbnailSrc && (
            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <SpinnerIcon size={24} />
            </div>
          )}

          <div className="relative w-full h-full bg-gray-200 dark:bg-neutral-900 overflow-hidden [container-type:size]">
            {thumbnailSrc && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2"
                style={{
                  aspectRatio,
                  width: `min(100cqw, calc(100cqh * ${aspect}))`,
                  height: `min(100cqh, calc(100cqw / ${aspect}))`,
                }}
              >
                <img
                  src={thumbnailSrc}
                  alt=""
                  className="h-full w-full scale-110 object-cover blur-2xl brightness-75 transform-gpu"
                />
              </div>
            )}
            <img
              ref={imgRef}
              src={photoImageLoader({
                src: photo.url,
                width: 2800,
                quality: 92,
              })}
              srcSet={photoImageSrcSet({
                src: photo.url,
                widths: [1200, 1600, 2200, 2800, 3200, 3840],
                quality: 92,
              })}
              sizes="100vw"
              decoding="async"
              alt={photo.description || ""}
              style={{
                aspectRatio,
              }}
              className={`object-contain h-full w-full relative transition-opacity duration-300 ease-in-out ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>

        <div className="lg:basis-[400px] bg-surface dark:bg-surface shrink-0 p-6 lg:flex lg:justify-between lg:flex-col tabular-nums overflow-y-auto">
          <h1 className="font-ui-strong text-heading text-2xl">
            {photo.description || "A photo"}
          </h1>
          <ul className="flex flex-col gap-1 border-solid border-line/10 pt-6 text-muted dark:border-neutral-700 lg:border-t">
            {exif?.Make && (
              <li className="flex gap-2">
                <div className="flex-none flex pt-0.5">
                  <CameraIcon size={16} />
                </div>
                <span className="break-words">
                  {exif.Make} {exif.Model}
                </span>
              </li>
            )}
            {exif?.LensModel && (
              <li className="flex gap-2">
                <div className="flex-none flex pt-0.5">
                  <ApertureIcon size={16} />
                </div>
                <span className="break-words">{exif.LensModel}</span>
              </li>
            )}
            {exif?.ISO && (
              <li className="flex gap-2">
                <div className="flex-none flex pt-0.5">
                  <SunIcon size={16} />
                </div>
                <ExifSummaryExposure exif={exif} />
              </li>
            )}
            {exif?.DateTimeOriginal && (
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
