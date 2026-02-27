import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React, { useState } from "react";
import { Main } from "@/components/Layouts";
import { QUERY_PHOTO_SETS } from "@/graphql/queries";
import contentfulLoader from "@/lib/contentfulLoader";
import type { ColorData } from "@/lib/colorExtractor";
import type { PhotoSet } from "@/graphql/types/types.generated";
import { baseUrl } from "../__root";

interface PhotoSetWithColors extends PhotoSet {
  colors?: ColorData;
}

const fetchPhotoSets = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const { extractColorsFromImage } = await import("@/lib/colorExtractor");

  const apolloClient = await initializeApollo();
  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SETS,
  });

  // Extract colors from featured images during load (limited concurrency)
  const concurrency = 6;
  const photoSetsWithColors: PhotoSetWithColors[] = [];
  for (let i = 0; i < data.photoSets.length; i += concurrency) {
    const chunk = data.photoSets.slice(i, i + concurrency);
    const processed = await Promise.all(
      chunk.map(async (photoSet: PhotoSet) => {
        if (photoSet.featuredPhoto?.url) {
          try {
            const colors = await extractColorsFromImage(
              photoSet.featuredPhoto.url,
            );
            return { ...photoSet, colors } as PhotoSetWithColors;
          } catch {
            return photoSet as PhotoSetWithColors;
          }
        }
        return photoSet as PhotoSetWithColors;
      }),
    );
    photoSetsWithColors.push(...processed);
  }

  return { photoSets: photoSetsWithColors };
});

export const Route = createFileRoute("/photos/")({
  loader: async () => {
    return await fetchPhotoSets();
  },
  head: () => ({
    meta: [
      { title: "Photos — Fabian Schultz" },
      { name: "description", content: "Photo collections." },
      { property: "og:title", content: "Photos — Fabian Schultz" },
      { property: "og:description", content: "Photo collections." },
      { property: "og:url", content: `${baseUrl}/photos` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/photos` }],
  }),
  component: PhotosComponent,
});

function PhotosComponent() {
  const { photoSets } = Route.useLoaderData();

  return (
    <Main>
      <div className="flex items-center justify-between pb-6 sm:pb-12 gap-2">
        <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
          Photos
        </h1>
      </div>
      <div className="flex flex-col gap-8">
        {photoSets.map((photoSet: PhotoSetWithColors) => (
          <PhotoSetCard key={photoSet.id} photoSet={photoSet} />
        ))}
      </div>
    </Main>
  );
}

function PhotoSetCard({ photoSet }: { photoSet: PhotoSetWithColors }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const fallbackColor = `hsl(${
    (photoSet.id.charCodeAt(0) * 137.5) % 360
  }, 40%, 50%)`;
  const fallbackGradient = `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}dd)`;

  const computedBackgroundColor = photoSet.colors?.dominant || fallbackColor;
  const computedBackground = photoSet.colors?.gradient || fallbackGradient;

  return (
    <Link
      to={`/photos/${photoSet.slug}`}
      className="group relative aspect-[3/2] w-full overflow-hidden rounded-lg transition-all duration-300 ease-in-out dark:shadow-2xl"
      style={{
        backgroundColor: computedBackgroundColor,
        background: computedBackground,
      }}
    >
      {photoSet.featuredPhoto && (
        <img
          alt={photoSet.title}
          title={photoSet.title}
          src={contentfulLoader({
            src: photoSet.featuredPhoto.url,
            width: 1400,
            quality: 90,
          })}
          className={`absolute inset-0 w-full h-full object-cover will-change-transform group-hover:scale-[1.04] transition-all duration-300 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      )}

      {/* Fixed gradient overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
          imageLoaded
            ? "from-black/60 via-black/30"
            : "from-black/20 via-black/10"
        } to-transparent`}
      ></div>

      {/* Progressive blur overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] xs:h-[45%] sm:h-[30%] overflow-hidden">
        <div
          className={`absolute inset-0 ${
            imageLoaded
              ? "backdrop-blur-[5px] backdrop-brightness-[.85] backdrop-saturate-[1.1]"
              : "backdrop-blur-[2px] backdrop-brightness-[1] backdrop-saturate-[1.2]"
          }`}
          style={{
            mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        ></div>

        <div className="absolute bottom-0 w-full px-4 pb-4 sm:pb-6 pt-8 text-center">
          <h2 className="[font-variation-settings:'opsz'_32,_'wght'_500] text-2xl sm:text-3xl font-medium text-white transition-transform duration-300 ease-out pointer-fine:group-hover:translate-y-4">
            {photoSet.title}
          </h2>
          <p className="mx-auto mt-1 sm:mt-1.5 max-w-md line-clamp-2 text-white/80 transition-all duration-300 ease-out pointer-fine:group-hover:opacity-0 pointer-fine:group-hover:translate-y-2">
            {photoSet.description}
          </p>
        </div>
      </div>

      {/* White border on dark mode */}
      <div
        className={`pointer-events-none absolute inset-0 bg-transparent dark:border border-white/25 mix-blend-overlay rounded-lg`}
      ></div>
    </Link>
  );
}
