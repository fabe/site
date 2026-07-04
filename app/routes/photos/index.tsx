import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Filter } from "@/components/Filter";
import { Main } from "@/components/Layouts";
import { PageTitle } from "@/components/Typography";
import { PhotoGrid } from "@/components/Photos/PhotoGrid";
import { PhotoLightbox } from "@/components/Photos/PhotoLightbox";
import { QUERY_PHOTO_SET } from "@/graphql/queries";
import type { ColorData } from "@/lib/colorExtractor";
import { PHOTO_FEED_SLUG } from "@/lib/photoFeed";
import type { PhotoSetQueryQuery } from "@/graphql/types/types.generated";
import { baseUrl } from "../__root";

type PhotoSetData = NonNullable<PhotoSetQueryQuery["photoSet"]>;
type PhotoData = NonNullable<NonNullable<PhotoSetData["photos"]>[number]>;

type PhotoWithColors = PhotoData & {
  colors?: ColorData;
};

type PhotoSetWithColors = Omit<PhotoSetData, "photos"> & {
  photos: PhotoWithColors[];
};

function parsePhotoDate(photo: PhotoData) {
  const exif = photo.exif as { DateTimeOriginal?: string } | null | undefined;
  const value = exif?.DateTimeOriginal || photo.publishedAt;
  if (!value) return 0;

  return new Date(value.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")).getTime();
}

const fetchPhotoFeed = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const { extractColorsFromImage } = await import("@/lib/colorExtractor");

  const apolloClient = await initializeApollo();
  const { data } = await apolloClient.query<PhotoSetQueryQuery>({
    query: QUERY_PHOTO_SET,
    variables: { slug: PHOTO_FEED_SLUG },
  });

  if (!data.photoSet) {
    throw new Error("Photo feed not found");
  }

  const photos = [
    ...(data.photoSet.photos?.filter((photo): photo is PhotoData =>
      Boolean(photo),
    ) ?? []),
  ].sort((a, b) => parsePhotoDate(b) - parsePhotoDate(a));
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

  return {
    photoSet: {
      ...data.photoSet,
      photos: photosWithColors,
    } as PhotoSetWithColors,
  };
});

export const Route = createFileRoute("/photos/")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
  loader: async () => {
    return await fetchPhotoFeed();
  },
  head: () => ({
    meta: [
      { title: "Photos — Fabian Schultz" },
      { name: "description", content: "Photo feed." },
      { property: "og:title", content: "Photos — Fabian Schultz" },
      { property: "og:description", content: "Photo feed." },
      { property: "og:url", content: `${baseUrl}/photos` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/photos` }],
  }),
  component: PhotosComponent,
});

function PhotosComponent() {
  const navigate = useNavigate();
  const { photoSet } = Route.useLoaderData();
  const { id: selectedPhotoId } = Route.useSearch();

  return (
    <>
      <Main>
        <div className="mb-6 flex items-center justify-between gap-2 sm:mb-12">
          <PageTitle className="pb-0 sm:pb-0">Photos</PageTitle>
          <Filter
            label="Photo view"
            value="feed"
            onChange={(value) => {
              if (value === "sets") navigate({ to: "/photos/sets" });
            }}
            items={[
              { value: "feed", label: "Feed" },
              { value: "sets", label: "Sets" },
            ]}
          />
        </div>
        <PhotoGrid photos={photoSet.photos} mode="feed" />
      </Main>

      <PhotoLightbox
        photos={photoSet.photos}
        selectedPhotoId={selectedPhotoId}
        mode="feed"
      />
    </>
  );
}
