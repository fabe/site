import Link from "next/link";
import { useRouter } from "next/router";

export function Island() {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <>
      <nav className="opacity-0 animate-scale origin-left fixed bottom-8 left-1/2 -translate-x-1/2 px-1 py-1 dark:bg-white/[.02] dark:border-white/[.03] border-transparent border backdrop-blur-2xl rounded-full overflow-hidden dark:shadow-xl shadow-fancy z-10">
        <ul className="flex gap-2 rounded-full">
          <li>
            <Link href="/">
              <a
                className={`${
                  currentRoute === "/"
                    ? "dark:bg-white/[.05] bg-black/[.07]"
                    : ""
                } dark:hover:bg-white/[.02] hover:bg-black/[.03] px-6 py-2 rounded-full inline-flex active:scale-90 transition-all [font-variation-settings:'wght'_550] text-sm text-base-adjusted-sm`}
              >
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/posts">
              <a
                className={`${
                  currentRoute === "/posts"
                    ? "dark:bg-white/[.05] bg-black/[.07]"
                    : ""
                } dark:hover:bg-white/[.02] hover:bg-black/[.03] px-6 py-2 rounded-full inline-flex active:scale-90 transition-all [font-variation-settings:'wght'_550] text-sm text-base-adjusted-sm`}
              >
                Posts
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a
                className={`${
                  currentRoute === "/contact"
                    ? "dark:bg-white/[.05] bg-black/[.07]"
                    : ""
                } dark:hover:bg-white/[.02] hover:bg-black/[.03] px-6 py-2 rounded-full inline-flex active:scale-90 transition-all [font-variation-settings:'wght'_550] text-sm text-base-adjusted-sm`}
              >
                Contact
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
