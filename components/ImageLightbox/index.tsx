"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  noMargin?: boolean;
  zoomDisabled?: boolean;
}

export default function ImageLightbox({
  src,
  alt,
  width,
  height,
  title = "",
  noMargin = false,
  zoomDisabled = false,
}: ImageLightboxProps) {
  // All hooks must be called before any conditional logic
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // On unmount, make sure to restore scroll
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // If zoom is disabled, render simple image without lightbox functionality
  if (zoomDisabled) {
    return (
      <div className={`${noMargin ? "" : "my-6 sm:my-12"}`}>
        <div
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900/75`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5"></div>
        </div>
        {title && (
          <figcaption className="text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4">
            {title}
          </figcaption>
        )}
      </div>
    );
  }

  const openLightbox = () => {
    if (imageRef.current) {
      document.body.style.overflow = "hidden";
      const rect = imageRef.current.getBoundingClientRect();
      setImageRect(rect);
      setIsOpen(true);
    }
  };

  const closeLightbox = () => setIsOpen(false);

  // Calculate the final dimensions and position for lightbox
  const calculateFinalTransform = () => {
    if (!imageRect) return { scale: 1, x: 0, y: 0 };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate maximum dimensions for lightbox (1024px max width, with padding)
    const maxWidth = Math.min(1024, viewportWidth - 64);
    const maxHeight = viewportHeight - 64;

    // Calculate aspect ratio
    const imageAspectRatio = width / height;

    // Calculate target dimensions maintaining aspect ratio
    let targetWidth = maxWidth;
    let targetHeight = targetWidth / imageAspectRatio;

    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = targetHeight * imageAspectRatio;
    }

    // Calculate scale factor based on original image rect
    const scale = Math.min(
      targetWidth / imageRect.width,
      targetHeight / imageRect.height,
    );

    // Calculate center position
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Calculate current center
    const currentCenterX = imageRect.left + imageRect.width / 2;
    const currentCenterY = imageRect.top + imageRect.height / 2;

    // Calculate translation needed
    const x = centerX - currentCenterX;
    const y = centerY - currentCenterY;

    return { scale, x, y };
  };

  // Lightbox content (backdrop + animated image clone)
  const lightboxContent = (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {isOpen && imageRect && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-50/80 dark:bg-neutral-950/80 backdrop-blur-[50px] backdrop-saturate-[2] z-40"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          />

          {/* Animated image clone */}
          <motion.div
            className="fixed rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900/75 cursor-zoom-out z-50"
            onClick={closeLightbox}
            initial={{
              left: imageRect.left,
              top: imageRect.top,
              width: imageRect.width,
              height: imageRect.height,
            }}
            animate={{
              ...calculateFinalTransform(),
            }}
            exit={{
              scale: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4,
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Original Image - stays in place */}
      <div className={`${noMargin ? "" : "my-6 sm:my-12"}`}>
        <div
          ref={imageRef}
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900/75 cursor-zoom-in transition-opacity duration-200 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
          onClick={openLightbox}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5"></div>
        </div>
        {title && (
          <figcaption className="text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4">
            {title}
          </figcaption>
        )}
      </div>

      {/* Render lightbox in portal */}
      {mounted && createPortal(lightboxContent, document.body)}
    </>
  );
}
