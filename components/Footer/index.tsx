import { Link } from "@tanstack/react-router";
import { GithubIcon } from "../Icons";

export default function Footer() {
  return (
    <footer className="flex w-full justify-center">
      <div className="w-full">
        <div className="box-border flex h-[5.75rem] w-full items-end justify-between border-t border-solid border-line/10 px-6 py-4 dark:border-line/5 sm:h-[4.5rem] sm:py-6">
          <div className="flex w-full flex-col sm:flex-row sm:justify-between items-end sm:items-start gap-3 sm:gap-0">
            <ul className="flex gap-4 sm:mb-0">
              <li>
                <Link to="/" className="link-fade">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts" className="link-fade">
                  Posts
                </Link>
              </li>
              <li>
                <Link to="/playlists" className="link-fade">
                  Playlists
                </Link>
              </li>
              <li>
                <Link to="/globe" className="link-fade">
                  Globe
                </Link>
              </li>
            </ul>
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/colophon" className="link-fade">
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
                    <span className="text-muted/50">/</span>
                    site
                    <span className="hidden text-sm text-muted/50 slashed-zero sm:inline">
                      #
                      {import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(
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
