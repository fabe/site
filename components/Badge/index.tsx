import { LockIcon } from "../Icons";

interface BadgeProps {
  isLive?: boolean;
  isPrivate?: boolean;
  isFeatured?: boolean;
  children: JSX.Element | string;
  border?: boolean;
}

export default function Badge({
  isLive = false,
  isPrivate = false,
  isFeatured = false,
  children,
  border = false,
}: BadgeProps) {
  return (
    <div
      className={`badge ${
        border && `border border-gray-900/5 bg-transparent dark:border-white/10`
      } ${
        isPrivate &&
        `dark:bg-orange-500 bg-orange-200 dark:text-white text-orange-800`
      } ${
        isFeatured &&
        `bg-amber-500 dark:bg-amber-500/15 dark:text-amber-500 text-white`
      }`}
    >
      {isPrivate ? <LockIcon size={12}></LockIcon> : null}
      {isLive ? (
        <div
          className="relative flex h-2 w-2 items-center justify-center"
          aria-hidden
        >
          <div className="opacity-85 absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 dark:bg-rose-400 dark:opacity-30"></div>
          <div className="relative inline-flex h-1 w-1 rounded-full bg-red-600 dark:bg-rose-400"></div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
