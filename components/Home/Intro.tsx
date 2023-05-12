import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import { useState } from "react";
import { VerifiedIcon } from "../Icons";
import { mdxComponents } from "../Prose";
import { Tooltip } from "../Tooltip";

export default function Intro({ content }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <dl className="list-container">
      <dt className="list-title pb-4 leading-relaxed sm:pb-0">
        <h1 className="flex items-center gap-1 text-neutral-800 dark:text-white">
          <Link href="/" className="[font-variation-settings:'wght'_550]">
            Fabian Schultz
          </Link>
          <div className="relative">
            <Tooltip open={tooltipOpen}>Verified, trust me</Tooltip>
            <VerifiedIcon
              size={16}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            />
          </div>
        </h1>
        <h2 className="text-neutral-500 dark:text-silver-dark">
          Product Designer
        </h2>
      </dt>
      <dd className="list-content">
        <MDXRemote {...content} components={mdxComponents} />
      </dd>
    </dl>
  );
}
