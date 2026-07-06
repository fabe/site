import { useNavigate } from "@tanstack/react-router";
import { useDrag } from "@use-gesture/react";
import { useCallback, useEffect } from "react";
import Lightbox from "@/components/Lightbox";
import LightboxPhoto from "@/components/Lightbox/Photo";
import { useHaptics } from "@/lib/useHaptics";

type Photo = {
  id: string;
  description?: string | null;
  url: string;
  width: number;
  height: number;
  exif?: unknown;
  tags?: (string | null)[] | null;
  location?: { lat?: number | null; lon?: number | null } | null;
};

type PhotoSet = {
  slug: string;
};

type PhotoLightboxProps = {
  photos: Photo[];
  selectedPhotoId?: string;
  photoSet?: PhotoSet;
  thumbnailSrcById?: Record<string, string>;
  mode: "feed" | "set";
};

export function PhotoLightbox({
  photos,
  selectedPhotoId,
  photoSet,
  thumbnailSrcById,
  mode,
}: PhotoLightboxProps) {
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const selectedPhotoIndex = photos.findIndex(
    (photo) => photo.id === selectedPhotoId,
  );
  const selectedPhoto = selectedPhotoId
    ? photos.find((photo) => photo.id === selectedPhotoId)
    : null;

  const navigateToPhoto = useCallback(
    (id?: string) => {
      if (mode === "feed") {
        navigate({
          to: "/photos",
          search: { id },
          resetScroll: false,
          ...(id
            ? {
                mask: {
                  to: "/photos/$slug",
                  params: { slug: id },
                  search: { id: undefined },
                  unmaskOnReload: true,
                },
              }
            : {}),
        });
        return;
      }

      if (!photoSet) return;

      navigate({
        to: "/photos/$slug",
        params: { slug: photoSet.slug },
        search: { id },
        resetScroll: false,
        ...(id
          ? {
              mask: {
                to: "/photos/$slug/$id",
                params: { slug: photoSet.slug, id },
                unmaskOnReload: true,
              },
            }
          : {}),
      });
    },
    [mode, navigate, photoSet],
  );

  const navigateToNext = useCallback(() => {
    if (selectedPhotoIndex >= 0 && selectedPhotoIndex < photos.length - 1) {
      haptic("selection");
      navigateToPhoto(photos[selectedPhotoIndex + 1].id);
    }
  }, [haptic, navigateToPhoto, photos, selectedPhotoIndex]);

  const navigateToPrevious = useCallback(() => {
    if (selectedPhotoIndex > 0) {
      haptic("selection");
      navigateToPhoto(photos[selectedPhotoIndex - 1].id);
    }
  }, [haptic, navigateToPhoto, photos, selectedPhotoIndex]);

  const handleDismiss = useCallback(() => {
    haptic("light");
    navigateToPhoto(undefined);
  }, [haptic, navigateToPhoto]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedPhotoId || e.repeat) return;
      if (e.key === "ArrowRight") {
        navigateToNext();
      } else if (e.key === "ArrowLeft") {
        navigateToPrevious();
      }
    },
    [selectedPhotoId, navigateToNext, navigateToPrevious],
  );

  const bindDragGesture = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const swipeThreshold = window.innerWidth * 0.3;
      if (!active) {
        if (Math.abs(mx) > swipeThreshold || Math.abs(vx) > 0.5) {
          if (dx === 1) {
            navigateToPrevious();
          } else if (dx === -1) {
            navigateToNext();
          }
        }
      }
    },
    {
      axis: "x",
      filterTaps: true,
      rubberband: true,
      swipe: {
        velocity: 0.5,
      },
    },
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!selectedPhoto) return null;

  return (
    <Lightbox isOpen={true} onDismiss={handleDismiss}>
      <div {...bindDragGesture()} className="w-full h-full touch-pan-y">
        <LightboxPhoto
          key={selectedPhoto.id}
          photo={selectedPhoto}
          thumbnailSrc={thumbnailSrcById?.[selectedPhoto.id]}
        />
      </div>
    </Lightbox>
  );
}
