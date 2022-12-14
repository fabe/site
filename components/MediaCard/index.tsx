import Image from "next/image";

interface MediaCardProps {
  image?: {
    alt?: string;
    title?: string;
    src: string;
    width: number;
    height: number;
  };
  title?: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  loading?: boolean;
}

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
            className="truncate rounded bg-gray-200 dark:bg-zinc-600"
            src={image?.src || ""}
            width={image?.width}
            height={image?.height}
            priority={false}
          />
        </div>

        <div
          className="absolute top-0 left-0 z-0 opacity-50 blur-lg transition-opacity group-hover:opacity-30 dark:opacity-30 dark:group-hover:opacity-20"
          aria-hidden="true"
        >
          <Image
            alt=""
            src={image?.src || ""}
            width={image?.width}
            height={image?.height}
            priority={false}
          />
        </div>
      </div>

      <div className="w-full truncate transition-transform group-hover:translate-x-0.5">
        <div className="truncate">{title}</div>
        <div className="truncate text-sm slashed-zero tracking-sm text-neutral-500 dark:text-silver-dark">
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
