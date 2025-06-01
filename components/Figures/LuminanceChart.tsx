import React from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { colorPalette } from "./ColorPalette";

// Enhanced hex to LCH conversion for both luminance and chroma
function hexToLch(hex: string) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ color space
  const X = 0.4124 * rLinear + 0.3576 * gLinear + 0.1805 * bLinear;
  const Y = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  const Z = 0.0193 * rLinear + 0.1192 * gLinear + 0.9505 * bLinear;

  // Convert to LAB color space
  const xn = 0.95047; // D65 illuminant
  const yn = 1.0;
  const zn = 1.08883;

  const fx =
    X / xn > 0.008856 ? Math.pow(X / xn, 1 / 3) : 7.787 * (X / xn) + 16 / 116;
  const fy =
    Y / yn > 0.008856 ? Math.pow(Y / yn, 1 / 3) : 7.787 * (Y / yn) + 16 / 116;
  const fz =
    Z / zn > 0.008856 ? Math.pow(Z / zn, 1 / 3) : 7.787 * (Z / zn) + 16 / 116;

  const L = Y > 0.008856 ? 116 * Math.pow(Y, 1 / 3) - 16 : 903.3 * Y;
  const a = 500 * (fx - fy);
  const bStar = 200 * (fy - fz);

  // Convert LAB to LCH
  const C = Math.sqrt(a * a + bStar * bStar); // Chroma

  return {
    luminance: Math.max(0, Math.min(100, L)),
    chroma: Math.max(0, Math.min(150, C)), // Cap chroma at reasonable value
  };
}

// Get color name from the first color in each row (excluding gray)
const colorNames = ["Blue", "Green", "Red", "Purple", "Orange", "Yellow"];

// Prepare data for each color scale (excluding gray - last row)
const colorScales = colorPalette.slice(0, -1).map((row, index) => ({
  name: colorNames[index],
  color: row[4].hex, // Use the 500 shade as the main color
  data: row.map((color, shadeIndex) => {
    const lch = hexToLch(color.hex);
    return {
      shade: (shadeIndex + 1) * 100, // 100, 200, 300, etc.
      luminance: lch.luminance,
      chroma: lch.chroma,
      hex: color.hex,
    };
  }),
}));

// Custom legend component
const CustomLegend = (props: any) => {
  return (
    <div className="flex justify-center gap-6 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-0.5 bg-neutral-600 dark:bg-neutral-400 rounded-full"></div>
        <span>Luminance (perceptual brightness)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm"></div>
        <span>Chroma (saturation)</span>
      </div>
    </div>
  );
};

export function LuminanceChart() {
  const [currentColorIndex, setCurrentColorIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);

  const currentColor = colorScales[currentColorIndex];

  // Auto-cycle through colors
  React.useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorScales.length);
    }, 1200); // Faster cycling

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Start animation on intersection
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsAnimating(true);
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  return (
    <div
      ref={containerRef}
      className="bg-gray-100 dark:bg-neutral-800 border border-neutral-800/5 dark:border-white/5 rounded-2xl my-6 sm:my-12 py-6 sm:py-8 px-6 sm:px-8"
    >
      {/* Legend */}
      <CustomLegend />

      {/* Combined chart container */}
      <div className="h-60 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentColor.data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="shade"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "currentColor",
                fontSize: 12,
                className: "text-neutral-600 dark:text-neutral-400",
              }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              width={30}
              tick={{
                fill: "currentColor",
                fontSize: 12,
                className: "text-neutral-600 dark:text-neutral-400",
              }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              domain={[0, 150]}
              axisLine={false}
              tickLine={false}
              width={0}
              tick={false}
            />
            <Bar
              yAxisId="right"
              dataKey="chroma"
              animationDuration={400}
              animationEasing="ease-in-out"
              isAnimationActive={true}
              radius={[6, 6, 0, 0]}
            >
              {currentColor.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hex} />
              ))}
            </Bar>
            <Line
              yAxisId="left"
              type="natural"
              dataKey="luminance"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              activeDot={false}
              dot={false}
              stroke={null}
              className="stroke-gray-100 dark:stroke-neutral-800"
              animationDuration={400}
              animationEasing="ease-in-out"
              connectNulls={false}
              isAnimationActive={true}
            />
            <Line
              yAxisId="left"
              type="natural"
              dataKey="luminance"
              stroke={currentColor.color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              activeDot={false}
              dot={false}
              animationDuration={400}
              animationEasing="ease-in-out"
              connectNulls={false}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
