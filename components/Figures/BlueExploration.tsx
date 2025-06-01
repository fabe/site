import React from "react";
import { Tooltip } from "../Tooltip";

export function BlueExploration() {
  // 5 different shades of blue representing the exploration process
  const blueShades = [
    { color: "#3E72A9", name: "The OG" },
    { color: "#1175e0", name: "Maybe more saturated?" },
    { color: "#1E70DD", name: "Maybe less saturated?" },
    { color: "#306CC4", name: "Darker?" },
    { color: "#036FE3", name: "That's the one!" },
  ];

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="bg-gray-100 dark:bg-neutral-800 border border-neutral-800/5 dark:border-white/5 rounded-2xl my-6 sm:my-12 py-10 sm:py-16 px-6 sm:px-8 relative overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 0.5px, transparent 0.5px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Blue shades container */}
      <div className="relative flex justify-center">
        <div className="relative flex rounded-xl shadow-sm">
          {/* Single inset border around the whole container */}
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-white/30 dark:border-white/20 rounded-lg pointer-events-none" />

          {blueShades.map((shade, index) => (
            <div
              key={index}
              className={`relative aspect-square w-16 sm:w-20 "border-2 border-white ${
                index === 0 ? "rounded-s-2xl" : ""
              } ${index === 4 ? "rounded-e-2xl" : ""} `}
              style={{ backgroundColor: shade.color }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Tooltip open={hoveredIndex === index}>{shade.name}</Tooltip>
              <div className="absolute inset-0 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
