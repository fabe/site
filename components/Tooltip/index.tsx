import { Transition } from "@headlessui/react";

export function Tooltip({ open, children }) {
  return (
    <div className="absolute bottom-auto left-1/2 top-0 -translate-x-1/2 translate-y-[calc(-100%-10px)] select-none pointer-coarse:hidden sm:bottom-0 sm:top-auto sm:-translate-y-[calc(-100%-10px)] z-10">
      <Transition
        show={open}
        enter="transition-all duration-200"
        enterFrom="opacity-0 -translate-y-1 scale-95 blur-sm"
        enterTo="opacity-100 translate-y-0 scale-100 blur-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-y-0 scale-100 blur-0"
        leaveTo="opacity-0 -translate-y-1 scale-95 blur-sm"
      >
        <div
          role="tooltip"
          className="whitespace-nowrap rounded bg-neutral-900 px-1.5 py-0.5 text-center text-xs font-medium text-silver [font-variation-settings:'opsz'_12] dark:bg-neutral-800/60 backdrop-blur-sm shadow-fancy dark:shadow-fancyDark"
        >
          {children}
        </div>
      </Transition>
    </div>
  );
}
