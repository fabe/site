import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const colorPalette = [
  [
    { name: "blue-100", hex: "#E8F5FF" },
    { name: "blue-200", hex: "#CEECFF" },
    { name: "blue-300", hex: "#98CBFF" },
    { name: "blue-400", hex: "#40A0FF" },
    { name: "blue-500", hex: "#036FE3" },
    { name: "blue-600", hex: "#0059C8" },
    { name: "blue-700", hex: "#0041AB" },
    { name: "blue-800", hex: "#003298" },
    { name: "blue-900", hex: "#002A8E" },
  ],
  [
    { name: "green-100", hex: "#EAF9E8" },
    { name: "green-200", hex: "#CDF3C6" },
    { name: "green-300", hex: "#9ED696" },
    { name: "green-400", hex: "#5DB057" },
    { name: "green-500", hex: "#008539" },
    { name: "green-600", hex: "#006D23" },
    { name: "green-700", hex: "#00550C" },
    { name: "green-800", hex: "#004700" },
    { name: "green-900", hex: "#003F00" },
  ],

  [
    { name: "red-100", hex: "#FFF2F2" },
    { name: "red-200", hex: "#FFE0E0" },
    { name: "red-300", hex: "#FFB1B2" },
    { name: "red-400", hex: "#FF707D" },
    { name: "red-500", hex: "#DA294A" },
    { name: "red-600", hex: "#BD002A" },
    { name: "red-700", hex: "#990017" },
    { name: "red-800", hex: "#7F0010" },
    { name: "red-900", hex: "#72000E" },
  ],
  [
    { name: "purple-100", hex: "#F7F2FF" },
    { name: "purple-200", hex: "#EDE3FF" },
    { name: "purple-300", hex: "#D1BBFF" },
    { name: "purple-400", hex: "#AE89FF" },
    { name: "purple-500", hex: "#8553E7" },
    { name: "purple-600", hex: "#6C3ECF" },
    { name: "purple-700", hex: "#5127B5" },
    { name: "purple-800", hex: "#3E16A4" },
    { name: "purple-900", hex: "#340E9C" },
  ],
  [
    { name: "orange-100", hex: "#FFF2E4" },
    { name: "orange-200", hex: "#FDE5C0" },
    { name: "orange-300", hex: "#FDB882" },
    { name: "orange-400", hex: "#F07F23" },
    { name: "orange-500", hex: "#CC4500" },
    { name: "orange-600", hex: "#B12D00" },
    { name: "orange-700", hex: "#892300" },
    { name: "orange-800", hex: "#731A00" },
    { name: "orange-900", hex: "#631C00" },
  ],
  [
    { name: "yellow-100", hex: "#FEF9DF" },
    { name: "yellow-200", hex: "#FFF6CC" },
    { name: "yellow-300", hex: "#FFE993" },
    { name: "yellow-400", hex: "#FFD960" },
    { name: "yellow-500", hex: "#FFC835" },
    { name: "yellow-600", hex: "#EAAF09" },
    { name: "yellow-700", hex: "#B78300" },
    { name: "yellow-800", hex: "#956300" },
    { name: "yellow-900", hex: "#7F5200" },
  ],
  [
    { name: "gray-100", hex: "#F7F9FA" },
    { name: "gray-200", hex: "#E7EBEE" },
    { name: "gray-300", hex: "#CFD9E0" },
    { name: "gray-400", hex: "#AEC1CC" },
    { name: "gray-500", hex: "#67728A" },
    { name: "gray-600", hex: "#5A657C" },
    { name: "gray-700", hex: "#414D63" },
    { name: "gray-800", hex: "#1B273A" },
    { name: "gray-900", hex: "#111B2B" },
  ],
];

export function ColorPalette() {
  const [selectedColor, setSelectedColor] = React.useState<{
    name: string;
    hex: string;
    row: number;
    col: number;
  }>(null);

  const [selectorPosition, setSelectorPosition] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const swatchRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );

  const handleColorSelect = (
    color: any,
    rowIndex: number,
    colIndex: number,
  ) => {
    const newSelection = {
      ...color,
      row: rowIndex,
      col: colIndex,
    };
    setSelectedColor(newSelection);

    // Calculate position based on actual swatch position
    const swatchKey = `${rowIndex}-${colIndex}`;
    const swatchElement = swatchRefs.current[swatchKey];
    const gridElement = gridRef.current;

    if (swatchElement && gridElement) {
      const swatchRect = swatchElement.getBoundingClientRect();
      const gridRect = gridElement.getBoundingClientRect();

      setSelectorPosition({
        x: swatchRect.left - gridRect.left,
        y: swatchRect.top - gridRect.top,
        width: swatchRect.width,
        height: swatchRect.height,
      });
    }
  };

  // Recalculate selector position on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (!selectedColor) return;

      const swatchKey = `${selectedColor.row}-${selectedColor.col}`;
      const swatchElement = swatchRefs.current[swatchKey];
      const gridElement = gridRef.current;

      if (swatchElement && gridElement) {
        const swatchRect = swatchElement.getBoundingClientRect();
        const gridRect = gridElement.getBoundingClientRect();

        setSelectorPosition({
          x: swatchRect.left - gridRect.left,
          y: swatchRect.top - gridRect.top,
          width: swatchRect.width,
          height: swatchRect.height,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedColor]);

  return (
    <div className="bg-gray-100 relative dark:bg-neutral-800 border border-neutral-800/5 dark:border-white/5 rounded-2xl my-6 sm:my-12 py-6 sm:py-8 px-6 sm:px-8">
      {/* Color grid */}
      <div ref={gridRef} className="relative w-full rounded-lg">
        <div className="">
          {colorPalette.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full">
              {row.map((color, colIndex) => (
                <button
                  key={color.name}
                  ref={(el) => {
                    swatchRefs.current[`${rowIndex}-${colIndex}`] = el;
                  }}
                  onClick={() => handleColorSelect(color, rowIndex, colIndex)}
                  className="aspect-square"
                  style={{
                    backgroundColor: color.hex,
                    width: "calc(11.11%)", // (100% - 8*1%) / 9 = 10.22%, but using 11.11% - gap adjustment
                    borderTopLeftRadius:
                      colIndex === 0 && rowIndex === 0 ? "0.5rem" : "0",
                    borderTopRightRadius:
                      colIndex === 8 && rowIndex === 0 ? "0.5rem" : "0",
                    borderBottomLeftRadius:
                      colIndex === 0 && rowIndex === 6 ? "0.5rem" : "0",
                    borderBottomRightRadius:
                      colIndex === 8 && rowIndex === 6 ? "0.5rem" : "0",
                  }}
                  title={`${color.name}: ${color.hex}`}
                />
              ))}
            </div>
          ))}
          <div className="absolute inset-0 pointer-events-none rounded-lg box-border border border-neutral-800/5 dark:border-white/5"></div>
        </div>

        {/* Floating white border selector */}
        <AnimatePresence>
          {selectorPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: selectorPosition.x,
                y: selectorPosition.y,
              }}
              transition={{
                x: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                y: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 },
              }}
              className="absolute pointer-events-none aspect-square rounded-sm sm:rounded-lg border-2 sm:border-4 border-white"
              style={{
                left: 0,
                top: 0,
                width: selectorPosition.width + 2,
                height: selectorPosition.height + 2,
                marginLeft: "-1px",
                marginTop: "-1px",
                boxShadow: `
                  0 0 0 1px rgba(0, 0, 0, 0.05),
                  0 1px 2px 0 rgba(0, 0, 0, 0.05),
                  0 2px 4px 0 rgba(0, 0, 0, 0.04),
                  0 4px 8px 0 rgba(0, 0, 0, 0.03),
                  inset 0 1px 2px 0 rgba(0, 0, 0, 0.06),
                  inset 0 1px 1px 0 rgba(0, 0, 0, 0.04)
                `,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer with selected color info */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {selectedColor ? (
            <motion.div
              key={selectedColor.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div>
                <div className="font-medium">{selectedColor.name}</div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase">
                  {selectedColor.hex}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="font-medium">The full color palette</div>
              <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase">
                Click to see details
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
