"use client";

import { DialogContent, DialogOverlay } from "@reach/dialog";
import { CloseIcon } from "../Icons";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  children: JSX.Element | string;
  isOpen: boolean;
  onDismiss: () => void;
}

export default function Dialog({ children, isOpen, onDismiss }: DialogProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogOverlay isOpen onDismiss={onDismiss}>
          <motion.div
            className="pt-16 px-3 pb-8 flex flex-col w-full items-center bg-neutral-950/[.30] dark:bg-neutral-800/[.40]"
            key="dialog"
            initial={{ opacity: 0, backdropFilter: "blur(0)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0)" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="flex flex-col items-center grow w-full max-w-7xl "
              key="dialog-content"
              initial={{ opacity: 0, translateY: "70%" }}
              animate={{ opacity: 1, translateY: "0" }}
              exit={{ opacity: 0, translateY: "0" }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <DialogContent>{children}</DialogContent>
              <div className="sticky top-4 self-end h-0 z-10 order-1">
                <button
                  onClick={onDismiss}
                  className="w-9 h-9 flex justify-center items-center sticky top-4 mr-5 mt-5 rounded-full dark:bg-neutral-800 bg-neutral-700 text-white outline-offset-2"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </DialogOverlay>
      )}
    </AnimatePresence>
  );
}
