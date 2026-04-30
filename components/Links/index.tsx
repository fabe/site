import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalIcon, CopyIcon } from "../Icons";
import { Tooltip } from "../Tooltip";
import useCopy from "@react-hook/copy";
import { useHaptics } from "../../lib/useHaptics";
import { cn } from "../../lib/cn";

const actionButtonClass =
  "group relative isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5";
const actionButtonBackgroundClass =
  "absolute inset-0 rounded-lg bg-neutral-200/60 transition-all duration-100 ease-out-expo dark:bg-neutral-800/75 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-200 group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] z-0";
const actionButtonContentClass =
  "relative z-10 flex items-center gap-1 [font-variation-settings:'opsz'_14,'wght'_550] text-neutral-700 dark:text-silver-dark";

function ActionButtonContent({ children }) {
  return (
    <>
      <span className={actionButtonBackgroundClass} />
      <span className={actionButtonContentClass}>{children}</span>
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
        <ExternalIcon size={iconSize} className="inline ml-0.5 mb-0.5" />
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
      <button className={cn(actionButtonClass, className)} onClick={onClick}>
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
    <Link to={href} className={cn(actionButtonClass, className)} {...props}>
      <ActionButtonContent>{children}</ActionButtonContent>
    </Link>
  );
}
