import Link from "next/link";
import { useRouter } from "next/router";
import { Command } from "cmdk";
import { useState, useEffect } from "react";
import {
  EmailIcon,
  HomeIcon,
  NavigationIcon,
  NoteIcon,
  TwitterIcon,
} from "../Icons";
import { CSSTransitionGroup } from "react-transition-group";

export function Archipelago() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const [open, setOpen] = useState(false);
  const isHome = currentRoute === "/";

  const navigate = async (href) => {
    if (!href) return;

    if (href.includes("mailto:")) {
      window.location.href = href;
    } else if (href.includes("//")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (href === currentRoute) {
      await router.replace(href);
    } else {
      await router.push(href);
    }

    setOpen(false);
  };

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.keyCode === 75 && e.ctrlKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input placeholder="Go to..." />

        <Command.List>
          <Command.Empty>Maybe someday...</Command.Empty>

          <Command.Group heading="Pages">
            <Command.Item onSelect={() => navigate("/")}>
              <HomeIcon size={16} />
              Home
            </Command.Item>
            <Command.Item onSelect={() => navigate("/posts")}>
              <NoteIcon size={16} />
              Posts
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Contact">
            <Command.Item onSelect={() => navigate("//twitter.com/fschultz_")}>
              <TwitterIcon size={16} />
              Twitter
            </Command.Item>
            <Command.Item
              onSelect={() => navigate("mailto:desk@fabianschultz.com")}
            >
              <EmailIcon size={16} />
              Email
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      <nav className="opacity-0 animate-scale fixed md:bottom-8 md:left-8 bottom-4 left-4 z-10">
        <ul>
          <CSSTransitionGroup
            className="relative flex gap-2 h-[46px]"
            transitionName="island"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {!isHome ? (
              <li className="absolute left-0">
                <Link href="/">
                  <a title="Go home" className="island">
                    <span className="sr-only">Go home</span>
                    <HomeIcon size={20} />
                  </a>
                </Link>
              </li>
            ) : null}
            <li
              className={`absolute transition-all duration-250 ease-out-expo ${
                !isHome ? "left-14 delay-50" : "left-0 delay-300"
              }`}
            >
              <button
                title="Open menu"
                className="island"
                onClick={() => setOpen((open) => !open)}
              >
                <span className="sr-only">Open menu</span>
                <NavigationIcon size={20} />
              </button>
            </li>
          </CSSTransitionGroup>
        </ul>
      </nav>
    </>
  );
}
