import "mapbox-gl/dist/mapbox-gl.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, { Marker, Popup } from "react-map-gl";

interface Place {
  name: string;
  locationType: string;
  location: {
    lat: number;
    lon: number;
  };
}

interface GlobeMapProps {
  places: Place[];
  initialViewState: {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
  };
}

export default function GlobeMap({ places, initialViewState }: GlobeMapProps) {
  const [popupInfo, setPopupInfo] = useState<Place | null>(null);
  const [mode, setMode] = useState("light");
  const mapRef = useRef<any>(null);

  const [settings] = useState({
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
      places.map((place, index) => (
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
            aria-label={`${place.name}, ${place.locationType}`}
            role="button"
          />
        </Marker>
      )),
    [places],
  );

  // Handle dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setMode(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handler);
    setMode(mediaQuery.matches ? "dark" : "light");

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  const onMapLoad = useCallback(() => {
    if (window.screen.width > 768) {
      mapRef.current?.zoomTo(2.5);
    }
  }, []);

  return (
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
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_KEY}
    >
      {pins}

      {popupInfo && (
        <Popup
          className="cursor-default"
          anchor="top"
          longitude={Number(popupInfo.location.lon)}
          latitude={Number(popupInfo.location.lat)}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          aria-label={`Details about ${popupInfo.name}`}
        >
          <div className="text-xs text-silver-dark">
            {popupInfo.locationType}
          </div>
          <div>{popupInfo.name}</div>
        </Popup>
      )}
    </Map>
  );
}
