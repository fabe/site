import Image from "next/image";

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
}

const FALLBACK_COVER =
  "data:image/svg+xml,%0A%3Csvg fill='none' height='160' viewBox='0 0 112 160' width='112' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h112v160h-112z' fill='%2318181b'/%3E%3Cg fill='%23e2e8f0' fill-opacity='.15'%3E%3Ccircle cx='56' cy='57' r='34'/%3E%3Ccircle cx='56' cy='102' r='34'/%3E%3C/g%3E%3C/svg%3E";

export default function MediaCard({
  title,
  subtitle,
  image,
  href,
  hrefLabel,
  loading,
}: MediaCardProps) {
  const loadingComponent = (
    <div
      className="group flex animate-pulse items-center gap-4"
      title="Loading..."
    >
      <div className="relative">
        <div className="relative">
          <span className="block h-12 w-12 rounded bg-gray-200 opacity-70 dark:bg-zinc-900 dark:opacity-100"></span>
        </div>
      </div>

      <div className="w-full">
        <span className="mb-2 block h-5 w-1/2 rounded bg-gray-200 opacity-70 dark:bg-zinc-900 dark:opacity-100"></span>
        <span className="block h-4 w-1/3 rounded bg-gray-200 opacity-70 dark:bg-zinc-900 dark:opacity-100"></span>
      </div>
    </div>
  );

  const cardComponent = (
    <div className="group flex items-center gap-4">
      <div className="relative">
        <div className="relative z-10 origin-center drop-shadow-md transition-transform group-hover:scale-110">
          <Image
            alt={image?.alt || ""}
            title={title}
            className={`truncate ${
              image?.radius === MediaCardImageRadius.Book
                ? "rounded-l-sm rounded-r"
                : "rounded"
            } bg-gray-200 dark:bg-zinc-600`}
            src={image?.src || FALLBACK_COVER}
            width={image?.width}
            height={image?.height}
            priority={false}
          />
        </div>

        <div
          className="absolute left-0 top-0 z-0 opacity-50 blur-lg transition-opacity group-hover:opacity-30 dark:opacity-30 dark:group-hover:opacity-20"
          aria-hidden="true"
        >
          <Image
            alt=""
            src={image?.src || FALLBACK_COVER}
            width={image?.width}
            height={image?.height}
            priority={false}
          />
        </div>
      </div>

      <div className="w-full truncate transition-transform group-hover:translate-x-0.5">
        <div className="truncate">{title}</div>
        <div className="truncate text-sm slashed-zero text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
          {subtitle}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return loadingComponent;
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        title={hrefLabel}
        rel="noopener noreferrer"
      >
        {cardComponent}
      </a>
    );
  }

  return cardComponent;
}
