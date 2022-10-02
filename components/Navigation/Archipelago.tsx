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
import { Tooltip } from "../Tooltip";

enum TooltipState {
  HOME,
  MENU,
}

export function Archipelago() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const isHome = currentRoute === "/";
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(undefined);

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

  useEffect(() => {
    // Prefetch menu
    router.prefetch("/posts");

    // Toggle the menu when ⌘K is pressed
    const down = (e) => {
      if (e.keyCode === 75 && e.ctrlKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

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

      <nav
        className={`${
          isHome ? "w-12" : "w-28"
        } fixed bottom-4 left-4 z-10 animate-scale opacity-0 md:top-8 md:left-8`}
      >
        <ul>
          <CSSTransitionGroup
            className="relative flex h-12 gap-2"
            transitionName="island"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {!isHome ? (
              <li
                className="absolute left-0 rounded-full"
                onMouseEnter={() => setTooltip(TooltipState.HOME)}
                onMouseLeave={() => setTooltip(undefined)}
              >
                <Tooltip open={tooltip === TooltipState.HOME}>Home</Tooltip>
                <Link href="/">
                  <a className="island" tabIndex={1}>
                    <span className="sr-only">Go home</span>
                    <HomeIcon size={20} />
                  </a>
                </Link>
              </li>
            ) : null}
            <li
              className={`duration-250 absolute rounded-full transition-all ease-out-expo ${
                !isHome ? "delay-50 left-14" : "left-0 delay-300"
              }`}
              onMouseEnter={() => setTooltip(TooltipState.MENU)}
              onMouseLeave={() => setTooltip(undefined)}
            >
              <Tooltip open={tooltip === TooltipState.MENU}>Menu</Tooltip>
              <button
                className="island"
                tabIndex={1}
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
