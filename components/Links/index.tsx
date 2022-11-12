import Link from "next/link";
import { useState } from "react";
import { ShareIcon } from "../Icons";
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
      {children}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.667 11.333l6.666-6.666M4.667 4.667h6.666v6.666"
        ></path>
      </svg>
    </a>
  );
}

export function LinkBack({ href, children }) {
  return (
    <Link href={href}>
      <a className="link-back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {children}
      </a>
    </Link>
  );
}

export function LinkShare({ title, url, children }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { copy } = useCopy(url);

  const onClick = async () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          url,
        })
        .catch(console.error);
    } else {
      await copy();
      setTooltipOpen(true);

      setTimeout(() => {
        setTooltipOpen(false);
      }, 1000);
    }
  };

  return (
    <div className="relative">
      <Tooltip open={tooltipOpen}>Link copied!</Tooltip>
      <button className="link-share" onClick={onClick}>
        <ShareIcon size={16} />

        {children}
      </button>
    </div>
  );
}
