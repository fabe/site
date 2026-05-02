import { Link, type LinkProps } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { ExternalIcon, CopyIcon } from "../Icons";
import { Tooltip } from "../Tooltip";
import useCopy from "@react-hook/copy";
import { useHaptics } from "../../lib/useHaptics";
import { cn } from "../../lib/cn";

type ActionButtonContentProps = {
  children: ReactNode;
};

function ActionButtonContent({ children }: ActionButtonContentProps) {
  return (
    <>
      <span className="absolute inset-0 z-0 rounded-lg bg-surface-raised/60 transition-all duration-100 ease-out-expo group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] group-hover:bg-surface-raised dark:bg-surface/75 dark:group-hover:bg-surface" />
      <span className="relative z-10 flex items-center gap-1 text-neutral-700 font-ui-label dark:text-muted">
        {children}
      </span>
    </>
  );
}

type LinkExternalProps = {
  href: string;
  children: ReactNode;
  iconSize?: number;
  className?: string;
  contentClassName?: string;
};

export function LinkExternal({
  href,
  children,
  iconSize = 16,
  className = "",
  contentClassName = "",
}: LinkExternalProps) {
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

type LinkShareProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

export function LinkShare({ url, children, className = "" }: LinkShareProps) {
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

type ActionAnchorProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function ActionAnchor({
  href,
  children,
  className = "",
  target,
  rel,
}: ActionAnchorProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "group relative isolate flex items-center gap-1 px-2 py-1.5 text-sm leading-tight",
        className,
      )}
    >
      <ActionButtonContent>{children}</ActionButtonContent>
    </a>
  );
}

type LinkButtonProps = Omit<LinkProps, "to"> & {
  href: LinkProps["to"];
  children: ReactNode;
  className?: string;
};

export function LinkButton({
  href,
  children,
  className = "",
  ...props
}: LinkButtonProps) {
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
