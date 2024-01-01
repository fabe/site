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
      className="group/card text-left flex items-center py-6 gap-6 border-b border-solid border-neutral-500/10 dark:border-neutral-900 group-hover/cards:opacity-50 hover:!opacity-100 transition-opacity focus-visible:outline outline-2 outline-indigo-500 outline-offset-2 rounded"
    >
      {imageSrc ? (
        <div className="origin-center drop-shadow-md transition-transform shrink-0 sm:block hidden">
          <Image
            className="w-32 h-32 rounded"
            src={imageSrc}
            alt={imageAlt}
            width={128}
            height={128}
          />
        </div>
      ) : null}
      <div className="grow">
        <h3 className="text-base sm:text-lg [font-variation-settings:'opsz'_18,_'wght'_700] text-neutral-800 dark:text-white pb-1">
          {title}
        </h3>
        <p className="text-sm sm:text-base leading-normal">{subtitle}</p>
      </div>
      <div className="self-end">
        <Plus />
      </div>
    </button>
  );
}
