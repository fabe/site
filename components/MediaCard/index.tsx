import Image from "next/future/image";

interface MediaCardProps {
  image: {
    alt?: string;
    title?: string;
    src: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle: string;
  href?: string;
  hrefLabel?: string;
}

export default function MediaCard({
  title,
  subtitle,
  image,
  href,
  hrefLabel,
}: MediaCardProps) {
  const cardComponent = (
    <div className="flex items-center gap-4 group">
      <div className="relative">
        <div className="relative z-10 drop-shadow-md group-hover:scale-110 origin-center transition-transform">
          <Image
            alt={image.alt || ""}
            title={title}
            className="bg-gray-200 rounded dark:bg-zinc-600"
            src={image.src || ""}
            width={image.width}
            height={image.height}
          />
        </div>

        <div
          className="absolute top-0 left-0 z-0 dark:opacity-10 opacity-20 blur-lg dark:group-hover:opacity-30 group-hover:opacity-50 transition-opacity"
          aria-hidden="true"
        >
          <Image
            alt=""
            src={image.src || ""}
            width={image.width}
            height={image.height}
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
