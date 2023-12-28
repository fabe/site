import Image from "next/image";
import { Plus } from "../Button";

interface SummaryCardProps {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function SummaryCard({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  onClick,
}: SummaryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left flex items-center py-6 gap-6 border-b border-solid border-neutral-500/10 dark:border-neutral-900"
    >
      {imageSrc ? (
        <Image
          className="w-32 h-32 shrink-0 rounded sm:block hidden"
          src={imageSrc}
          alt={imageAlt}
          width={135}
          height={135}
        />
      ) : null}
      <div className="grow">
        <h3 className="text-base sm:text-lg [font-variation-settings:'opsz'_18,_'wght'_700] text-neutral-800 dark:text-white pb-1">
          {title}
        </h3>
        <p className="text-sm sm:text-base">{subtitle}</p>
      </div>
      <div className="self-end">
        <Plus />
      </div>
    </button>
  );
}
