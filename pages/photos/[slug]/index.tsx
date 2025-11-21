import type { GetStaticProps, GetStaticPaths } from "next";
import React, { useCallback, useState } from "react";
import { QUERY_PHOTO_SET, QUERY_PHOTO_SET_IDS } from "../../../graphql/queries";
import { initializeApollo } from "../../../graphql/client";
import { baseUrl, SEO } from "../../../components/SEO";
import { Container } from "../../../components/Layouts";
import Image from "next/image";
import contentfulLoader from "../../../lib/contentfulLoader";
import Link from "next/link";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import Lightbox from "../../../components/Lightbox";
import LightboxPhoto from "../../../components/Lightbox/Photo";
import Badge from "../../../components/Badge";
import { LinkButton, LinkShare } from "../../../components/Links";
import formatDate from "../../../lib/formatDate";
import { ChevronLeft, CloseIcon } from "../../../components/Icons";
import { useDrag } from "@use-gesture/react";
import { extractColorsFromImage, ColorData } from "../../../lib/colorExtractor";
import {
  Photo as GqlPhoto,
  PhotoSet as GqlPhotoSet,
} from "../../../graphql/types/types.generated";

interface PhotoWithColors extends GqlPhoto {
  colors?: ColorData;
}

interface PhotoSetWithColors extends GqlPhotoSet {
  photos?: (PhotoWithColors | null)[];
}

export default function PhotoSet({
  photoSet,
  siteSettings,
}: {
  photoSet: PhotoSetWithColors;
  siteSettings: any;
}) {
  const router = useRouter();

  // URL for sharing
  const relativeUrl = `/photos/${photoSet.slug}`;
  const url = `${baseUrl}${relativeUrl}`;

  // Check if we have an ID in the query parameters
  const selectedPhotoId = router.query.id;
  const selectedPhotoIndex = photoSet.photos?.findIndex(
    (photo) => photo.id === selectedPhotoId,
  );
  const selectedPhoto = selectedPhotoId
    ? photoSet.photos?.find((photo) => photo.id === selectedPhotoId)
    : null;

  // Navigation handlers
  const navigateToNext = useCallback(() => {
    if (selectedPhotoIndex < photoSet.photos.length - 1) {
      const nextPhoto = photoSet.photos[selectedPhotoIndex + 1];
      router.replace(
        {
          pathname: router.pathname,
          query: { slug: photoSet.slug, id: nextPhoto.id },
        },
        `/photos/${photoSet.slug}/${nextPhoto.id}`,
        { scroll: false, shallow: true },
      );
    }
  }, [router, photoSet.photos, photoSet.slug, selectedPhotoIndex]);

  const navigateToPrevious = useCallback(() => {
    if (selectedPhotoIndex > 0) {
      const prevPhoto = photoSet.photos[selectedPhotoIndex - 1];
      router.replace(
        {
          pathname: router.pathname,
          query: { slug: photoSet.slug, id: prevPhoto.id },
        },
        `/photos/${photoSet.slug}/${prevPhoto.id}`,
        { scroll: false, shallow: true },
      );
    }
  }, [router, photoSet.photos, photoSet.slug, selectedPhotoIndex]);

  // Handler for closing the lightbox
  const handleDismiss = useCallback(() => {
    router.replace(`/photos/${photoSet.slug}`, undefined, {
      scroll: false,
      shallow: true,
    });
  }, [router, photoSet.slug]);

  // Handler for key navigation
  const handleKeyDown = useCallback(
    (e) => {
      // Only handle keyboard navigation when lightbox is open and not a repeat event
      if (!selectedPhotoId || e.repeat) return;

      if (e.key === "ArrowRight") {
        navigateToNext();
      } else if (e.key === "ArrowLeft") {
        navigateToPrevious();
      }
    },
    [selectedPhotoId, navigateToNext, navigateToPrevious],
  );

  // Gesture handler for swipe navigation
  const bindDragGesture = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], cancel }) => {
      const swipeThreshold = window.innerWidth * 0.3; // 30% of screen width

      if (!active) {
        // Only trigger when the gesture ends and we've moved enough or have sufficient velocity
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

  // Add event listener for keyboard navigation
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <SEO
        seo={{
          title: photoSet.title || "Photo Set",
          path: `/photos/${photoSet.slug}`,
        }}
      />

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
                href="/"
                className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]"
              >
                <div>
                  <Image
                    alt={siteSettings.siteTitle}
                    title={siteSettings.siteTitle}
                    className="rounded-full bg-gray-200 dark:bg-neutral-600"
                    src={siteSettings.avatar.url || ""}
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
          {photoSet.photos?.map((photo) => (
            <PhotoThumbnail
              key={photo.id}
              photo={photo}
              photoSet={photoSet}
              router={router}
            />
          ))}
        </div>
      </Container>

      {selectedPhoto && (
        <Lightbox isOpen={true} onDismiss={handleDismiss}>
          <div {...bindDragGesture()} className="w-full h-full touch-pan-y">
            <LightboxPhoto key={selectedPhoto.id} photo={selectedPhoto} />
          </div>
        </Lightbox>
      )}

      <div className="flex justify-center px-4 pb-20 sm:pb-8">
        <div className="w-full max-w-main grow">
          <Footer />
        </div>
      </div>
    </>
  );
}

function PhotoThumbnail({
  photo,
  photoSet,
  router,
}: {
  photo: PhotoWithColors;
  photoSet: PhotoSetWithColors;
  router: any;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: { slug: photoSet.slug, id: photo.id },
      }}
      as={`/photos/${photoSet.slug}/${photo.id}`}
      scroll={false}
      shallow
      replace
      className="group relative aspect-[3/4] overflow-hidden sm:[&:nth-child(15n-12)]:col-span-2 sm:last:col-span-2 after:shadow-border dark:after:shadow-none after:absolute after:w-full after:h-full after:z-10"
      style={{
        backgroundColor:
          photo.colors?.dominant ||
          `hsl(${(photo.id.charCodeAt(0) * 137.5) % 360}, 40%, 50%)`,
        background: photo.colors?.gradient || undefined,
      }}
    >
      <Image
        src={photo.url}
        alt={photo.description || ""}
        className={`object-cover transition-all group-hover:brightness-75 group-hover:saturate-120 transform-gpu bg-gray-200 dark:bg-neutral-900 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-all duration-150`}
        fill
        sizes="(min-width: 640px) min(50vw, 700px), min(100vw, 700px)"
        loader={contentfulLoader}
        quality={75}
        onLoad={() => setImageLoaded(true)}
      />
    </Link>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SET_IDS,
  });

  const paths = data.photoSets.map((photoSet) => ({
    params: { slug: photoSet.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SET,
    variables: {
      slug: params.slug,
    },
  });

  // Extract colors for each photo in the set at build time (limited concurrency)
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
    props: {
      photoSet: photoSetWithColors,
      siteSettings: data.siteSettings,
    },
  };
};
