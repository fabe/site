import { Transition } from "@headlessui/react";
import { cn } from "@/lib/cn";

export enum MediaCardImageRadius {
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
      className={cn(
        "flex items-center gap-4",
        borderTop &&
          "border-t border-solid border-line/10 pt-4 dark:border-line/5",
      )}
      title="Loading..."
    >
      <div className="relative flex-shrink-0">
        <div className="relative w-12 h-12">
          <span className="block h-full w-full animate-pulse rounded bg-surface-raised opacity-70 dark:opacity-100"></span>
        </div>
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center gap-2 py-0.5">
        <span className="block h-5 w-1/2 animate-pulse rounded bg-surface-raised opacity-70 dark:opacity-100"></span>
        <span className="block h-4 w-1/3 animate-pulse rounded bg-surface-raised opacity-70 dark:opacity-100"></span>
      </div>
    </div>
  );

  // Remove hover effects if href is not set
  const cardComponent = (
    <div
      className={cn(
        "flex min-w-0 items-center gap-4",
        href && "group",
        borderTop &&
          "border-t border-solid border-line/10 pt-4 dark:border-line/5",
      )}
    >
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "relative w-12 origin-center drop-shadow-md transition-transform",
            href && "group-hover:scale-110",
          )}
        >
          <img
            alt={image?.alt || ""}
            title={title}
            className={cn(
              "w-12 truncate bg-surface-raised dark:bg-zinc-600",
              image?.radius === MediaCardImageRadius.Book
                ? "rounded-l-sm rounded-r"
                : "rounded",
            )}
            src={image?.src || FALLBACK_COVER}
            width={image?.width || 112}
            height={image?.height || 160}
            loading="lazy"
          />
        </div>
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 flex flex-col overflow-hidden transition-transform",
          href && "group-hover:translate-x-0.5",
        )}
      >
        <div className="truncate min-w-0">{title}</div>
        <div className="min-w-0 truncate pr-4 text-sm text-muted slashed-zero [font-variation-settings:'opsz'_14]">
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
