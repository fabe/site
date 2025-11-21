import Image from "next/image";
import { PlusIcon } from "../Icons";

interface RichButtonProps {
  imageSrc?: string;
  imageAlt?: string;
  children: JSX.Element | string;
  onClick: () => void;
}

export function Plus() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-indigo-500 dark:bg-indigo-500 shrink-0">
      <span className="group-hover:opacity-100 opacity-80">
        <PlusIcon size={20} />
      </span>
    </span>
  );
}

export function RichButton({
  children,
  onClick,
  imageSrc,
  imageAlt = "",
}: RichButtonProps) {
  return (
    <button
      className="group rounded-full inline-flex items-center justify-between gap-4 pl-6 pr-2 py-2 text-sm sm:text-base text-neutral-800 [font-variation-settings:'opsz'_15,_'wght'_600] dark:text-white dark:bg-neutral-800/75 dark:hover:bg-neutral-700/50 bg-gray-200/70 outline-2 outline-indigo-500 outline-offset-2 focus-visible:outline"
      onClick={onClick}
    >
      <span className="line-clamp-1">{children}</span>
      <span className="flex">
        {imageSrc ? (
          <Image
            className="rounded-full -mr-2"
            width={32}
            height={32}
            src={imageSrc}
            alt={imageAlt}
          />
        ) : null}
        <Plus />
      </span>
    </button>
  );
}
