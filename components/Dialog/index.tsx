"use client";

import { DialogContent, DialogOverlay } from "@reach/dialog";
import { CloseIcon } from "../Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface DialogProps {
  children: ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
}

export default function Dialog({ children, isOpen, onDismiss }: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <DialogOverlay
          isOpen={isOpen}
          onDismiss={(e) => {
            // Only allow ESC key to close the dialog
            if (e.type === "keydown") {
              onDismiss();
            }
          }}
          className="!p-0 !m-0 fixed transform-gpu"
          style={{ background: "transparent", backdropFilter: "none" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col"
          >
            {/* Base overlay that covers viewport */}
            <div className="fixed inset-0 bg-gray-50/80 dark:bg-neutral-900/80 transform-gpu backdrop-blur-[50px] backdrop-saturate-[2]"></div>

            {/* Close button - always visible */}
            <div className="fixed top-0 right-0 m-4 z-[60]">
              <button
                onClick={onDismiss}
                className="transition-all duration-200 ease-out flex items-center justify-center rounded-full w-8 h-8 bg-neutral-900/40 hover:bg-neutral-900/60 dark:bg-white/15 dark:hover:bg-white/20 text-white backdrop-blur-xl transform-gpu"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Content container */}
            <DialogContent
              aria-label="Dialog content"
              className="!bg-transparent !border-0 !shadow-none !m-0 !p-0 flex-1 overflow-auto relative z-[55]"
              style={{ background: "transparent" }}
            >
              <div className="min-h-screen py-16">
                <div className="bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-[50px] backdrop-saturate-[2] absolute inset-0 -z-10"></div>
                <div className="flex justify-center relative">
                  <div className="w-full max-w-2xl px-4">{children}</div>
                </div>
              </div>
            </DialogContent>
          </motion.div>
        </DialogOverlay>
      )}
    </AnimatePresence>
  );
}
