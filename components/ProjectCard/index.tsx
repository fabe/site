import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  image?: {
    alt: string;
    src: string;
  };
  title?: string;
  subtitle?: string;
  href: string;
  fullWidth?: boolean;
}

export default function ProjectCard({
  title,
  subtitle,
  image,
  href,
  fullWidth,
}: ProjectCardProps) {
  return (
    <Link href={href} className={`block ${fullWidth ? "col-span-2" : null}`}>
      <div className="rounded-2xl border dark:border-white/5 border-500/10 sm:bg-gray-100  sm:dark:bg-white/[.06]">
        <div className="p-2 rounded-sm overflow-hidden relative">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={700}
              height={200}
              className="relative overflow-hidden rounded-lg"
            />
          ) : null}
        </div>
        <div className="p-8 gap-1.5 flex flex-col">
          <h2 className="text-xl [font-variation-settings:'opsz'_20,_'wght'_550]">
            {title}
          </h2>
          <span className="text-neutral-500 dark:text-silver-dark">
            {subtitle}
          </span>
        </div>
      </div>
    </Link>
  );
}
