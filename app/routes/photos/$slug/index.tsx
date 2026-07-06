import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { QUERY_PHOTO_SET } from "@/graphql/queries";
import { Container } from "@/components/Layouts";
import { PageTitle } from "@/components/Typography";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { LinkButton, LinkShare } from "@/components/Links";
import formatDate from "@/lib/formatDate";
import { ChevronLeft } from "@/components/Icons";
import LightboxPhoto from "@/components/Lightbox/Photo";
import { PhotoGrid } from "@/components/Photos/PhotoGrid";
import { PhotoLightbox } from "@/components/Photos/PhotoLightbox";
import type { ColorData } from "@/lib/colorExtractor";
import { PHOTO_FEED_SLUG } from "@/lib/photoFeed";
import photoImageLoader from "@/lib/photoImageLoader";
import type { PhotoSetQueryQuery } from "@/graphql/types/types.generated";
import { baseUrl } from "../../__root";

type PhotoSetData = NonNullable<PhotoSetQueryQuery["photoSet"]>;
type PhotoData = NonNullable<NonNullable<PhotoSetData["photos"]>[number]>;

type PhotoWithColors = PhotoData & {
  colors?: ColorData;
};

type PhotoSetWithColors = Omit<PhotoSetData, "photos"> & {
  photos: PhotoWithColors[];
};

const fetchPhotoSet = createServerFn()
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }) => {
    const { initializeApollo } = await import("@/graphql/client");
    const { extractColorsFromImage } = await import("@/lib/colorExtractor");

    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query<PhotoSetQueryQuery>({
      query: QUERY_PHOTO_SET,
      variables: { slug },
    });

    if (!data.photoSet) {
      return {
        photoSet: null,
        siteSettings: data.siteSettings,
      };
    }

    const photos =
      data.photoSet.photos?.filter((photo): photo is PhotoData =>
        Boolean(photo),
      ) ?? [];
    const concurrency = 10;
    const photosWithColors: PhotoWithColors[] = [];
    for (let i = 0; i < photos.length; i += concurrency) {
      const chunk = photos.slice(i, i + concurrency);
      const processed = await Promise.all(
        chunk.map(async (photo) => {
          try {
            const colors = await extractColorsFromImage(photo.url);
            return { ...photo, colors };
          } catch {
            return photo;
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
    if (params.slug === PHOTO_FEED_SLUG) {
      throw redirect({ to: "/photos", search: { id: undefined } });
    }

    const data = await fetchPhotoSet({ data: { slug: params.slug } });

    if (!data.photoSet) {
      const feedData = await fetchPhotoSet({ data: { slug: PHOTO_FEED_SLUG } });
      if (!feedData.photoSet) {
        throw new Error("Photo set not found");
      }

      const photo = feedData.photoSet.photos.find(
        (photo) => photo.id === params.slug,
      );

      if (!photo) {
        throw new Error("Photo set not found");
      }

      return { ...feedData, feedPhotoId: params.slug };
    }

    return { ...data, feedPhotoId: undefined };
  },
  head: ({ loaderData }) => {
    const photo = loaderData?.feedPhotoId
      ? loaderData.photoSet.photos.find(
          (photo) => photo.id === loaderData.feedPhotoId,
        )
      : null;
    const title =
      photo?.description || loaderData?.photoSet?.title || "Photo Set";

    if (photo) {
      const image = photoImageLoader({
        src: photo.url,
        width: 1200,
        quality: 90,
        custom: ["h=630", "fit=fill"],
      });

      return {
        meta: [
          { title: `${title} — Fabian Schultz` },
          { property: "og:title", content: `${title} — Fabian Schultz` },
          { property: "og:image", content: image },
          { property: "og:image:secure_url", content: image },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: title },
          { name: "twitter:title", content: `${title} — Fabian Schultz` },
          { name: "twitter:image", content: image },
          { name: "twitter:image:alt", content: title },
        ],
      };
    }

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
  const { photoSet, siteSettings, feedPhotoId } = Route.useLoaderData();
  const { id } = Route.useSearch();
  const selectedPhotoId = feedPhotoId || id;
  const [thumbnailSrcById, setThumbnailSrcById] = useState<
    Record<string, string>
  >({});
  const handleThumbnailLoad = useCallback((photoId: string, src: string) => {
    setThumbnailSrcById((current) =>
      current[photoId] === src ? current : { ...current, [photoId]: src },
    );
  }, []);

  const relativeUrl = `/photos/${photoSet.slug}`;
  const url = `${baseUrl}${relativeUrl}`;

  if (feedPhotoId) {
    const photo = photoSet.photos.find((photo) => photo.id === feedPhotoId);

    if (!photo) {
      throw new Error("Photo not found");
    }

    return (
      <>
        <div className="h-screen">
          <LightboxPhoto photo={photo} />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Container>
        <div className="pb-3 sm:pb-6 relative">
          <div className="top-0 left-0 flex flex-row items-center mb-7 sm:mb-14">
            <LinkButton href="/photos">
              <ChevronLeft size={12} />
              Photos
            </LinkButton>
          </div>
          <header className="pb-5 sm:pb-16 text-center">
            <PageTitle className="pb-0 sm:pb-0">{photoSet.title}</PageTitle>
            <div className="pt-1.5">
              {photoSet.description && <p>{photoSet.description}</p>}
            </div>
          </header>

          <div className="flex w-full flex-row justify-between mt-2">
            <div className="flex flex-row items-center gap-2">
              <Link
                to="/"
                className="flex flex-row items-center gap-2 font-medium"
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

        <PhotoGrid
          photos={photoSet.photos}
          photoSet={photoSet}
          mode="set"
          onThumbnailLoad={handleThumbnailLoad}
        />
      </Container>

      <PhotoLightbox
        photos={photoSet.photos}
        selectedPhotoId={selectedPhotoId}
        photoSet={photoSet}
        thumbnailSrcById={thumbnailSrcById}
        mode={feedPhotoId ? "feed" : "set"}
      />

      <Footer />
    </>
  );
}
