import Image from "next/future/image";

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
      className="flex items-center gap-4 group animate-pulse"
      title="Loading..."
    >
      <div className="relative">
        <div className="relative">
          <span className="block dark:opacity-100 opacity-70 bg-gray-200 rounded dark:bg-zinc-900 h-12 w-12"></span>
        </div>
      </div>

      <div className="w-full">
        <span className="block dark:opacity-100 opacity-70 bg-gray-200 rounded dark:bg-zinc-900 h-5 mb-2 w-1/2"></span>
        <span className="block dark:opacity-100 opacity-70 bg-gray-200 rounded dark:bg-zinc-900 h-4 w-1/3"></span>
      </div>
    </div>
  );

  const cardComponent = (
    <div className="flex items-center gap-4 group">
      <div className="relative">
        <div className="relative z-10 drop-shadow-md group-hover:scale-110 origin-center transition-transform">
          <Image
            alt={image?.alt || ""}
            title={title}
            className="bg-gray-200 rounded dark:bg-zinc-600 truncate"
            src={image?.src || ""}
            width={image?.width}
            height={image?.height}
            priority={false}
          />
        </div>

        <div
          className="absolute top-0 left-0 z-0 dark:opacity-30 opacity-50 blur-lg dark:group-hover:opacity-20 group-hover:opacity-30 transition-opacity"
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

      <div className="w-full truncate group-hover:translate-x-0.5 transition-transform">
        <div className="truncate">{title}</div>
        <div className="text-sm tracking-sm dark:text-silver-dark text-neutral-500 truncate">
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
