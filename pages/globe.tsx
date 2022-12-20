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

const initialViewState = {
  latitude: 52.39,
  longitude: 13.06,
  zoom: 2,
  bearing: 0,
  pitch: 0,
};

export default function GlobePage({}) {
  const [popupInfo, setPopupInfo] = useState(null);
  const [mode, setMode] = useState("light");
  const { data } = useQuery<PlacesQueryQuery>(QUERY_PLACES);

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
    []
  );

  // Handle dark mode
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  return (
    <>
      <SEO
        seo={{
          title: "Globe",
        }}
      />
      <div className="mask-gradient pointer-events-none absolute top-0 left-0 z-10 h-32 w-full bg-gradient-to-t from-white/0 to-white backdrop-blur-lg dark:from-neutral-950/0 dark:to-neutral-950 sm:h-48"></div>
      <div className="absolute left-4 top-4 z-20 md:left-1/2 md:top-8 md:-translate-x-1/2 md:text-center">
        <h1 className="dark:text-shadow pb-1 text-2xl tracking-tight text-neutral-900 [font-variation-settings:'wght'_450] dark:text-white sm:text-3xl">
          Globe
        </h1>
        <p className="dark:text-shadow text-sm tracking-tight text-neutral-500 dark:text-silver-dark">
          Places I’ve been to. Inspired by{" "}
          <a
            className="link"
            href="//conquer.earth"
            target="_blank"
            rel="noopener noreferrer"
          >
            conquer.earth
          </a>
        </p>
      </div>
      <div className="-mb-10 min-h-[95vh] sm:-mb-20">
        <Map
          initialViewState={initialViewState}
          {...settings}
          mapStyle={
            mode === "dark"
              ? "mapbox://styles/fschultz/ck6faw97927g61ioh30mxkgxl"
              : "mapbox://styles/mapbox/light-v9"
          }
          projection="globe"
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
