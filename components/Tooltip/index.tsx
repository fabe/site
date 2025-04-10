import { CSSTransitionGroup } from "react-transition-group";

export function Tooltip({ open, children }) {
  return (
    <CSSTransitionGroup
      className="absolute bottom-auto left-1/2 top-0 -translate-x-1/2 translate-y-[calc(-100%-10px)] select-none pointer-coarse:hidden sm:bottom-0 sm:top-auto sm:-translate-y-[calc(-100%-10px)] z-10"
      transitionName="tooltip"
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}
    >
      {open ? (
        <div
          role="tooltip"
          className="whitespace-nowrap rounded bg-neutral-900 px-1.5 py-0.5 text-center text-xs font-medium text-silver [font-variation-settings:'opsz'_12] dark:bg-neutral-800/60 backdrop-blur-sm shadow-fancy dark:shadow-fancyDark"
        >
          {children}
        </div>
      ) : null}
    </CSSTransitionGroup>
  );
}
