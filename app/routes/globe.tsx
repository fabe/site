import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React, { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import { QUERY_PLACES } from "@/graphql/queries";
import type { PlacesQueryQuery } from "@/graphql/types/types.generated";
import Badge from "@/components/Badge";
import { ExternalIcon } from "@/components/Icons";
import { baseUrl } from "./__root";

const initialViewState = {
  latitude: 51.5,
  longitude: 0.12,
  zoom: 0.7,
  bearing: 0,
  pitch: 0,
};

const fetchPlaces = createServerFn().handler(async () => {
  const { initializeApollo } = await import("@/graphql/client");
  const apolloClient = await initializeApollo();
  const { data } = await apolloClient.query<PlacesQueryQuery>({
    query: QUERY_PLACES,
  });
  return { places: data.places };
});

export const Route = createFileRoute("/globe")({
  loader: async () => {
    return await fetchPlaces();
  },
  head: () => ({
    meta: [
      { title: "Globe — Fabian Schultz" },
      { property: "og:title", content: "Globe — Fabian Schultz" },
      { property: "og:url", content: `${baseUrl}/globe` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/globe` }],
  }),
  component: GlobeComponent,
});

const LazyMap = React.lazy(() => import("@/components/GlobeMap"));

function GlobeComponent() {
  const { places } = Route.useLoaderData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="mask-gradient pointer-events-none absolute left-0 top-0 z-10 h-32 w-full bg-gradient-to-t from-white/0 to-white backdrop-blur-lg dark:from-neutral-900/0 dark:to-neutral-900 sm:h-48"></div>
      <div className="absolute left-4 top-4 z-20 md:left-1/2 md:top-8 md:-translate-x-1/2 md:text-center">
        <h1 className="dark:text-shadow pb-2 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
          Globe
        </h1>
      </div>
      <div className="relative min-h-[95vh]">
        <div className="absolute sm:w-auto w-11/12 left-1/2 bottom-24 -translate-x-1/2 z-10 text-sm p-3 rounded-2xl material-glass font-medium flex sm:flex-row flex-col gap-3 sm:gap-6 sm:items-center animate-bannerFadeIn opacity-0">
          <div className="flex gap-2 items-center">
            <Badge isFeatured>New</Badge>
            Want your own globe?
          </div>
          <a
            href="https://globe.cv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center justify-center px-3 py-2 leading-none bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-gray-50 dark:text-neutral-950 rounded-lg transition"
            aria-label="Visit Globe.cv website"
          >
            Visit Globe.cv
            <ExternalIcon size={16} aria-hidden="true" />
          </a>
        </div>
        {mounted && (
          <React.Suspense
            fallback={<div style={{ width: "100vw", height: "95vh" }} />}
          >
            <LazyMap places={places} initialViewState={initialViewState} />
          </React.Suspense>
        )}
      </div>
      <Footer />
    </>
  );
}
