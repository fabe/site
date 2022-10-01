import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";

const components = {
  a: (props) => (
    <a className="link" target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

export default function Intro({ content }) {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h1 className="flex text-neutral-900 [font-variation-settings:'wght'_500] dark:text-white">
          <Link href="/">
            <a>Fabian Schultz</a>
          </Link>
        </h1>
        <h2 className="text-neutral-500 dark:text-silver-dark">
          Product Designer
        </h2>
      </dt>
      <dd className="list-content">
        <MDXRemote {...content} components={components} />
      </dd>
    </dl>
  );
}
