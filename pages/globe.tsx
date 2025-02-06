import { useQuery } from "@apollo/client";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GetStaticProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import Footer from "../components/Footer";
import { SEO } from "../components/SEO";
import { initializeApollo } from "../graphql/client";
import { QUERY_PLACES } from "../graphql/queries";
import { PlacesQueryQuery } from "../graphql/types/types.generated";
import Link from "next/link";
import Badge from "../components/Badge";
import { ExternalIcon } from "../components/Icons";

const initialViewState = {
  latitude: 51.5,
  longitude: 0.12,
  zoom: 0.7,
  bearing: 0,
  pitch: 0,
};

export default function GlobePage({}) {
  const [popupInfo, setPopupInfo] = useState(null);
  const [mode, setMode] = useState("light");
  const { data } = useQuery<PlacesQueryQuery>(QUERY_PLACES);
  const mapRef = React.useRef();

  const [settings, _] = useState({
    scrollZoom: true,
    boxZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
    touchPitch: true,
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 0,
  });

  const pins = useMemo(
    () =>
      data.places.map((place, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={place.location.lon}
          latitude={place.location.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(place);
          }}
        >
          <div
            className={`h-4 w-4 cursor-pointer rounded-xl border-2 pin-${place.locationType.toLowerCase()} bg-clip-content p-0.5`}
          />
        </Marker>
      )),
    [],
  );

  // Handle dark mode
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  const onMapLoad = React.useCallback(() => {
    if (window.screen.width > 768) {
      // @ts-ignore
      mapRef.current.zoomTo(2.5);
    }
  }, []);

  return (
    <>
      <SEO
        seo={{
          title: "Globe",
          path: "/globe",
        }}
      />
      <div className="mask-gradient pointer-events-none absolute left-0 top-0 z-10 h-32 w-full bg-gradient-to-t from-white/0 to-white backdrop-blur-lg dark:from-neutral-950/0 dark:to-neutral-950 sm:h-48"></div>
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
            href="https://globe.gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center justify-center px-3 py-2 leading-none bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-gray-50 dark:text-neutral-950 rounded-lg transition"
          >
            Visit Globe Gallery
            <ExternalIcon size={16} />
          </a>
        </div>
        <Map
          ref={mapRef}
          onLoad={onMapLoad}
          initialViewState={initialViewState}
          {...settings}
          mapStyle={
            mode === "dark"
              ? "mapbox://styles/fschultz/ck6faw97927g61ioh30mxkgxl"
              : "mapbox://styles/mapbox/light-v9"
          }
          projection={{ name: "globe" }}
          style={{
            width: "100vw",
            height: "95vh",
          }}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        >
          {pins}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.location.lon)}
              latitude={Number(popupInfo.location.lat)}
              onClose={() => setPopupInfo(null)}
            >
              <div className="text-xs text-silver-dark">
                {popupInfo.locationType}
              </div>
              <div>{popupInfo.name}</div>
            </Popup>
          )}
        </Map>
      </div>
      <div className="flex justify-center px-4 pb-20 sm:pb-8">
        <div className="w-full max-w-main grow">
          <Footer />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_PLACES,
  });

  const cache = apolloClient.cache.extract();

  return {
    props: {
      initialApolloState: { ...cache },
    },
  };
};
