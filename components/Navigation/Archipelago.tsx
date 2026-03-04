import { Link, useLocation, useRouter, useRouterState } from "@tanstack/react-router";
import { Command } from "cmdk";
import { useState, useEffect } from "react";
import { useHaptics } from "../../lib/useHaptics";
import {
  CameraIcon,
  CursorIcon,
  EmailIcon,
  GlobeIcon,
  HomeIcon,
  MusicIcon,
  NavigationIcon,
  NoteIcon,
  ShieldIcon,
  SpinnerIcon,
  TwitterIcon,
} from "../Icons";
import { Transition } from "@headlessui/react";
import { Tooltip } from "../Tooltip";
import Badge from "../Badge";

enum TooltipState {
  HOME,
  MENU,
}

export default function Archipelago() {
  const location = useLocation();
  const router = useRouter();
  const currentRoute = location.pathname;
  const isHome = currentRoute === "/";
  const isTransitioning = useRouterState({ select: (s) => s.isTransitioning });
  const [showHomeButton, setShowHomeButton] = useState(!isHome && !isTransitioning);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | undefined>(undefined);
  const { trigger: haptic } = useHaptics();

  useEffect(() => {
    const shouldShow = !isHome && !isTransitioning;
    if (!shouldShow) {
      setShowHomeButton(false);
      return;
    }
    const timeout = setTimeout(() => setShowHomeButton(true), 300);
    return () => clearTimeout(timeout);
  }, [isHome, isTransitioning]);

  const navigate = async (href: string) => {
    if (!href) return;
    setLoading(true);
    haptic("selection");

    if (href.includes("mailto:")) {
      window.location.href = href;
    } else if (href.includes("//")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      await router.navigate({ to: href });
    }

    setLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    // Toggle the menu when ⌘K is pressed
    const down = (e: KeyboardEvent) => {
      if (e.keyCode === 75 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        haptic("light");
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Command.Dialog open={open} onOpenChange={setOpen} onValueChange={() => haptic("selection")}>
        <Command.Input placeholder="Go to..." />

        <Command.List>
          {loading && (
            <Command.Loading>
              <div>
                <SpinnerIcon size={24} />
              </div>
            </Command.Loading>
          )}

          <Command.Empty>Maybe someday...</Command.Empty>

          <Command.Group heading="Pages">
            <Command.Item onSelect={() => navigate("/")}>
              <div>
                <HomeIcon size={16} />
                Home
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/posts")}>
              <div>
                <NoteIcon size={16} />
                Posts
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/playlists")}>
              <div>
                <MusicIcon size={16} />
                Playlists
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/globe")}>
              <div>
                <GlobeIcon size={16} />
                Globe
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/photos")}>
              <div>
                <CameraIcon size={16} />
                Photos
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Portfolio">
            <Command.Item onSelect={() => navigate("/work")}>
              <div>
                <CursorIcon size={16} />
                Work
              </div>
              <Badge border>Private</Badge>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/patents")}>
              <div>
                <ShieldIcon size={16} />
                Patents
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Contact">
            <Command.Item onSelect={() => navigate("//x.com/supfabian")}>
              <div>
                <TwitterIcon size={16} />X
              </div>
            </Command.Item>
            <Command.Item
              onSelect={() => navigate("mailto:desk@fabianschultz.com")}
            >
              <div>
                <EmailIcon size={16} />
                Email
              </div>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      <nav
        className={`${
          showHomeButton ? "w-28" : "w-12"
        } fixed bottom-6 left-6 top-auto z-10 md:bottom-auto md:left-8 md:top-8 print:hidden`}
      >
        <div>
          <div className="relative flex h-12 gap-2">
            <Transition
              show={showHomeButton}
              enter="transition-all duration-500 ease-spring"
              enterFrom="opacity-0 scale-50 blur-md"
              enterTo="opacity-100 scale-100 blur-0"
              leave="transition-all duration-300 ease-in-out"
              leaveFrom="opacity-100 scale-100 blur-0"
              leaveTo="opacity-0 scale-50 blur-md"
            >
              <div
                className="absolute left-0 rounded-full"
                onMouseEnter={() => setTooltip(TooltipState.HOME)}
                onMouseLeave={() => setTooltip(undefined)}
              >
                <Tooltip open={tooltip === TooltipState.HOME}>Home</Tooltip>
                <Link to="/" className="island" onClick={() => haptic("light")}>
                  <span className="sr-only">Go home</span>
                  <HomeIcon size={20} />
                </Link>
              </div>
            </Transition>
            <div
              className={`duration-250 absolute rounded-full transition-all ease-out-expo ${
                showHomeButton ? "delay-50 left-14" : "left-0 delay-300"
              }`}
              onMouseEnter={() => setTooltip(TooltipState.MENU)}
              onMouseLeave={() => setTooltip(undefined)}
            >
              <Tooltip open={tooltip === TooltipState.MENU}>Menu</Tooltip>
              <button
                className="island"
                onClick={() => {
                  haptic("light");
                  setOpen((open) => !open);
                }}
              >
                <span className="sr-only">Open menu</span>
                <NavigationIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
