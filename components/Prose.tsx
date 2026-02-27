import React, { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LinkExternal } from "./Links";
import { ExternalIcon } from "./Icons";
import ImageLightbox from "./ImageLightbox";

// Prose components
export const ProseImage = ({
  src,
  alt,
  width,
  height,
  title = "",
  noMargin = false,
  zoomDisabled = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  noMargin?: boolean;
  zoomDisabled?: boolean;
}) => {
  return (
    <ImageLightbox
      src={src}
      alt={alt}
      width={width}
      height={height}
      title={title}
      noMargin={noMargin}
      zoomDisabled={zoomDisabled}
      lazy={true}
    />
  );
};

export const ProseImageToggle = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  title = "",
  href,
  noMargin = false,
}: {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  href?: string;
  noMargin?: boolean;
}) => {
  const [showDark, setShowDark] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setShowDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShowDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all([preloadImage(lightSrc), preloadImage(darkSrc)])
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to preload images:", err);
        setImagesLoaded(true);
      });
  }, [lightSrc, darkSrc]);

  const toggleMode = () => {
    setShowDark(!showDark);
  };

  if (!isClient) {
    return (
      <div className={`${noMargin ? "" : "my-6 sm:my-12"} relative`}>
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800/75">
          <img
            src={`${lightSrc}?w=1600&fm=webp`}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5" />
        </div>
        {title && <ProseCaption>{title}</ProseCaption>}
      </div>
    );
  }

  return (
    <div className={`${noMargin ? "" : "my-6 sm:my-12"} relative group`}>
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800/75">
        <img
          src={`${lightSrc}?w=1600&fm=webp`}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />

        <div
          className="absolute transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{
            top: "-1px",
            left: "-1px",
            width: "calc(100% + 2px)",
            height: "calc(100% + 2px)",
            clipPath: showDark ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          }}
        >
          <img
            src={`${darkSrc}?w=1600&fm=webp`}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5" />
      </div>

      <button
        onClick={toggleMode}
        className="absolute bottom-4 right-4 group/button isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5 disabled:opacity-50"
        title={`Switch to ${showDark ? "light" : "dark"} mode`}
        disabled={!imagesLoaded}
      >
        <span
          className={`absolute inset-0 rounded-lg transition-all duration-100 ease-out-expo group-hover/button:scale-x-[1.03] group-hover/button:scale-y-[1.08] z-0 ${
            !showDark ? "bg-neutral-700/75" : "bg-white/75"
          }`}
        />
        <span
          className={`relative z-10 flex items-center justify-center w-28 [font-variation-settings:'opsz'_14,'wght'_500] ${
            !showDark ? "text-white" : "text-neutral-700"
          }`}
        >
          {showDark ? "View light mode" : "View dark mode"}
        </span>
      </button>

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open original"
          className="absolute opacity-0 group-hover:opacity-100 top-4 right-4 transition-all duration-200 ease-out flex items-center justify-center rounded-full w-8 h-8 bg-neutral-900/40 hover:bg-neutral-900/60 dark:bg-white/5 dark:hover:bg-white/10 text-white focus:outline-white z-10"
        >
          <ExternalIcon size={18} />
        </a>
      )}

      {title && <ProseCaption>{title}</ProseCaption>}
    </div>
  );
};

export const ProseHeading = ({
  children,
  lessMargin = false,
}: {
  children: ReactNode;
  lessMargin?: boolean;
}) => {
  return (
    <h3
      className={`text-xl sm:mb-8 mb-6 text-neutral-900 dark:text-white ${
        lessMargin ? "mt-8 sm:mt-16" : "mt-12 sm:mt-20"
      } [font-variation-settings:'opsz'_36,_'wght'_500]`}
    >
      {children}
    </h3>
  );
};

export const ProseCaption = ({ children }: { children: ReactNode }) => {
  return (
    <figcaption className="text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4">
      {children}
    </figcaption>
  );
};

export const ProseSubHeading = ({ children }: { children: ReactNode }) => {
  return (
    <h4 className="mt-8 sm:mt-12 sm:mb-6 mb-4 text-neutral-900 dark:text-white font-medium flex items-center">
      {children}
      <span className="ml-4 flex-grow border-t border-neutral-500/10 dark:border-neutral-800/75" />
    </h4>
  );
};

export const ProjectHeader = ({
  title,
  description,
  image,
  category,
  details = {},
}: {
  title: string;
  description: string;
  image: string;
  category: string;
  details?: Record<string, string>;
}) => {
  const renderDescription = () => {
    const urlRegex =
      /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\b[a-z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})*\b)/gi;
    const parts = description.split(urlRegex);
    const filteredParts = parts.filter((part) => part && part.length > 0);

    return (
      <>
        {filteredParts.map((part, index) => {
          if (urlRegex.test(part)) {
            const href = /^(?:https?|ftp|file):\/\//i.test(part)
              ? part
              : `https://${part}`;
            return (
              <LinkExternal key={index} href={href}>
                {part}
              </LinkExternal>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className="mt-6 sm:mt-12">
      <div className="sm:text-center text-left sm:text-balance text-pretty">
        <h1 className="text-3xl sm:text-5xl text-neutral-800 [font-variation-settings:'opsz'_48,_'wght'_550] dark:text-white pb-4 tracking-tight pt-2">
          {title}
        </h1>
        <p className="dark:text-silver-dark text-neutral-500 sm:pb-12 pb-6">
          {renderDescription()}
        </p>
        {Object.keys(details).length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.entries(details).map(([key, value]) => (
              <dl
                key={key}
                className="col-span-3 sm:col-span-1 rounded-2xl bg-gray-100 dark:bg-neutral-800/75 p-4"
              >
                <dt className="text-neutral-500 dark:text-silver-dark text-sm capitalize">
                  {key}
                </dt>
                <dd className="font-medium">{String(value)}</dd>
              </dl>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <ProseImage
          src={image}
          alt={title}
          width={2048}
          height={1200}
          noMargin
          zoomDisabled
        />
      </div>
    </div>
  );
};

export const ProjectCard = ({
  title,
  description,
  link,
  year,
  company,
  category,
  image,
}: {
  title: string;
  description: string;
  link: string;
  year: string;
  company: string;
  category: string;
  image: string;
}) => {
  return (
    <Link
      to={link as any}
      className="group relative flex flex-col sm:grid sm:grid-cols-12 p-2 sm:pr-8 sm:gap-4 gap-2 rounded-3xl isolate sm:items-center"
    >
      <span className="absolute inset-0 rounded-3xl group-hover:rounded-[1.5rem] bg-white/80 dark:bg-neutral-800/75 dark:group-hover:bg-neutral-700/50 transition-all duration-200 ease-out-expo shadow-elevation-sm group-hover:scale-x-[1.01] group-hover:scale-y-[1.04] z-0" />
      <div className="relative sm:col-span-5 rounded-2xl">
        <div className="absolute top-3 left-3 z-10">
          <div className="badge bg-transparent text-white backdrop-blur-sm text-shadow-xs backdrop-saturate-150 backdrop-brightness-75">
            {category}
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden z-0">
          <img
            src={`${image}?w=1024&fm=webp`}
            alt={`${title} cover image`}
            width={2048}
            height={1200}
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute inset-0 pointer-events-none rounded-2xl box-border border border-neutral-800/5 dark:border-white/5" />
        </div>
      </div>

      <div className="flex flex-col justify-center sm:h-full sm:col-span-7 p-2 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{title}</span>
          <p className="text-sm text-neutral-500 dark:text-silver-dark text-pretty">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
