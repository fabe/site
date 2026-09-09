import { Link, useNavigate } from "@tanstack/react-router";
import type { PageHomeQueryQuery } from "@/graphql/types/types.generated";
import { getFocalPointObjectPosition } from "@/lib/focalPointPosition";
import photoImageLoader, { photoImageSrcSet } from "@/lib/photoImageLoader";
import { useHaptics } from "@/lib/useHaptics";
import HomeSection from "./Section";

type Photo = NonNullable<
  NonNullable<NonNullable<PageHomeQueryQuery["photoSet"]>["photos"]>[number]
>;

export default function Photos({
  photos,
  onThumbnailLoad,
}: {
  photos: Photo[];
  onThumbnailLoad?: (photoId: string, src: string) => void;
}) {
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const previewPhotos = photos.slice(0, 5);

  if (previewPhotos.length === 0) return null;

  return (
    <HomeSection title="Photos">
      <div className="grid w-full grid-cols-4 gap-3 sm:grid-cols-5">
        {previewPhotos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`Open photo${photo.description ? `: ${photo.description}` : ""}`}
            className="group aspect-square overflow-hidden rounded bg-surface-raised drop-shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg last:hidden sm:last:block"
            onClick={(event) => {
              const image = event.currentTarget.querySelector("img");
              if (image?.complete && image.naturalWidth > 0) {
                onThumbnailLoad?.(photo.id, image.currentSrc || image.src);
              }

              haptic("light");
              navigate({
                to: "/",
                search: { id: photo.id },
                resetScroll: false,
                mask: {
                  to: "/photos/$slug",
                  params: { slug: photo.id },
                  search: { id: undefined },
                  unmaskOnReload: true,
                },
              });
            }}
          >
            <img
              src={photoImageLoader({
                src: photo.url,
                width: 640,
                quality: 80,
              })}
              srcSet={photoImageSrcSet({
                src: photo.url,
                widths: [240, 360, 480, 640],
                quality: 80,
              })}
              sizes="(min-width: 640px) 8vw, 25vw"
              loading="lazy"
              decoding="async"
              alt={photo.description || ""}
              className="h-full w-full object-cover"
              onLoad={(event) =>
                onThumbnailLoad?.(
                  photo.id,
                  event.currentTarget.currentSrc || event.currentTarget.src,
                )
              }
              style={{
                objectPosition: getFocalPointObjectPosition(photo, 1),
              }}
            />
          </button>
        ))}
      </div>
      <Link
        to="/photos"
        search={{ id: undefined }}
        className="link link-sm mt-3 inline-flex"
      >
        View all photos
      </Link>
    </HomeSection>
  );
}
