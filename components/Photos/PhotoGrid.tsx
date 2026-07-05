import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { getFocalPointObjectPosition } from "@/lib/focalPointPosition";
import photoImageLoader, { photoImageSrcSet } from "@/lib/photoImageLoader";
import { useHaptics } from "@/lib/useHaptics";
import type { ColorData } from "@/lib/colorExtractor";

type Photo = {
  id: string;
  description?: string | null;
  focalPoint?: { x: number; y: number } | null;
  url: string;
  width?: number;
  height?: number;
  colors?: ColorData;
};

type PhotoSet = {
  slug: string;
};

type PhotoGridProps =
  | {
      photos: Photo[];
      mode: "feed";
    }
  | {
      photos: Photo[];
      photoSet: PhotoSet;
      mode: "set";
    };

export function PhotoGrid(props: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
      {props.photos.map((photo) => (
        <PhotoThumbnail
          key={photo.id}
          photo={photo}
          photoSet={props.mode === "set" ? props.photoSet : undefined}
          mode={props.mode}
        />
      ))}
      {props.mode === "feed" && props.photos.length % 2 === 1 && (
        <div
          aria-hidden="true"
          className="hidden sm:block aspect-[3/4] bg-surface/30 dark:bg-white/[0.015]"
        />
      )}
    </div>
  );
}

function PhotoThumbnail({
  photo,
  photoSet,
  mode,
}: {
  photo: Photo;
  photoSet?: PhotoSet;
  mode: "feed" | "set";
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const objectPosition = getFocalPointObjectPosition(photo, 3 / 4);

  return (
    <button
      onClick={() => {
        haptic("light");
        if (mode === "feed") {
          navigate({
            to: "/photos",
            search: { id: photo.id },
            replace: true,
            resetScroll: false,
            mask: {
              to: "/photos/$slug",
              params: { slug: photo.id },
              search: { id: undefined },
              unmaskOnReload: true,
            },
          });
          return;
        }

        if (!photoSet) return;

        navigate({
          to: "/photos/$slug",
          params: { slug: photoSet.slug },
          search: { id: photo.id },
          replace: true,
          resetScroll: false,
          mask: {
            to: "/photos/$slug/$id",
            params: { slug: photoSet.slug, id: photo.id },
            unmaskOnReload: true,
          },
        });
      }}
      className={`group relative aspect-[3/4] overflow-hidden after:absolute after:left-0 after:top-0 after:z-10 after:h-full after:w-full after:shadow-border dark:after:shadow-none cursor-pointer outline-none focus-visible:outline-none ${
        mode === "set"
          ? "sm:[&:nth-child(15n-12)]:col-span-2 sm:last:col-span-2"
          : ""
      }`}
      style={{
        backgroundColor:
          photo.colors?.dominant ||
          `hsl(${(photo.id.charCodeAt(0) * 137.5) % 360}, 40%, 50%)`,
        background: photo.colors?.gradient || undefined,
      }}
    >
      <img
        ref={imageRef}
        src={photoImageLoader({
          src: photo.url,
          width: 2200,
          quality: 88,
        })}
        srcSet={photoImageSrcSet({
          src: photo.url,
          widths: [720, 960, 1280, 1600, 2200, 2600],
          quality: 88,
        })}
        sizes="(min-width: 640px) 50vw, 100vw"
        loading="lazy"
        decoding="async"
        alt={photo.description || ""}
        className={`absolute inset-0 w-full h-full object-cover pointer-fine:group-hover:brightness-75 transform-gpu ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 ease-out`}
        style={{ objectPosition }}
        onLoad={() => setImageLoaded(true)}
      />
    </button>
  );
}
