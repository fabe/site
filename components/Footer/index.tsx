import Link from "next/link";
import { GithubIcon } from "../Icons";

export default function Footer() {
  return (
    <footer className="m:px-0 mt-10 flex w-full justify-center border-t border-solid border-neutral-200 dark:border-neutral-900 sm:mt-20">
      <div className="max-w-main flex-1">
        <div className="flex h-full w-full items-end justify-between gap-4 pt-8">
          <div className="flex-1">
            <ul className="flex flex-col pb-5">
              <li>
                <Link href="/" className="link-fade">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="link-fade">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="link-fade">
                  Playlists
                </Link>
              </li>
              <li>
                <Link href="/globe" className="link-fade">
                  Globe
                </Link>
              </li>
            </ul>
            <div className="flex gap-1.5 text-xs text-neutral-500 [font-variation-settings:'opsz'_12] dark:text-silver-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="16"
                fill="none"
                viewBox="0 0 7 16"
                className="fill-neutral-500 dark:fill-silver-dark"
              >
                <path d="M3 6.5h1v6l-.5 1-.5-1v-6z"></path>
                <path
                  fillRule="evenodd"
                  d="M3.5 6a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-1-3a.5.5 0 100-1 .5.5 0 000 1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Made in London, UK
            </div>
          </div>
          <div className="flex h-full flex-1 flex-col items-end justify-between">
            <div
              className="flex-1 select-none text-sm text-neutral-400 dark:text-neutral-700"
              aria-hidden="true"
              role="img"
            >
              We’re only here briefly.
            </div>
            <div className="flex gap-4">
              <Link href="/colophon" className="link link-sm">
                Colophon
              </Link>
              <a
                className="link link-sm flex items-center gap-1.5"
                href={
                  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
                    ? `//github.com/fabe/site/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`
                    : `//github.com/fabe/site`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon size={12} />
                <span>
                  fabe/site
                  <span className="font-mono text-neutral-500/[.5] dark:text-silver-dark/[.5]">
                    #
                    {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(
                      0,
                      7
                    ) || "97540ec"}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
