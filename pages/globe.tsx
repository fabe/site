import type { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { SEO } from "../components/SEO";
import { initializeApollo } from "../graphql/client";
import dynamic from "next/dynamic";
import * as topojson from "topojson-client";
import * as THREE from "three";
import { QUERY_PLACES } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { Place, PlacesQueryQuery } from "../graphql/types/types.generated";

const Globe = dynamic(import("react-globe.gl"), { ssr: false });
const THEME = {
  DARK: {
    background: "#070707",
    dots: "#9b9b9b",
  },
  LIGHT: {
    background: "#f5f6f7",
    dots: "#737373",
  },
};

const getTheme = (colorScheme) => {
  return colorScheme == "dark" ? THEME.DARK : THEME.LIGHT;
};

export default function GlobePage({}) {
  let height = 500;
  if (typeof window !== "undefined") {
    height = document.documentElement.clientHeight * 0.95;
  }

  const { data } = useQuery<PlacesQueryQuery>(QUERY_PLACES);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const placesArr = data.places.map((place) => {
      return {
        lat: place.location.lat,
        lng: place.location.lon,
      };
    });

    setPlaces(placesArr);
  }, []);

  const [mode, setMode] = useState("light");
  const theme = getTheme(mode);

  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

    // Setup dark/light mode for the first time
    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );

    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  const [landPolygons, setLandPolygons] = useState([]);
  const globeMaterial = new THREE.MeshBasicMaterial({
    color: theme.background,
    opacity: 0.8,
  });

  useEffect(() => {
    // load data
    fetch("//unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((landTopo) => {
        setLandPolygons(
          topojson.feature(landTopo, landTopo.objects.countries).features
        );
      });
  }, []);

  return (
    <>
      <SEO
        seo={{
          title: "Globe",
        }}
      />
      <div className="-mt-10 min-h-[95vh] sm:-mb-20">
        <Globe
          showAtmosphere={false}
          backgroundColor={"rgba(0,0,0,0)"}
          height={height}
          globeMaterial={globeMaterial}
          rendererConfig={{ antialias: false, alpha: true }}
          hexPolygonsData={landPolygons}
          hexPolygonResolution={3}
          hexPolygonMargin={0.65}
          hexPolygonColor={() => theme.dots}
          pointsData={places.slice(0, 2000)}
          pointAltitude={0.01}
          pointRadius={0.25}
          pointColor={() => "#1D8DF6"}
        />
      </div>
      <Footer />
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
