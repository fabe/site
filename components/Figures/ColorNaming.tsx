import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colorPalette } from "./ColorPalette";
import { ProseCaption } from "../../pages/work";

// Helper function to find the hex color for a given color name
const getColorHex = (colorName: string, phase: string): string => {
  // Map old names to their numeric equivalents for color lookup
  const nameToNumber: { [key: string]: string } = {
    lightest: "100",
    light: "300",
    mid: "500",
    base: "700",
    dark: "800",
    darkest: "900",
  };

  // If it's the original phase, convert old names to numbers for color lookup
  const numericValue =
    phase === "original" ? nameToNumber[colorName] || colorName : colorName;

  for (const row of colorPalette) {
    for (const color of row) {
      if (color.name === `blue-${numericValue}`) {
        return color.hex;
      }
    }
  }
  return "#000000"; // fallback color
};

// Original items and their new names
const originalItems = [
  { old: "lightest", new: "100" },
  { old: "light", new: "300" },
  { old: "mid", new: "500" },
  { old: "base", new: "700" },
  { old: "dark", new: "800" },
  { old: "darkest", new: "900" },
];

// New items that get inserted between existing ones
const newItems = [
  { value: "200", insertAfter: 0 }, // After lightest/100
  { value: "400", insertAfter: 1 }, // After light/300
  { value: "600", insertAfter: 2 }, // After mid/500
];

export function ColorNamingAnimation() {
  const [phase, setPhase] = React.useState<"original" | "renamed" | "expanded">(
    "original",
  );
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const startAnimation = React.useCallback(async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPhase("original");

    // Wait 2 seconds, then crossfade to numbers
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPhase("renamed");

    // Wait 1.5 seconds, then expand with new items
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPhase("expanded");

    // Wait 2 seconds, then end
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnimating(false);
    setHasAnimated(true);
  }, [isAnimating]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && !isAnimating) {
          startAnimation();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startAnimation, hasAnimated, isAnimating]);

  // Generate the final list based on current phase
  const generateItems = () => {
    const items = originalItems.map((item, index) => ({
      id: `original-${index}`,
      text: phase === "original" ? item.old : item.new,
      isOriginal: true,
      originalIndex: index,
    }));

    if (phase === "expanded") {
      // Insert new items at the correct positions
      newItems.forEach((newItem) => {
        const insertIndex =
          newItem.insertAfter +
          1 +
          newItems.filter((ni) => ni.insertAfter < newItem.insertAfter).length;
        items.splice(insertIndex, 0, {
          id: `new-${newItem.value}`,
          text: newItem.value,
          isOriginal: false,
          originalIndex: -1,
        });
      });
    }

    return items;
  };

  const items = generateItems();

  return (
    <div className="my-6 sm:my-12">
      <div
        ref={containerRef}
        className="bg-gray-100 dark:bg-neutral-800 border border-neutral-800/5 dark:border-white/5 rounded-2xl py-4 sm:py-6 px-8 sm:px-12 relative"
      >
        {/* Left-aligned content with padding */}
        <div>
          <div className="flex flex-col justify-center items-start w-48 h-60">
            <AnimatePresence mode="sync">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={
                    item.isOriginal ? false : { opacity: 0, scale: 0.95 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    },
                    opacity: {
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                    scale: {
                      duration: 0.25,
                      ease: [0.34, 1.56, 0.64, 1],
                    },
                  }}
                  className="flex items-center leading-normal font-mono text-sm tabular-nums relative"
                >
                  {/* Color swatch - 12x12 icon */}
                  <div
                    className="w-3 h-3 rounded-sm mr-2 flex-shrink-0 border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: getColorHex(item.text, phase) }}
                  />

                  {/* Blue prefix and suffix together */}
                  <div className="flex">
                    <span>blue-</span>
                    {/* Fixed-width container for suffix to prevent width animation */}
                    <div className="relative w-20">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${item.id}-${item.text}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="absolute left-0 top-0"
                        >
                          {item.text}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Replay button in bottom right */}
        {hasAnimated && !isAnimating && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={startAnimation}
            className="absolute bottom-4 right-4 group isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5"
            title="Replay animation"
          >
            <span className="absolute inset-0 rounded-lg bg-white transition-all duration-100 ease-out-expo dark:bg-neutral-700 group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] z-0" />
            <span className="relative z-10 flex items-center gap-1 [font-variation-settings:'opsz'_14,'wght'_500] text-neutral-700 dark:text-white">
              Replay
            </span>
          </motion.button>
        )}
      </div>
      <ProseCaption>
        Evolving our color naming from natural language to a numerical scale.
      </ProseCaption>
    </div>
  );
}
