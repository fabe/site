interface BadgeProps {
  isLive?: boolean;
  children: JSX.Element | string;
  border?: boolean;
}

export default function Badge({
  isLive = false,
  children,
  border = false,
}: BadgeProps) {
  return (
    <span
      className={`badge ${
        border && `border border-gray-900/5 bg-transparent dark:border-white/10`
      }`}
    >
      {isLive ? (
        <span
          className="relative flex h-2 w-2 items-center justify-center"
          aria-hidden
        >
          <span className="opacity-85 absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 dark:bg-rose-400 dark:opacity-30"></span>
          <span className="relative inline-flex h-1 w-1 rounded-full bg-red-600 dark:bg-rose-400"></span>
        </span>
      ) : null}
      {children}
    </span>
  );
}
