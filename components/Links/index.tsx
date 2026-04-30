import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalIcon, CopyIcon } from "../Icons";
import { Tooltip } from "../Tooltip";
import useCopy from "@react-hook/copy";
import { useHaptics } from "../../lib/useHaptics";
import { cn } from "../../lib/cn";

function ActionButtonContent({ children }) {
  return (
    <>
      <span className="absolute inset-0 z-0 rounded-lg bg-surface-raised/60 transition-all duration-100 ease-out-expo group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] group-hover:bg-surface-raised dark:bg-surface/75 dark:group-hover:bg-surface" />
      <span className="relative z-10 flex items-center gap-1 text-neutral-700 [font-variation-settings:'opsz'_14,'wght'_550] dark:text-muted">
        {children}
      </span>
    </>
  );
}

export function LinkExternal({
  href,
  children,
  iconSize = 16,
  className = "",
  contentClassName = "",
}) {
  return (
    <a
      className={cn("link link-external", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
        className={contentClassName}
        style={{ wordBreak: contentClassName ? undefined : "break-word" }}
      >
        {children}
        <ExternalIcon size={iconSize} className="mb-0.5 ml-0.5 inline" />
      </span>
    </a>
  );
}

export function LinkShare({ url, children, className = "" }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { copy } = useCopy(url);
  const { trigger: haptic } = useHaptics();

  const onClick = async () => {
    await copy();
    haptic("success");
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <Tooltip open={tooltipOpen}>Link copied!</Tooltip>
      <button
        className={cn(
          "group relative isolate flex items-center gap-1 px-2 py-1.5 text-sm leading-tight",
          className,
        )}
        onClick={onClick}
      >
        <ActionButtonContent>
          <CopyIcon size={16} />
          {children}
        </ActionButtonContent>
      </button>
    </div>
  );
}

export function LinkButton({ href, children, className = "", ...props }) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative isolate flex items-center gap-1 px-2 py-1.5 text-sm leading-tight",
        className,
      )}
      {...props}
    >
      <ActionButtonContent>{children}</ActionButtonContent>
    </Link>
  );
}
