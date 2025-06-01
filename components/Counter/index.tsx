import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";

interface CounterProps {
  value: number;
  label: string;
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k`;
  }
  return num.toString().padStart(3, "0");
};

export default function Counter({ value, label }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [numbers, setNumbers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("000");

  useEffect(() => {
    if (!isInView) {
      setNumbers([formatNumber(0)]);
      setCurrentNumber(formatNumber(0));
      return;
    }

    // Generate intermediate numbers
    const steps = 15;
    const increment = value / steps;
    const nums = Array.from({ length: steps }, (_, i) => {
      const num = Math.round(increment * (i + 1));
      return formatNumber(num);
    });

    // Ensure the final number is exactly the target value
    nums[nums.length - 1] = formatNumber(value);
    setNumbers(nums);
    setCurrentNumber(formatNumber(value));
    setIsTransitioning(true);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="col-span-1 rounded-2xl bg-gray-100 dark:bg-neutral-900/75 p-4 text-center"
      role="group"
      aria-labelledby={`counter-label-${value}`}
    >
      <div className="relative h-9 overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {isTransitioning && (
            <>
              <motion.div
                className="absolute left-0 right-0 top-0 h-4 bg-gradient-to-b from-gray-100 dark:from-neutral-900/50 to-transparent z-10 dark:mix-blend-darken"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-t from-gray-100 dark:from-neutral-900/75 to-transparent z-10 dark:mix-blend-darken"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          className="font-semibold text-2xl sm:text-3xl text-neutral-900 dark:text-white"
          initial={{ y: 0 }}
          animate={
            isInView
              ? {
                  y: `-${((numbers.length - 1) / numbers.length) * 100}%`,
                }
              : { y: 0 }
          }
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
          }}
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => {
            setTimeout(() => setIsTransitioning(false), 400);
          }}
        >
          {numbers.map((num, i) => (
            <div key={i}>{num}</div>
          ))}
        </motion.div>
      </div>

      {/* Hidden but accessible version for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentNumber} {label}
      </div>

      <div
        id={`counter-label-${value}`}
        className="text-neutral-500 dark:text-silver-dark text-sm mt-1"
      >
        {label}
      </div>
    </div>
  );
}
