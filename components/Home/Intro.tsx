import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import { mdxComponents } from "../Prose";

export default function Intro({ content }) {
  return (
    <dl className="list-container">
      <dt className="list-title border-none pb-4 pt-0 leading-relaxed sm:pb-0">
        <h1 className="flex items-center gap-1 text-neutral-800 dark:text-white">
          <Link href="/" className="[font-variation-settings:'wght'_550]">
            Fabian Schultz
          </Link>
        </h1>
        <h2 className="text-neutral-500 dark:text-silver-dark">
          Product Designer
        </h2>
      </dt>
      <dd className="list-content border-none pt-0">
        <MDXRemote {...content} components={mdxComponents} />
      </dd>
    </dl>
  );
}
