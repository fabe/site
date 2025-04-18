"use client";

import { DialogContent, DialogOverlay } from "@reach/dialog";
import { CloseIcon } from "../Icons";

interface LightboxProps {
  children: JSX.Element | string;
  isOpen: boolean;
  onDismiss: () => void;
}

export default function Lightbox({
  children,
  isOpen,
  onDismiss,
}: LightboxProps) {
  return (
    <>
      {isOpen && (
        <DialogOverlay isOpen onDismiss={onDismiss}>
          <div className="lg:px-8 lg:py-6 min-h-screen flex flex-col w-full items-center bg-neutral-950/40 dark:bg-neutral-800/40 backdrop-blur-lg backdrop-saturate-150 overflow-hidden overscroll-none">
            <div className="flex flex-col items-center grow w-full max-w-7xl h-full lg:rounded-lg overflow-auto lg:shadow-2xl overscroll-none">
              <DialogContent className="flex justify-center items-center overscroll-none">
                {children}
              </DialogContent>
              <div className="sticky top-0 self-end h-0 z-10 order-1">
                <button
                  onClick={onDismiss}
                  className="w-9 h-9 flex justify-center items-center sticky top-4 mr-5 mt-5 rounded-full dark:bg-neutral-700 bg-neutral-700 text-white outline-offset-2 dark:opacity-80 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        </DialogOverlay>
      )}
    </>
  );
}
