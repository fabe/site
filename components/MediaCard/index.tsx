import Image from "next/image";
import { Transition } from "@headlessui/react";

export enum MediaCardImageRadius {
  Default = "default",
  Book = "book",
}

interface MediaCardProps {
  image?: {
    alt?: string;
    title?: string;
    src: string;
    width: number;
    height: number;
    radius?: MediaCardImageRadius;
  };
  title?: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  loading?: boolean;
  borderTop?: boolean;
}

const FALLBACK_COVER =
  "data:image/svg+xml,%0A%3Csvg fill='none' height='112' viewBox='0 0 112 112' width='112' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h112v112h-112z' fill='%2318181b'/%3E%3Cg fill='%23e2e8f0' fill-opacity='.15'%3E%3Ccircle cx='56' cy='56' r='28'/%3E%3C/g%3E%3C/svg%3E";

export default function MediaCard({
  title,
  subtitle,
  image,
  href,
  hrefLabel,
  loading,
  borderTop,
}: MediaCardProps) {
  const loadingComponent = (
    <div
      className={`flex items-center gap-4 ${
        borderTop
          ? `border-t border-solid border-neutral-800/10 pt-4 dark:border-white/5`
          : ""
      }`}
      title="Loading..."
    >
      <div className="relative flex-shrink-0">
        <div className="relative w-12 h-12">
          <span className="block h-full w-full rounded bg-gray-200 opacity-70 dark:bg-neutral-800 dark:opacity-100 animate-pulse"></span>
        </div>
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center gap-2 py-0.5">
        <span className="block h-5 w-1/2 rounded bg-gray-200 opacity-70 dark:bg-neutral-800 dark:opacity-100 animate-pulse"></span>
        <span className="block h-4 w-1/3 rounded bg-gray-200 opacity-70 dark:bg-neutral-800 dark:opacity-100 animate-pulse"></span>
      </div>
    </div>
  );

  // Remove hover effects if href is not set
  const cardComponent = (
    <div
      className={`flex items-center gap-4 min-w-0 ${href ? "group" : ""} ${
        borderTop
          ? `border-t border-solid border-neutral-500/10 pt-4 dark:border-white/5`
          : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`relative w-12 origin-center drop-shadow-md transition-transform${
            href ? " group-hover:scale-110" : ""
          }`}
        >
          <Image
            alt={image?.alt || ""}
            title={title}
            className={`truncate ${
              image?.radius === MediaCardImageRadius.Book
                ? "rounded-l-sm rounded-r"
                : "rounded"
            } bg-gray-200 dark:bg-zinc-600 w-12`}
            src={image?.src || FALLBACK_COVER}
            width={image?.width || 112}
            height={image?.height || 160}
            priority={false}
          />
        </div>
      </div>

      <div
        className={`min-w-0 flex-1 flex flex-col overflow-hidden transition-transform${
          href ? " group-hover:translate-x-0.5" : ""
        }`}
      >
        <div className="truncate min-w-0">{title}</div>
        <div className="truncate min-w-0 text-sm slashed-zero text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark pr-4">
          {subtitle}
        </div>
      </div>
    </div>
  );

  const wrappedCardComponent = href ? (
    <a
      href={href}
      {...(href.startsWith("http") && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      title={hrefLabel}
      className="min-w-0"
    >
      {cardComponent}
    </a>
  ) : (
    cardComponent
  );

  return (
    <div className="relative grid min-w-0">
      <Transition
        show={loading !== true}
        unmount={false}
        enter="transition-opacity duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="col-start-1 row-start-1 min-w-0">
          {wrappedCardComponent}
        </div>
      </Transition>
      <Transition
        show={loading === true}
        unmount={false}
        enter="transition-opacity duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="col-start-1 row-start-1 min-w-0">
          {loadingComponent}
        </div>
      </Transition>
    </div>
  );
}
