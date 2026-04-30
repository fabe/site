import { PlusIcon } from "../Icons";
import { useHaptics } from "../../lib/useHaptics";

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
  const { trigger: haptic } = useHaptics();

  return (
    <button
      className="group inline-flex items-center justify-between gap-4 rounded-full bg-surface-raised/70 py-2 pl-6 pr-2 text-sm text-heading outline-2 outline-offset-2 outline-indigo-500 [font-variation-settings:'opsz'_15,_'wght'_600] focus-visible:outline dark:bg-surface/75 dark:hover:bg-neutral-700/50 sm:text-base"
      onClick={() => {
        haptic("light");
        onClick();
      }}
    >
      <span className="line-clamp-1">{children}</span>
      <span className="flex">
        {imageSrc ? (
          <img
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
