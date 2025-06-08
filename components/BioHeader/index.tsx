import Image from "next/image";
import { LinkButton, LinkExternal } from "../Links";
import { ArrowLeftIcon, DocumentIcon } from "../Icons";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RESUME_URL } from "../../pages/work";

export function BioHeader({ backButton = false }) {
  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {backButton ? (
            <motion.div
              key="back-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link
                href="/work"
                className="group relative isolate flex items-center justify-center w-9 h-9"
              >
                <span className="absolute inset-0 rounded-full bg-neutral-200/60 transition-all duration-100 ease-out-expo dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-200 group-hover:scale-[1.05] z-0" />
                <span className="relative z-10 flex items-center justify-center">
                  <ArrowLeftIcon size={16} />
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Image
                src="https://images.ctfassets.net/zgqdqhjfxb5o/7EvkFEIlCs1AZcwe0l6G2p/f72c3d9f3ab3393a9aee3d527918e6af/v3.5_blue_small.jpg?w=72&h=72"
                alt="Work"
                width={36}
                height={36}
                className="rounded-full w-9 h-9 block"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col leading-tight">
          <span className="font-medium">Fabian Schultz</span>
          <span className="text-sm text-neutral-500 dark:text-silver-dark font-medium">
            Staff Product Designer at{" "}
            <LinkExternal href="https://www.contentful.com">
              Contentful
            </LinkExternal>
          </span>
        </div>
      </div>
      <LinkButton
        target="_blank"
        rel="noopener noreferrer"
        href={RESUME_URL}
        className="self-start sm:self-center hidden sm:block"
      >
        <DocumentIcon size={16} />
        Download resume
      </LinkButton>
    </header>
  );
}
