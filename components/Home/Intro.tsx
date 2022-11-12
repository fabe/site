import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import { mdxComponents } from "../Prose";

export default function Intro({ content }) {
  return (
    <dl className="list-container">
      <dt className="list-title pb-4 sm:pb-0">
        <h1 className="flex text-neutral-900 [font-variation-settings:'wght'_520] dark:text-white">
          <Link href="/">Fabian Schultz</Link>
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
