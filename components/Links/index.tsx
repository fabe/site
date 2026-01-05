import Link from "next/link";
import { useState } from "react";
import { ExternalIcon, CopyIcon } from "../Icons";
import { Tooltip } from "../Tooltip";
import useCopy from "@react-hook/copy";

export function LinkExternal({ href, children }) {
  return (
    <a
      className="link link-external"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span style={{ wordBreak: "break-word" }}>
        {children}
        <ExternalIcon size={16} className="inline ml-0.5 mb-0.5" />
      </span>
    </a>
  );
}

export function LinkShare({ url, children, className = "" }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { copy } = useCopy(url);

  const onClick = async () => {
    await copy();
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <Tooltip open={tooltipOpen}>Link copied!</Tooltip>
      <button
        className={`group relative isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5 ${className}`}
        onClick={onClick}
      >
        <span className="absolute inset-0 rounded-lg bg-neutral-200/60 transition-all duration-100 ease-out-expo dark:bg-neutral-800/75 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-200 group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] z-0" />
        <span className="relative z-10 flex items-center gap-1 [font-variation-settings:'opsz'_14,'wght'_550] text-neutral-700 dark:text-silver-dark">
          <CopyIcon size={16} />
          {children}
        </span>
      </button>
    </div>
  );
}

export function LinkButton({ href, children, className = "", ...props }) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5 ${className}`}
      {...props}
    >
      <span className="absolute inset-0 rounded-lg bg-neutral-200/60 transition-all duration-100 ease-out-expo dark:bg-neutral-800/75 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-200 group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] z-0" />
      <span className="relative z-10 flex items-center gap-1 [font-variation-settings:'opsz'_14,'wght'_550] text-neutral-700 dark:text-silver-dark">
        {children}
      </span>
    </Link>
  );
}
