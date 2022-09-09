interface BadgeProps {
  isLive?: boolean;
  children: JSX.Element | string;
}

export default function Badge({ isLive = false, children }: BadgeProps) {
  return (
    <span className="badge">
      {isLive ? (
        <span
          className="relative flex w-2 h-2 items-center justify-center"
          aria-hidden
        >
          <span className="absolute inline-flex w-full h-full bg-red-600 rounded-full opacity-85 dark:opacity-30 dark:bg-rose-400 animate-ping"></span>
          <span className="relative inline-flex w-1 h-1 bg-red-600 rounded-full dark:bg-rose-400"></span>
        </span>
      ) : null}
      {children}
    </span>
  );
}
