import { CSSTransitionGroup } from "react-transition-group";

export function Tooltip({ open, children }) {
  return (
    <CSSTransitionGroup
      className="absolute left-1/2 bottom-0 -translate-x-1/2 -translate-y-[calc(-100%-10px)] pointer-coarse:hidden"
      transitionName="tooltip"
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}
    >
      {open ? (
        <div
          role="tooltip"
          className="whitespace-nowrap rounded border border-transparent bg-neutral-900 px-1.5 py-0.5 text-xs font-medium tracking-xs text-silver dark:border-white/[.08] dark:bg-black/[.96] dark:text-silver-dark"
        >
          {children}
        </div>
      ) : null}
    </CSSTransitionGroup>
  );
}
