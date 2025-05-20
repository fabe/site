import Link from "next/link";
import { GithubIcon } from "../Icons";

export default function Footer() {
  return (
    <footer className="sm:px-0 flex w-full justify-center pt-12 sm:pt-20">
      <div className="max-w-main w-full">
        <div className="flex h-full w-full items-end justify-between border-t border-solid border-neutral-500/10 pt-4 sm:pt-8 dark:border-neutral-900">
          <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:pb-6 gap-4 sm:gap-0">
            <ul className="flex gap-4 sm:mb-0">
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
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/colophon" className="link-fade">
                  Colophon
                </Link>
              </li>
              <li className="flex items-center">
                <a
                  className="link-fade flex items-center gap-1.5"
                  href="//github.com/fabe/site"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon size={12} />
                  <span>
                    fabe
                    <span className="text-neutral-500/[.5] dark:text-silver-dark/[.5]">
                      /
                    </span>
                    site
                    <span className="hidden text-sm text-neutral-500/[.5] dark:text-silver-dark/[.5] sm:inline slashed-zero">
                      #
                      {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(
                        0,
                        7,
                      ) || "97540ec"}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
