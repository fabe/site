import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React, { useCallback, useState } from "react";
import { QUERY_PHOTO_SET } from "@/graphql/queries";
import { Container } from "@/components/Layouts";
import Footer from "@/components/Footer";
import contentfulLoader from "@/lib/contentfulLoader";
import Lightbox from "@/components/Lightbox";
import LightboxPhoto from "@/components/Lightbox/Photo";
import Badge from "@/components/Badge";
import { LinkButton, LinkShare } from "@/components/Links";
import formatDate from "@/lib/formatDate";
import { ChevronLeft } from "@/components/Icons";
import { useDrag } from "@use-gesture/react";
import { useHaptics } from "@/lib/useHaptics";
import type { ColorData } from "@/lib/colorExtractor";
import type {
  Photo as GqlPhoto,
  PhotoSet as GqlPhotoSet,
} from "@/graphql/types/types.generated";
import { baseUrl } from "../../__root";

interface PhotoWithColors extends GqlPhoto {
  colors?: ColorData;
}

interface PhotoSetWithColors extends GqlPhotoSet {
  photos?: (PhotoWithColors | null)[];
}

const fetchPhotoSet = createServerFn()
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }) => {
    const { initializeApollo } = await import("@/graphql/client");
    const { extractColorsFromImage } = await import("@/lib/colorExtractor");

    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query({
      query: QUERY_PHOTO_SET,
      variables: { slug },
    });

    // Extract colors for each photo at load time
    const photos = data.photoSet.photos || [];
    const concurrency = 10;
    const photosWithColors: (PhotoWithColors | null)[] = [];
    for (let i = 0; i < photos.length; i += concurrency) {
      const chunk = photos.slice(i, i + concurrency);
      const processed = await Promise.all(
        chunk.map(async (p: GqlPhoto | null) => {
          if (!p?.url) return p as any;
          try {
            const colors = await extractColorsFromImage(p.url);
            return { ...p, colors } as PhotoWithColors;
          } catch {
            return p as any;
          }
        }),
      );
      photosWithColors.push(...processed);
    }

    const photoSetWithColors: PhotoSetWithColors = {
      ...data.photoSet,
      photos: photosWithColors,
    };

    return {
      photoSet: photoSetWithColors,
      siteSettings: data.siteSettings,
    };
  });

export const Route = createFileRoute("/photos/$slug/")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
  loader: async ({ params }) => {
    return await fetchPhotoSet({ data: { slug: params.slug } });
  },
  head: ({ loaderData }) => {
    const title = loaderData?.photoSet?.title || "Photo Set";
    return {
      meta: [
        { title: `${title} — Fabian Schultz` },
        { property: "og:title", content: `${title} — Fabian Schultz` },
      ],
    };
  },
  component: PhotoSetComponent,
});

function PhotoSetComponent() {
  const { photoSet, siteSettings } = Route.useLoaderData();
  const { id: selectedPhotoId } = Route.useSearch();
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();

  const relativeUrl = `/photos/${photoSet.slug}`;
  const url = `${baseUrl}${relativeUrl}`;

  const selectedPhotoIndex =
    photoSet.photos?.findIndex((photo) => photo?.id === selectedPhotoId) ?? -1;
  const selectedPhoto = selectedPhotoId
    ? photoSet.photos?.find((photo) => photo?.id === selectedPhotoId)
    : null;

  const navigateToNext = useCallback(() => {
    if (
      photoSet.photos &&
      selectedPhotoIndex >= 0 &&
      selectedPhotoIndex < photoSet.photos.length - 1
    ) {
      const nextPhoto = photoSet.photos[selectedPhotoIndex + 1];
      if (nextPhoto) {
        haptic("selection");
        navigate({
          to: "/photos/$slug",
          params: { slug: photoSet.slug },
          search: { id: nextPhoto.id },
          replace: true,
          mask: {
            to: "/photos/$slug/$id",
            params: { slug: photoSet.slug, id: nextPhoto.id },
            unmaskOnReload: true,
          },
        });
      }
    }
  }, [navigate, photoSet.photos, photoSet.slug, selectedPhotoIndex]);

  const navigateToPrevious = useCallback(() => {
    if (photoSet.photos && selectedPhotoIndex > 0) {
      const prevPhoto = photoSet.photos[selectedPhotoIndex - 1];
      if (prevPhoto) {
        haptic("selection");
        navigate({
          to: "/photos/$slug",
          params: { slug: photoSet.slug },
          search: { id: prevPhoto.id },
          replace: true,
          mask: {
            to: "/photos/$slug/$id",
            params: { slug: photoSet.slug, id: prevPhoto.id },
            unmaskOnReload: true,
          },
        });
      }
    }
  }, [navigate, photoSet.photos, photoSet.slug, selectedPhotoIndex]);

  const handleDismiss = useCallback(() => {
    haptic("light");
    navigate({
      to: "/photos/$slug",
      params: { slug: photoSet.slug },
      search: { id: undefined },
      replace: true,
    });
  }, [navigate, photoSet.slug]);

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

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <Container>
        <div className="pb-3 sm:pb-6 relative">
          <div className="top-0 left-0 flex flex-row items-center mb-7 sm:mb-14">
            <LinkButton
              href="/photos"
              className="px-2 py-1.5 text-sm gap-1 items-center flex rounded-lg bg-gray-200 text-neutral-700 transition-colors [font-variation-settings:'opsz'_14,'wght'_400] hover:bg-gray-300 dark:bg-neutral-800 dark:text-silver-dark dark:hover:bg-neutral-700"
            >
              <ChevronLeft size={12} />
              Photos
            </LinkButton>
          </div>
          <header className="pb-5 sm:pb-16 text-center">
            <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
              {photoSet.title}
            </h1>
            <div className="pt-1.5">
              {photoSet.description && <p>{photoSet.description}</p>}
            </div>
          </header>

          <div className="flex w-full flex-row justify-between mt-2">
            <div className="flex flex-row items-center gap-2">
              <Link
                to="/"
                className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]"
              >
                <div>
                  <img
                    alt={siteSettings.siteTitle}
                    title={siteSettings.siteTitle}
                    className="rounded-full bg-gray-200 dark:bg-neutral-600"
                    src={siteSettings.avatar?.url || ""}
                    width={20}
                    height={20}
                  />
                </div>
              </Link>
              <Badge>{formatDate(photoSet.updatedAt)}</Badge>
            </div>
            <div className="relative">
              <LinkShare url={url}>Copy link</LinkShare>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
          {photoSet.photos?.map((photo) =>
            photo ? (
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                photoSet={photoSet}
              />
            ) : null,
          )}
        </div>
      </Container>

      {selectedPhoto && (
        <Lightbox isOpen={true} onDismiss={handleDismiss}>
          <div {...bindDragGesture()} className="w-full h-full touch-pan-y">
            <LightboxPhoto
              key={selectedPhoto.id}
              photo={selectedPhoto as any}
            />
          </div>
        </Lightbox>
      )}

      <Footer />
    </>
  );
}

function PhotoThumbnail({
  photo,
  photoSet,
}: {
  photo: PhotoWithColors;
  photoSet: PhotoSetWithColors;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();

  return (
    <button
      onClick={() => {
        haptic("light");
        navigate({
          to: "/photos/$slug",
          params: { slug: photoSet.slug },
          search: { id: photo.id },
          replace: true,
          mask: {
            to: "/photos/$slug/$id",
            params: { slug: photoSet.slug, id: photo.id },
            unmaskOnReload: true,
          },
        });
      }}
      className="group relative aspect-[3/4] overflow-hidden sm:[&:nth-child(15n-12)]:col-span-2 sm:last:col-span-2 after:shadow-border dark:after:shadow-none after:absolute after:w-full after:h-full after:z-10 cursor-pointer outline-none focus-visible:outline-none"
      style={{
        backgroundColor:
          photo.colors?.dominant ||
          `hsl(${(photo.id.charCodeAt(0) * 137.5) % 360}, 40%, 50%)`,
        background: photo.colors?.gradient || undefined,
      }}
    >
      <img
        src={contentfulLoader({
          src: photo.url,
          width: 1000,
          quality: 80,
        })}
        alt={photo.description || ""}
        className={`absolute inset-0 w-full h-full object-cover transition-all group-hover:brightness-75 group-hover:saturate-120 transform-gpu bg-gray-200 dark:bg-neutral-900 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-all duration-150`}
        onLoad={() => setImageLoaded(true)}
      />
    </button>
  );
}
